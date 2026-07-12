import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contribution from "@/lib/models/Contribution";
import Campaign from "@/lib/models/Campaign";
import User from "@/lib/models/User";
import { verifyJWT } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

// GET: Fetch pending contributions for creator's campaigns
export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const contributions = await Contribution.find({
      creator_email: payload.email,
      status: "pending",
    }).sort({ date: -1 });

    return NextResponse.json({ success: true, contributions });
  } catch (error) {
    console.error("Get contributions error:", error);
    return NextResponse.json({ error: "Failed to fetch contributions." }, { status: 500 });
  }
}

// PUT: Approve or reject a contribution
export async function PUT(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { contributionId, action } = await req.json();
    if (!contributionId || !action) {
      return NextResponse.json({ error: "Contribution ID and action are required." }, { status: 400 });
    }

    const contribution = await Contribution.findById(contributionId);
    if (!contribution) return NextResponse.json({ error: "Contribution not found." }, { status: 404 });
    if (contribution.creator_email !== payload.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    if (contribution.status !== "pending") {
      return NextResponse.json({ error: "This contribution has already been processed." }, { status: 400 });
    }

    if (action === "approve") {
      contribution.status = "approved";
      await contribution.save();

      // Add contribution amount to campaign's amount_raised
      await Campaign.findByIdAndUpdate(contribution.campaign_id, {
        $inc: { amount_raised: contribution.contribution_amount },
      });

      await createNotification({
        message: `Your contribution of ${contribution.contribution_amount} credits to "${contribution.campaign_title}" has been approved!`,
        toEmail: contribution.supporter_email,
        actionRoute: "/dashboard/my-contributions",
      });

      return NextResponse.json({ success: true, message: "Contribution approved." });
    } else if (action === "reject") {
      contribution.status = "rejected";
      await contribution.save();

      // Refund credits to supporter
      await User.findOneAndUpdate(
        { email: contribution.supporter_email },
        { $inc: { credits: contribution.contribution_amount } }
      );

      await createNotification({
        message: `Your contribution of ${contribution.contribution_amount} credits to "${contribution.campaign_title}" was rejected. Credits have been refunded.`,
        toEmail: contribution.supporter_email,
        actionRoute: "/dashboard/my-contributions",
      });

      return NextResponse.json({ success: true, message: "Contribution rejected and refunded." });
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
    }
  } catch (error) {
    console.error("Review contribution error:", error);
    return NextResponse.json({ error: "Failed to process contribution." }, { status: 500 });
  }
}
