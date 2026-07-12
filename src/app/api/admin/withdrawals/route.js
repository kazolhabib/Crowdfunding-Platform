import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Withdrawal from "@/lib/models/Withdrawal";
import { requireAdmin } from "@/lib/admin";
import { createNotification } from "@/lib/notifications";

export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const withdrawals = await Withdrawal.find({ status: "pending" }).sort({ withdraw_date: 1 });
    return NextResponse.json({ success: true, withdrawals });
  } catch (error) {
    console.error("Admin withdrawals error:", error);
    return NextResponse.json({ error: "Failed to fetch withdrawal requests." }, { status: 500 });
  }
}

export async function PATCH(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { withdrawalId } = await req.json();
    if (!withdrawalId) return NextResponse.json({ error: "Withdrawal ID is required." }, { status: 400 });
    const withdrawal = await Withdrawal.findOneAndUpdate(
      { _id: withdrawalId, status: "pending" },
      { $set: { status: "approved" } },
      { new: true }
    );
    if (!withdrawal) {
      return NextResponse.json({ error: "Withdrawal not found or already processed." }, { status: 404 });
    }
    // Pending and approved withdrawals are both reserved in the creator's
    // available-credit calculation, so approving this request completes the
    // payout without double-deducting campaign totals.
    await createNotification({
      message: `Your withdrawal of ${withdrawal.withdrawal_credit} credits ($${withdrawal.withdrawal_amount.toFixed(2)}) has been paid successfully.`,
      toEmail: withdrawal.creator_email,
      actionRoute: "/dashboard/withdrawals",
    });
    return NextResponse.json({ success: true, withdrawal });
  } catch (error) {
    console.error("Approve withdrawal error:", error);
    return NextResponse.json({ error: "Failed to approve withdrawal." }, { status: 500 });
  }
}
