import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Campaign from "@/lib/models/Campaign";
import Report from "@/lib/models/Report";
import { verifyJWT } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    const { reason } = await req.json();

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: "A reason is required to submit a report." }, { status: 400 });
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
    }

    const report = new Report({
      campaign_id: campaign._id,
      campaign_title: campaign.title,
      reporter_name: payload.name || "Supporter",
      reporter_email: payload.email,
      reason: reason.trim(),
    });

    await report.save();

    return NextResponse.json({ success: true, message: "Campaign reported successfully." });
  } catch (error) {
    console.error("Submit campaign report error:", error);
    return NextResponse.json({ error: "Failed to submit report." }, { status: 500 });
  }
}
