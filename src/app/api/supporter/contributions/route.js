import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contribution from "@/lib/models/Contribution";
import { verifyJWT } from "@/lib/auth";

// GET: Fetch supporter's contribution history with pagination
export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10));
    const skip = (page - 1) * limit;

    const total = await Contribution.countDocuments({ supporter_email: payload.email });
    const contributions = await Contribution.find({ supporter_email: payload.email })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const [stats] = await Contribution.aggregate([
      { $match: { supporter_email: payload.email } },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          approvedTotal: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, "$contribution_amount", 0] },
          },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      contributions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      stats: stats || { totalCount: 0, pendingCount: 0, approvedTotal: 0 },
    });
  } catch (error) {
    console.error("Get supporter contributions error:", error);
    return NextResponse.json({ error: "Failed to fetch contributions." }, { status: 500 });
  }
}
