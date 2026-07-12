import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Payment from "@/lib/models/Payment";
import { requireAdmin } from "@/lib/admin";

export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const [supporters, creators, credits, processedPayments] = await Promise.all([
      User.countDocuments({ role: "Supporter" }),
      User.countDocuments({ role: "Creator" }),
      User.aggregate([{ $group: { _id: null, total: { $sum: "$credits" } } }]),
      Payment.countDocuments({ status: "completed" }),
    ]);
    return NextResponse.json({
      success: true,
      stats: { supporters, creators, availableCredits: credits[0]?.total || 0, processedPayments },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to load admin statistics." }, { status: 500 });
  }
}
