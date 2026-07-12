import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Campaign from "@/lib/models/Campaign";
import Contribution from "@/lib/models/Contribution";
import User from "@/lib/models/User";
import { verifyJWT } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

// GET: Fetch creator's campaigns
export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const campaigns = await Campaign.find({ creator_email: payload.email }).sort({ deadline: -1 });
    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error("Get creator campaigns error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns." }, { status: 500 });
  }
}

// POST: Create new campaign
export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const user = await User.findById(payload.userId).select("-password");
    if (!user || user.role !== "Creator") {
      return NextResponse.json({ error: "Only creators can add campaigns." }, { status: 403 });
    }

    const body = await req.json();
    const { title, story, category, funding_goal, minimum_contribution, deadline, reward_info, image_url } = body;

    if (!title || !story || !category || !funding_goal || !minimum_contribution || !deadline) {
      return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
    }

    const campaign = new Campaign({
      title,
      story,
      category,
      funding_goal: Number(funding_goal),
      minimum_contribution: Number(minimum_contribution),
      deadline: new Date(deadline),
      reward_info: reward_info || "",
      image_url: image_url || "",
      creator_email: user.email,
      creator_name: user.name,
      status: "pending",
    });

    await campaign.save();

    // Notify all admin users
    const admins = await User.find({ role: "Admin" }).select("email");
    for (const admin of admins) {
      await createNotification({
        message: `New campaign "${title}" submitted by ${user.name} is awaiting your approval.`,
        toEmail: admin.email,
        actionRoute: "/dashboard/campaign-approvals",
      });
    }

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json({ error: "Failed to create campaign." }, { status: 500 });
  }
}

// PUT: Update campaign (title, story, reward_info)
export async function PUT(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { campaignId, title, story, reward_info } = await req.json();
    if (!campaignId) return NextResponse.json({ error: "Campaign ID is required." }, { status: 400 });

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
    if (campaign.creator_email !== payload.email) {
      return NextResponse.json({ error: "You can only edit your own campaigns." }, { status: 403 });
    }

    if (title) campaign.title = title;
    if (story) campaign.story = story;
    if (reward_info !== undefined) campaign.reward_info = reward_info;

    await campaign.save();
    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json({ error: "Failed to update campaign." }, { status: 500 });
  }
}

// DELETE: Delete campaign and refund all approved supporters
export async function DELETE(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("id");
    if (!campaignId) return NextResponse.json({ error: "Campaign ID is required." }, { status: 400 });

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
    if (campaign.creator_email !== payload.email) {
      return NextResponse.json({ error: "You can only delete your own campaigns." }, { status: 403 });
    }

    // Refund all approved contributions
    const approvedContributions = await Contribution.find({
      campaign_id: campaignId,
      status: "approved",
    });

    for (const contrib of approvedContributions) {
      await User.findOneAndUpdate(
        { email: contrib.supporter_email },
        { $inc: { credits: contrib.contribution_amount } }
      );
      await createNotification({
        message: `Campaign "${campaign.title}" has been deleted. Your contribution of ${contrib.contribution_amount} credits has been refunded.`,
        toEmail: contrib.supporter_email,
        actionRoute: "/dashboard/my-contributions",
      });
    }

    // Delete all contributions for this campaign
    await Contribution.deleteMany({ campaign_id: campaignId });

    // Delete the campaign
    await Campaign.findByIdAndDelete(campaignId);

    return NextResponse.json({ success: true, message: "Campaign deleted and supporters refunded." });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return NextResponse.json({ error: "Failed to delete campaign." }, { status: 500 });
  }
}
