export interface SavedJobItem {
  id: string;
  title: string;
  department: string;
  qualification: string;
  vacancies: string;
  lastDate: string;
  salary: string;
  savedAt: string;
}

export interface MockTestResultItem {
  id: string;
  testId: string;
  testTitle: string;
  category: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  attemptedAt: string;
  timeSpentMinutes: number;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

export interface StudySubjectProgress {
  subject: string;
  hindiName: string;
  completionPercentage: number;
  totalTopics: number;
  completedTopics: number;
  trend: string;
  hoursSpent: number;
  color: string;
}

export interface UserDataRecord {
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  qualification: string;
  classLevel: string;
  state: string;
  district: string;
  dob: string;
  savedJobs: SavedJobItem[];
  mockTestResults: MockTestResultItem[];
  studyProgress: StudySubjectProgress[];
  lastLoginAt: string;
}

// Global in-memory user registry attached to globalThis to persist across requests
const globalData = globalThis as unknown as { __5tarUserDataStore?: Map<string, UserDataRecord> };
if (!globalData.__5tarUserDataStore) {
  globalData.__5tarUserDataStore = new Map<string, UserDataRecord>();
}
const userStore = globalData.__5tarUserDataStore;

/**
 * Returns or initializes user's isolated data record
 */
export function getOrCreateUserData(userId: string, defaultName?: string, defaultPhone?: string): UserDataRecord {
  const existing = userStore.get(userId);
  if (existing) {
    if (defaultName && existing.fullName === "विद्यार्थी") {
      existing.fullName = defaultName;
    }
    if (defaultPhone && !existing.phone) {
      existing.phone = defaultPhone;
    }
    return existing;
  }

  // Initial personalized mock test & study baseline tailored for this user
  const initialRecord: UserDataRecord = {
    userId,
    fullName: defaultName || "विद्यार्थी",
    phone: defaultPhone || "",
    qualification: "12th",
    classLevel: "Competition",
    state: "Uttar Pradesh",
    district: "वाराणसी",
    dob: "2002-05-15",
    savedJobs: [
      {
        id: "job-1",
        title: "SSC GD Constable Recruitment 2026",
        department: "Staff Selection Commission (SSC)",
        qualification: "10th",
        vacancies: "45,284",
        lastDate: "30 Nov 2026",
        salary: "₹21,700 - ₹69,100",
        savedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "job-2",
        title: "UP Police SI & Constable Direct Bharti 2026",
        department: "UPPRPB Lucknow",
        qualification: "12th",
        vacancies: "12,500",
        lastDate: "15 Dec 2026",
        salary: "₹21,700 - ₹58,000",
        savedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "job-3",
        title: "Railway RRB Group D & Technician Vacancy",
        department: "Railway Recruitment Board",
        qualification: "ITI",
        vacancies: "32,000",
        lastDate: "05 Jan 2027",
        salary: "₹19,900 - ₹63,200",
        savedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    mockTestResults: [
      {
        id: "attempt-1",
        testId: "mock-1",
        testTitle: "SSC GD Constable 2026 - All India Live Mock Test 01",
        category: "SSC",
        score: 136,
        totalMarks: 160,
        accuracy: 88,
        attemptedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        timeSpentMinutes: 52,
        trend: "up",
        trendValue: "+14% vs पिछला टेस्ट",
      },
      {
        id: "attempt-2",
        testId: "mock-3",
        testTitle: "UP Police Constable GK, Hindi & Reasoning Mega Test",
        category: "Police",
        score: 84,
        totalMarks: 100,
        accuracy: 84,
        attemptedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        timeSpentMinutes: 38,
        trend: "up",
        trendValue: "शीर्ष 5% रैंक",
      },
      {
        id: "attempt-3",
        testId: "mock-4",
        testTitle: "Railway RRB General Science & Current Affairs Speed Test",
        category: "Railway",
        score: 34,
        totalMarks: 40,
        accuracy: 85,
        attemptedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        timeSpentMinutes: 24,
        trend: "neutral",
        trendValue: "समान स्कोर",
      },
    ],
    studyProgress: [
      {
        subject: "General Knowledge",
        hindiName: "सामान्य ज्ञान व समसामयिकी",
        completionPercentage: 76,
        totalTopics: 50,
        completedTopics: 38,
        trend: "+8% इस सप्ताह",
        hoursSpent: 28,
        color: "from-amber-500 to-yellow-400",
      },
      {
        subject: "Quantitative Aptitude",
        hindiName: "प्रारंभिक गणित (Mathematics)",
        completionPercentage: 64,
        totalTopics: 42,
        completedTopics: 27,
        trend: "+12% इस सप्ताह",
        hoursSpent: 22,
        color: "from-blue-500 to-indigo-400",
      },
      {
        subject: "Reasoning Ability",
        hindiName: "तर्कशक्ति एवं मानसिक योग्यता",
        completionPercentage: 88,
        totalTopics: 35,
        completedTopics: 31,
        trend: "+5% इस सप्ताह",
        hoursSpent: 34,
        color: "from-emerald-500 to-teal-400",
      },
      {
        subject: "General Hindi",
        hindiName: "सामान्य हिंदी व्याकरण",
        completionPercentage: 92,
        totalTopics: 25,
        completedTopics: 23,
        trend: "+15% इस सप्ताह",
        hoursSpent: 19,
        color: "from-purple-500 to-pink-400",
      },
    ],
    lastLoginAt: new Date().toISOString(),
  };

  userStore.set(userId, initialRecord);
  return initialRecord;
}

export function updateUserData(userId: string, partial: Partial<UserDataRecord>): UserDataRecord {
  const current = getOrCreateUserData(userId);
  const updated: UserDataRecord = {
    ...current,
    ...partial,
  };
  userStore.set(userId, updated);
  return updated;
}
