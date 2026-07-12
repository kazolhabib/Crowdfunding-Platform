import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Campaign from "@/lib/models/Campaign";
import Contribution from "@/lib/models/Contribution";
import User from "@/lib/models/User";
import { verifyJWT } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

// GET: Get campaign details by ID
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const campaign = await Campaign.findById(id);
    if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("Get campaign error:", error);
    return NextResponse.json({ error: "Failed to fetch campaign." }, { status: 500 });
  }
}

// POST: Submit a contribution
export async function POST(req, { params }) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const user = await User.findById(payload.userId).select("-password");
    if (!user || user.role !== "Supporter") {
      return NextResponse.json({ error: "Only supporters can contribute." }, { status: 403 });
    }

    const { id } = await params;
    const campaign = await Campaign.findById(id);
    if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });

    if (campaign.status !== "approved") {
      return NextResponse.json({ error: "This campaign is not accepting contributions." }, { status: 400 });
    }

    if (new Date(campaign.deadline) < new Date()) {
      return NextResponse.json({ error: "Campaign deadline has passed." }, { status: 400 });
    }

    const { contribution_amount } = await req.json();
    const amount = Number(contribution_amount);

    if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < campaign.minimum_contribution) {
      return NextResponse.json({
        error: `Minimum contribution is ${campaign.minimum_contribution} credits.`,
      }, { status: 400 });
    }

    // Atomically reserve credits so simultaneous requests cannot overspend a balance.
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, credits: { $gte: amount } },
      { $inc: { credits: -amount } },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ error: "Insufficient credits." }, { status: 400 });
    }

    let contribution;
    try {
      contribution = await Contribution.create({
        campaign_id: campaign._id,
        campaign_title: campaign.title,
        contribution_amount: amount,
        supporter_email: user.email,
        supporter_name: user.name,
        creator_email: campaign.creator_email,
        creator_name: campaign.creator_name,
        status: "pending",
      });
    } catch (error) {
      // Restore the reserved credits when the contribution cannot be recorded.
      await User.findByIdAndUpdate(user._id, { $inc: { credits: amount } });
      throw error;
    }

    // Notify the campaign creator
    try {
      await createNotification({
        message: `${user.name} contributed ${amount} credits to your campaign "${campaign.title}". Review it now.`,
        toEmail: campaign.creator_email,
        actionRoute: "/dashboard/review-contributions",
      });
    } catch (notificationError) {
      console.error("Contribution notification error:", notificationError);
    }

    return NextResponse.json({ success: true, contribution, newCredits: updatedUser.credits });
  } catch (error) {
    console.error("Contribute error:", error);
    return NextResponse.json({ error: "Failed to submit contribution." }, { status: 500 });
  }
}
