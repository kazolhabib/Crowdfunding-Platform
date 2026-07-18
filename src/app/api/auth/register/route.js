import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, photoURL, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email." },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      photoURL: photoURL || "",
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Generate JWT
    const token = await signJWT({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    // Return token in body for localStorage (assessment) + set cookie for private routes
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        photoURL: newUser.photoURL,
        role: newUser.role,
        credits: newUser.credits,
      },
    });

    // Set HttpOnly cookie so Proxy / private routes stay logged in after reload
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
