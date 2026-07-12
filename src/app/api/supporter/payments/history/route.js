import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

const API_URL = process.env.API_URL || "http://localhost:5000";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    const url = `${API_URL}/api/payments/history${query ? `?${query}` : ""}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Payment history proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch payment history." }, { status: 500 });
  }
}
