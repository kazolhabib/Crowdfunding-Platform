import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Campaign from "@/lib/models/Campaign";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const campaigns = await Campaign.find({
      status: "approved",
      deadline: { $gte: today },
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error("Explore campaigns error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns." }, { status: 500 });
  }
}
