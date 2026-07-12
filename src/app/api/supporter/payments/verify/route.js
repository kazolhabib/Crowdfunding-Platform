import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

const API_URL = process.env.API_URL || "http://localhost:5000";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const res = await fetch(`${API_URL}/api/payments/verify-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Verify session proxy error:", error);
    return NextResponse.json({ error: "Failed to verify payment." }, { status: 500 });
  }
}
