import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function requireAdmin(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return { error: NextResponse.json({ error: "Not authenticated." }, { status: 401 }) };
  }

  const payload = await verifyJWT(token);
  if (!payload || payload.role !== "Admin") {
    return { error: NextResponse.json({ error: "Admin access required." }, { status: 403 }) };
  }

  // The token controls optimistic Proxy redirects; the database remains the
  // source of truth for every privileged API operation after a role change.
  await connectDB();
  const user = await User.findById(payload.userId).select("role");
  if (!user || user.role !== "Admin") {
    return { error: NextResponse.json({ error: "Admin access required." }, { status: 403 }) };
  }

  return { payload, user };
}
