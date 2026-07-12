import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Campaign from "@/lib/models/Campaign";
import { requireAdmin } from "@/lib/admin";
import { createNotification } from "@/lib/notifications";
import { deleteCampaignAndRefund } from "@/lib/campaigns";

export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("status") ? { status: searchParams.get("status") } : {};
    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error("Admin campaigns error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns." }, { status: 500 });
  }
}

export async function PATCH(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { campaignId, action, reason } = await req.json();
    if (!campaignId || !["approve", "reject", "suspend"].includes(action)) {
      return NextResponse.json({ error: "A campaign and valid action are required." }, { status: 400 });
    }
    if (action === "reject" && !reason?.trim()) {
      return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });
    }
    const status = action === "approve" ? "approved" : "rejected";
    const campaign = await Campaign.findByIdAndUpdate(campaignId, { $set: { status } }, { new: true });
    if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });

    const message = action === "approve"
      ? `Your campaign "${campaign.title}" has been approved and is now public.`
      : action === "suspend"
        ? `Your campaign "${campaign.title}" has been suspended while it is reviewed.`
        : `Your campaign "${campaign.title}" was rejected. Reason: ${reason.trim()}`;
    await createNotification({ message, toEmail: campaign.creator_email, actionRoute: "/dashboard/my-campaigns" });
    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("Update admin campaign error:", error);
    return NextResponse.json({ error: "Failed to update campaign." }, { status: 500 });
  }
}

export async function DELETE(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const campaignId = new URL(req.url).searchParams.get("id");
    if (!campaignId) return NextResponse.json({ error: "Campaign ID is required." }, { status: 400 });
    const campaign = await deleteCampaignAndRefund(campaignId);
    if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Campaign removed and contributions refunded." });
  } catch (error) {
    console.error("Delete admin campaign error:", error);
    return NextResponse.json({ error: "Failed to remove campaign." }, { status: 500 });
  }
}
