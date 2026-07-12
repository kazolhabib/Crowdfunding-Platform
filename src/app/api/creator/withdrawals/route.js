import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Withdrawal from "@/lib/models/Withdrawal";
import Campaign from "@/lib/models/Campaign";
import User from "@/lib/models/User";
import { verifyJWT } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

// GET: Fetch creator's withdrawal history and available raised credits
export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Calculate total raised credits across all approved campaigns
    const campaigns = await Campaign.find({
      creator_email: payload.email,
      status: "approved",
    });
    const totalRaised = campaigns.reduce((sum, c) => sum + c.amount_raised, 0);

    // Calculate total already withdrawn credits
    const withdrawals = await Withdrawal.find({ creator_email: payload.email });
    const totalWithdrawn = withdrawals
      .filter((w) => w.status === "approved" || w.status === "pending")
      .reduce((sum, w) => sum + w.withdrawal_credit, 0);

    const availableCredits = totalRaised - totalWithdrawn;

    return NextResponse.json({
      success: true,
      totalRaised,
      totalWithdrawn,
      availableCredits,
      withdrawals,
    });
  } catch (error) {
    console.error("Get withdrawals error:", error);
    return NextResponse.json({ error: "Failed to fetch withdrawal data." }, { status: 500 });
  }
}

// POST: Submit withdrawal request
export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const user = await User.findById(payload.userId).select("-password");
    if (!user || user.role !== "Creator") {
      return NextResponse.json({ error: "Only creators can request withdrawals." }, { status: 403 });
    }

    const { credits, payment_system, account_number } = await req.json();

    if (!credits || !payment_system || !account_number) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const creditsNum = Number(credits);
    if (creditsNum < 200) {
      return NextResponse.json({ error: "Minimum withdrawal is 200 credits ($10 USD)." }, { status: 400 });
    }

    // Verify available credits
    const campaigns = await Campaign.find({ creator_email: user.email, status: "approved" });
    const totalRaised = campaigns.reduce((sum, c) => sum + c.amount_raised, 0);
    const existingWithdrawals = await Withdrawal.find({ creator_email: user.email });
    const totalWithdrawn = existingWithdrawals
      .filter((w) => w.status === "approved" || w.status === "pending")
      .reduce((sum, w) => sum + w.withdrawal_credit, 0);
    const availableCredits = totalRaised - totalWithdrawn;

    if (creditsNum > availableCredits) {
      return NextResponse.json({ error: "Insufficient available credits." }, { status: 400 });
    }

    const withdrawal = new Withdrawal({
      creator_email: user.email,
      creator_name: user.name,
      withdrawal_credit: creditsNum,
      withdrawal_amount: creditsNum / 20, // 20 credits = $1
      payment_system,
      account_number,
      status: "pending",
    });

    await withdrawal.save();

    // Notify admins
    const admins = await User.find({ role: "Admin" }).select("email");
    for (const admin of admins) {
      await createNotification({
        message: `${user.name} has requested a withdrawal of ${creditsNum} credits ($${(creditsNum / 20).toFixed(2)}).`,
        toEmail: admin.email,
        actionRoute: "/dashboard/admin-withdrawals",
      });
    }

    return NextResponse.json({ success: true, withdrawal });
  } catch (error) {
    console.error("Create withdrawal error:", error);
    return NextResponse.json({ error: "Failed to submit withdrawal." }, { status: 500 });
  }
}
