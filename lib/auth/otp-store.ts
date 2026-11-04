import crypto from "crypto";

interface StoredOtpRecord {
  phone: string;
  otpHash: string;
  salt: string;
  expiresAt: number; // timestamp in ms
  attempts: number;
  lastSentAt: number; // timestamp in ms
  sendCountInWindow: number;
  windowStart: number;
}

// Global in-memory map backed by crypto hash storage attached to globalThis
// Persists across separate Next.js route chunks in the active server process
const globalAny = globalThis as unknown as { __5tarOtpStore?: Map<string, StoredOtpRecord> };
if (!globalAny.__5tarOtpStore) {
  globalAny.__5tarOtpStore = new Map<string, StoredOtpRecord>();
}
const globalOtpStore = globalAny.__5tarOtpStore;

const COOLDOWN_SECONDS = 60;
const EXPIRY_SECONDS = 300; // 5 minutes
const MAX_ATTEMPTS = 3;
const MAX_SENDS_PER_HOUR = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Normalizes Indian mobile number to 10 digits
 */
export function normalizeIndianPhone(inputPhone: string): string | null {
  if (!inputPhone) return null;
  const digits = inputPhone.replace(/\D/g, "");
  // If includes 91 prefix and is 12 digits, strip 91
  if (digits.length === 12 && digits.startsWith("91")) {
    const core = digits.slice(2);
    return /^[6-9]\d{9}$/.test(core) ? core : null;
  }
  // If 11 digits starting with 0, strip 0
  if (digits.length === 11 && digits.startsWith("0")) {
    const core = digits.slice(1);
    return /^[6-9]\d{9}$/.test(core) ? core : null;
  }
  // Exactly 10 digits starting with 6, 7, 8, or 9
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return digits;
  }
  return null;
}

/**
 * Creates cryptographically salted SHA-256 hash of the OTP
 * OTP is NEVER stored in plain text
 */
function hashOtp(otp: string, salt: string): string {
  return crypto
    .createHash("sha256")
    .update(`${salt}:${otp}:${process.env.ADMIN_PASSCODE || "5tar-secret-salt"}`)
    .digest("hex");
}

/**
 * Checks rate limits and records a newly generated OTP
 */
export function registerNewOtp(phone10: string, rawOtp: string): { success: boolean; error?: string; retryAfterSeconds?: number } {
  const now = Date.now();
  const existing = globalOtpStore.get(phone10);

  if (existing) {
    // 1. Check 60-second cooldown
    const secondsSinceLastSend = Math.floor((now - existing.lastSentAt) / 1000);
    if (secondsSinceLastSend < COOLDOWN_SECONDS) {
      return {
        success: false,
        error: `कृपया पुनः OTP भेजने के लिए ${COOLDOWN_SECONDS - secondsSinceLastSend} सेकंड प्रतीक्षा करें।`,
        retryAfterSeconds: COOLDOWN_SECONDS - secondsSinceLastSend,
      };
    }

    // 2. Check 1-hour rate limiting window
    if (now - existing.windowStart < RATE_LIMIT_WINDOW_MS) {
      if (existing.sendCountInWindow >= MAX_SENDS_PER_HOUR) {
        return {
          success: false,
          error: "इस नंबर पर 1 घंटे की अधिकतम OTP सीमा पूरी हो चुकी है। कृपया 1 घंटे बाद प्रयास करें।",
        };
      }
    }
  }

  // Generate unique cryptographic salt for this OTP
  const salt = crypto.randomBytes(16).toString("hex");
  const otpHash = hashOtp(rawOtp, salt);

  const windowStart = existing && (now - existing.windowStart < RATE_LIMIT_WINDOW_MS) ? existing.windowStart : now;
  const sendCountInWindow = existing && (now - existing.windowStart < RATE_LIMIT_WINDOW_MS) ? existing.sendCountInWindow + 1 : 1;

  globalOtpStore.set(phone10, {
    phone: phone10,
    otpHash,
    salt,
    expiresAt: now + EXPIRY_SECONDS * 1000,
    attempts: 0,
    lastSentAt: now,
    sendCountInWindow,
    windowStart,
  });

  return { success: true };
}

/**
 * Verifies a submitted OTP against the stored salted hash
 */
export function verifyStoredOtp(phone10: string, submittedOtp: string): { success: boolean; error?: string } {
  const now = Date.now();
  const record = globalOtpStore.get(phone10);

  if (!record) {
    return {
      success: false,
      error: "इस नंबर पर कोई सक्रिय OTP नहीं मिला। कृपया 'OTP भेजें' पर क्लिक करें।",
    };
  }

  // 1. Check Expiry (5 minutes)
  if (now > record.expiresAt) {
    globalOtpStore.delete(phone10);
    return {
      success: false,
      error: "यह OTP समाप्त (Expired) हो चुका है। कृपया नया OTP मंगाएं।",
    };
  }

  // 2. Check Attempts (Max 3)
  if (record.attempts >= MAX_ATTEMPTS) {
    globalOtpStore.delete(phone10);
    return {
      success: false,
      error: "लगातार 3 गलत प्रयासों के कारण यह OTP रद्द कर दिया गया है। नया OTP प्राप्त करें।",
    };
  }

  // 3. Verify Hash
  const computedHash = hashOtp(submittedOtp.trim(), record.salt);
  if (computedHash !== record.otpHash) {
    record.attempts += 1;
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      success: false,
      error: `गलत OTP कोड! आपके पास ${remaining} प्रयास शेष हैं।`,
    };
  }

  // 4. Verification successful -> Invalidate OTP code to prevent replay attacks, while preserving lastSentAt for cooldown
  record.otpHash = "";
  record.expiresAt = 0;
  return { success: true };
}
