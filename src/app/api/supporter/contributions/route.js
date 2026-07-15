import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

const API_URL = process.env.API_URL || "http://localhost:5000";

// GET: Fetch supporter's contribution history and stats
export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const res = await fetch(`${API_URL}/api/supporter/contributions?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Get supporter contributions proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch contributions." }, { status: 500 });
  }
}
