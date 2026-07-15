import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getAuthPayload } from "@/lib/requestAuth";

const MAX_IMAGE_SIZE = 1_400_000;

export async function PATCH(req) {
  try {
    const payload = await getAuthPayload(req);

    if (!payload?.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { photoURL } = await req.json();
    const isImage = typeof photoURL === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(photoURL);

    if (!isImage || photoURL.length > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Please upload a JPG, PNG, or WebP image smaller than 1 MB." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(payload.userId, { photoURL }, { new: true }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Unable to update profile picture." }, { status: 500 });
  }
}
