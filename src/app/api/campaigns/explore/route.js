import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/campaigns/explore`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Explore campaigns proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns." }, { status: 500 });
  }
}
