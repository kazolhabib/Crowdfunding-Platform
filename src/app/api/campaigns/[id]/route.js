import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

const API_URL = process.env.API_URL || "http://localhost:5000";

// GET: Get campaign details by ID
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/api/campaigns/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Get campaign proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch campaign." }, { status: 500 });
  }
}

// POST: Submit a contribution
export async function POST(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
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
    console.error("Contribute proxy error:", error);
    return NextResponse.json({ error: "Failed to submit contribution." }, { status: 500 });
  }
}
