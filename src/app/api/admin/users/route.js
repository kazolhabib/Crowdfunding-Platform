import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { requireAdmin } from "@/lib/admin";

export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

export async function PATCH(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { userId, role } = await req.json();
    if (!userId || !["Admin", "Creator", "Supporter"].includes(role)) {
      return NextResponse.json({ error: "A user and valid role are required." }, { status: 400 });
    }
    const user = await User.findByIdAndUpdate(userId, { $set: { role } }, { new: true }).select("-password");
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json({ error: "Failed to update user role." }, { status: 500 });
  }
}

export async function DELETE(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const userId = new URL(req.url).searchParams.get("id");
    if (!userId) return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    if (userId === auth.payload.userId) {
      return NextResponse.json({ error: "You cannot remove your own admin account." }, { status: 400 });
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove user error:", error);
    return NextResponse.json({ error: "Failed to remove user." }, { status: 500 });
  }
}
