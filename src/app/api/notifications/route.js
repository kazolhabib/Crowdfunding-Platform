import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";
import { verifyJWT } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.email) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const notifications = await Notification.find({ toEmail: payload.email.toLowerCase() })
      .sort({ time: -1 })
      .limit(50);

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.email) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    await Notification.updateMany(
      { toEmail: payload.email.toLowerCase(), read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    console.error("Update notifications error:", error);
    return NextResponse.json({ error: "Failed to update notifications." }, { status: 500 });
  }
}
