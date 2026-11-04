import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getOrCreateUserData } from "@/lib/data/user-store";

export async function GET() {
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { authenticated: false, error: "कृपया पहले लॉगिन करें।" },
        { status: 401 }
      );
    }

    // Isolate data by user ID
    const userData = getOrCreateUserData(
      authUser.id,
      authUser.full_name,
      authUser.phone
    );

    // Calculate aggregated stats
    const totalTests = userData.mockTestResults.length;
    const avgAccuracy = totalTests > 0
      ? Math.round(userData.mockTestResults.reduce((acc, curr) => acc + curr.accuracy, 0) / totalTests)
      : 0;
    const totalStudyHours = userData.studyProgress.reduce((acc, curr) => acc + curr.hoursSpent, 0);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: authUser.id,
        phone: authUser.phone || userData.phone,
        fullName: userData.fullName || authUser.full_name,
        qualification: userData.qualification,
        classLevel: userData.classLevel,
        state: userData.state,
        district: userData.district,
      },
      stats: {
        savedJobsCount: userData.savedJobs.length,
        savedJobsTrend: "+2 नए जोड़े गए",
        mockTestsCount: totalTests,
        mockTestsTrend: "+1 इस सप्ताह",
        avgAccuracy: avgAccuracy,
        accuracyTrend: "+6% बेहतर",
        totalStudyHours: totalStudyHours,
        studyHoursTrend: "सक्रिय तैयारी",
        activeAlerts: 4,
      },
      savedJobs: userData.savedJobs,
      recentMockTests: userData.mockTestResults,
      studyProgress: userData.studyProgress,
      examAlerts: [
        {
          id: "alert-1",
          title: "SSC GD Constable 2026 परीक्षा तिथि घोषित",
          date: "15 जनवरी 2027",
          status: "महत्वपूर्ण",
          type: "Exam Date",
        },
        {
          id: "alert-2",
          title: "JNVST Class 6 Navodaya Admit Card 2026 जारी",
          date: "लाइव डाउनलोड",
          status: "उपलब्ध",
          type: "Admit Card",
        },
        {
          id: "alert-3",
          title: "UP Police Constable Answer Key 2026",
          date: "आपत्ति दर्ज करें",
          status: "अंतिम 3 दिन",
          type: "Answer Key",
        },
      ],
    });
  } catch (error: any) {
    console.error("[Dashboard Data Route Error]", error);
    return NextResponse.json(
      { authenticated: false, error: "डैशबोर्ड डेटा लोड करने में त्रुटि।" },
      { status: 500 }
    );
  }
}
