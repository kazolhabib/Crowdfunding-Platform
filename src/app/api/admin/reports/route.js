import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Report from "@/lib/models/Report";
import Campaign from "@/lib/models/Campaign";
import { requireAdmin } from "@/lib/admin";
import { createNotification } from "@/lib/notifications";
import { deleteCampaignAndRefund } from "@/lib/campaigns";

export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const reports = await Report.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("Admin reports error:", error);
    return NextResponse.json({ error: "Failed to fetch reports." }, { status: 500 });
  }
}

export async function PATCH(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { reportId, action } = await req.json();
    if (!reportId || !["suspend", "delete"].includes(action)) {
      return NextResponse.json({ error: "A report and valid action are required." }, { status: 400 });
    }
    const report = await Report.findById(reportId);
    if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });

    if (action === "delete") {
      const campaign = await deleteCampaignAndRefund(report.campaign_id);
      if (!campaign) return NextResponse.json({ error: "Campaign no longer exists." }, { status: 404 });
      return NextResponse.json({ success: true, action: "deleted" });
    }

    const campaign = await Campaign.findByIdAndUpdate(report.campaign_id, { $set: { status: "rejected" } }, { new: true });
    if (!campaign) return NextResponse.json({ error: "Campaign no longer exists." }, { status: 404 });
    await createNotification({
      message: `Your campaign "${campaign.title}" has been suspended after a report and is no longer public.`,
      toEmail: campaign.creator_email,
      actionRoute: "/dashboard/my-campaigns",
    });
    return NextResponse.json({ success: true, action: "suspended" });
  } catch (error) {
    console.error("Resolve report error:", error);
    return NextResponse.json({ error: "Failed to resolve report." }, { status: 500 });
  }
}
