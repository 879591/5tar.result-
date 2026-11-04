import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.set("5tar_verified_phone", "", {
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    });
    cookieStore.set("5tar_user_name", "", {
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({ success: true, message: "सफलतापूर्वक लॉगआउट किया गया।" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "लॉगआउट में त्रुटि।" });
  }
}
