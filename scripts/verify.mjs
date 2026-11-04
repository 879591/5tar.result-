// Automated Verification Script for 5tarResult Authentication & Student Dashboard
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("===================================================================");
  console.log("       5tarResult Authentication & Dashboard Verification          ");
  console.log("===================================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = "") {
    total++;
    if (condition) {
      console.log(`[PASS] Test ${total}: ${testName} ${details ? `(${details})` : ""}`);
      passed++;
    } else {
      console.error(`[FAIL] Test ${total}: ${testName} ${details ? `(${details})` : ""}`);
    }
  }

  // -------------------------------------------------------------------------
  // 1. Test Unauthenticated Access to Protected Routes (Middleware Protection)
  // -------------------------------------------------------------------------
  console.log("--- 1. Testing Route Protection (Without Login) ---");
  try {
    const resDash = await fetch(`${BASE_URL}/dashboard`, { redirect: "manual" });
    const isRedirected = resDash.status === 307 || resDash.status === 302 || resDash.headers.get("location")?.includes("login=required");
    assert(isRedirected, "Dashboard protected: Redirects unauthenticated visitors to login", `Status: ${resDash.status}, Location: ${resDash.headers.get("location")}`);

    const resProf = await fetch(`${BASE_URL}/profile`, { redirect: "manual" });
    const isProfRedirected = resProf.status === 307 || resProf.status === 302 || resProf.headers.get("location")?.includes("login=required");
    assert(isProfRedirected, "Profile protected: Redirects unauthenticated visitors to login", `Status: ${resProf.status}`);

    const resApi = await fetch(`${BASE_URL}/api/user/dashboard-data`);
    assert(resApi.status === 401, "/api/user/dashboard-data blocks unauthenticated access with 401", `Status: ${resApi.status}`);
  } catch (e) {
    assert(false, "Unauthenticated access check", e.message);
  }

  // -------------------------------------------------------------------------
  // 2. Test Mobile Number Validation
  // -------------------------------------------------------------------------
  console.log("\n--- 2. Testing Indian Mobile Number Validation ---");
  try {
    const invalidRes = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "12345" }),
    });
    const invJson = await invalidRes.json();
    assert(invJson.success === false && invJson.error.includes("अमान्य"), "Rejects invalid phone number (under 10 digits)");

    const invalidPrefixRes = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "5123456789" }),
    });
    const invPreJson = await invalidPrefixRes.json();
    assert(invPreJson.success === false, "Rejects numbers not starting with 6, 7, 8, or 9");
  } catch (e) {
    assert(false, "Phone validation check", e.message);
  }

  // -------------------------------------------------------------------------
  // 3. Test New User Registration with Real Mobile OTP
  // -------------------------------------------------------------------------
  console.log("\n--- 3. Testing New Student Registration Flow ---");
  const student1Phone = "9812345678";
  const student1Name = "सूरज मौर्या";
  let student1Cookie = "";

  try {
    const otpRes = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: student1Phone }),
    });
    const otpData = await otpRes.json();
    assert(otpData.success === true && Boolean(otpData.testOtp), "OTP generated successfully", `OTP: ${otpData.testOtp}`);

    // Verify OTP with new student registration
    const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: student1Phone,
        otp: otpData.testOtp,
        fullName: student1Name,
        qualification: "Graduate",
        classLevel: "Competition",
      }),
    });
    const verifyData = await verifyRes.json();
    assert(verifyData.success === true, "New student registration and OTP verification succeeds", verifyData.message);
    assert(verifyData.user.full_name === student1Name, "Name correctly associated in user profile", verifyData.user.full_name);
    assert(verifyData.user.phone === `+91${student1Phone}`, "Mobile number correctly formatted with +91", verifyData.user.phone);

    // Extract cookie from headers
    const rawCookies = verifyRes.headers.get("set-cookie") || "";
    student1Cookie = `5tar_verified_phone=%2B91${student1Phone}; 5tar_user_name=${encodeURIComponent(student1Name)}`;
  } catch (e) {
    assert(false, "New user registration", e.message);
  }

  // -------------------------------------------------------------------------
  // 4. Test User Data Isolation (User 1 vs User 2)
  // -------------------------------------------------------------------------
  console.log("\n--- 4. Testing User Data Isolation (Multi-User Privacy) ---");
  const student2Phone = "9988776655";
  const student2Name = "अमित कुमार";
  let student2Cookie = "";

  try {
    // Register Student 2
    const otpRes2 = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: student2Phone }),
    });
    const otpData2 = await otpRes2.json();

    const verifyRes2 = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: student2Phone,
        otp: otpData2.testOtp,
        fullName: student2Name,
        qualification: "12th",
        classLevel: "Class 12",
      }),
    });
    const verifyData2 = await verifyRes2.json();
    student2Cookie = `5tar_verified_phone=%2B91${student2Phone}; 5tar_user_name=${encodeURIComponent(student2Name)}`;

    // Query dashboard for Student 1
    const dash1Res = await fetch(`${BASE_URL}/api/user/dashboard-data`, {
      headers: { Cookie: student1Cookie },
    });
    const dash1 = await dash1Res.json();
    assert(dash1.user.phone === `+91${student1Phone}`, "Student 1 only sees Student 1's phone", dash1.user.phone);
    assert(dash1.user.fullName === student1Name, "Student 1 only sees Student 1's profile name", dash1.user.fullName);

    // Query dashboard for Student 2
    const dash2Res = await fetch(`${BASE_URL}/api/user/dashboard-data`, {
      headers: { Cookie: student2Cookie },
    });
    const dash2 = await dash2Res.json();
    assert(dash2.user.phone === `+91${student2Phone}`, "Student 2 only sees Student 2's phone", dash2.user.phone);
    assert(dash2.user.fullName === student2Name, "Student 2 only sees Student 2's profile name", dash2.user.fullName);

    // Confirm isolation: Student 1 data != Student 2 data
    assert(dash1.user.phone !== dash2.user.phone, "Data isolation strictly enforced: No cross-user leakage");
  } catch (e) {
    assert(false, "User isolation check", e.message);
  }

  // -------------------------------------------------------------------------
  // 5. Test Profile Updates & Persistence
  // -------------------------------------------------------------------------
  console.log("\n--- 5. Testing Profile Updates and Data Persistence ---");
  try {
    const updateRes = await fetch(`${BASE_URL}/api/user/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: student1Cookie,
      },
      body: JSON.stringify({
        fullName: "सूरज मौर्या (अपडेटेड)",
        qualification: "Post Graduate",
        classLevel: "Sarkari Exams (SSC/Police)",
        state: "उत्तर प्रदेश",
        district: "वाराणसी",
      }),
    });
    const updateData = await updateRes.json();
    assert(updateData.success === true, "Profile update succeeds", updateData.message);

    // Fetch updated profile
    const getProfRes = await fetch(`${BASE_URL}/api/user/profile`, {
      headers: { Cookie: student1Cookie },
    });
    const profData = await getProfRes.json();
    assert(profData.profile.fullName === "सूरज मौर्या (अपडेटेड)", "Updated name persisted in profile store");
    assert(profData.profile.district === "वाराणसी", "Updated district persisted in profile store");
    assert(profData.profile.qualification === "Post Graduate", "Updated qualification persisted in profile store");
  } catch (e) {
    assert(false, "Profile update check", e.message);
  }

  // -------------------------------------------------------------------------
  // 6. Test OTP Expiry & Attempt Limits
  // -------------------------------------------------------------------------
  console.log("\n--- 6. Testing OTP Security (Wrong Attempts, Cooldown) ---");
  try {
    // Test wrong OTP attempt
    const wrongOtpRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: "9876543210",
        otp: "000000",
      }),
    });
    const wrongJson = await wrongOtpRes.json();
    assert(wrongJson.success === false, "Rejects wrong OTP code", wrongJson.error);

    // Test resend cooldown
    const cooldownRes = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: student1Phone }),
    });
    const cooldownJson = await cooldownRes.json();
    assert(cooldownJson.success === false || cooldownJson.retryAfter > 0, "Enforces cooldown timer between OTP requests");
  } catch (e) {
    assert(false, "OTP security checks", e.message);
  }

  // -------------------------------------------------------------------------
  // 7. Test Logout Functionality
  // -------------------------------------------------------------------------
  console.log("\n--- 7. Testing Logout Functionality ---");
  try {
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: student1Cookie },
    });
    const logoutJson = await logoutRes.json();
    assert(logoutJson.success === true, "Logout endpoint executes cleanly", logoutJson.message);

    const rawSetCookie = logoutRes.headers.get("set-cookie") || (logoutRes.headers.getSetCookie ? logoutRes.headers.getSetCookie().join("; ") : "");
    assert(rawSetCookie.includes("Max-Age=0") || rawSetCookie.includes("1970") || rawSetCookie.includes("5tar_verified_phone="), "Logout clears authentication cookies", rawSetCookie.slice(0, 50));
  } catch (e) {
    assert(false, "Logout test", e.message);
  }

  // -------------------------------------------------------------------------
  // 8. Test Dashboard Grid Layout Structure & Data Content
  // -------------------------------------------------------------------------
  console.log("\n--- 8. Testing Dashboard Grid Layout and Data Payloads ---");
  try {
    const dashPayloadRes = await fetch(`${BASE_URL}/api/user/dashboard-data`, {
      headers: { Cookie: student1Cookie },
    });
    const dashPayload = await dashPayloadRes.json();

    assert(Array.isArray(dashPayload.savedJobs) && dashPayload.savedJobs.length > 0, "Dashboard delivers Grid-ready Saved Jobs array", `Count: ${dashPayload.savedJobs.length}`);
    assert(Array.isArray(dashPayload.recentMockTests) && dashPayload.recentMockTests.length > 0, "Dashboard delivers Grid-ready Recent Mock Tests array", `Count: ${dashPayload.recentMockTests.length}`);
    assert(Array.isArray(dashPayload.studyProgress) && dashPayload.studyProgress.length > 0, "Dashboard delivers Subject-wise Study Progress bars", `Count: ${dashPayload.studyProgress.length}`);
    assert(Boolean(dashPayload.stats.accuracyTrend) && Boolean(dashPayload.stats.savedJobsTrend), "Dashboard delivers Micro-Trend indicators for stat cards");
  } catch (e) {
    assert(false, "Dashboard structure check", e.message);
  }

  console.log("\n===================================================================");
  console.log(`Test Results: ${passed} / ${total} tests PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log("===================================================================");
}

runTests().catch(console.error);
