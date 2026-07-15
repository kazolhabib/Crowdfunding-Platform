import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth";
import { verifyGoogleIdToken } from "@/lib/googleAuth";

function authSuccessResponse(user, token) {
  const response = NextResponse.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
      credits: user.credits,
    },
  });

  // Cookie keeps private-route Proxy working after reload
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
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      email: rawEmail,
      password,
      isGoogle,
      googleCredential,
      googleName,
      googlePhoto,
      googleRole,
    } = body;

    // Google Sign-In (real credential) or demo role-switcher path
    if (isGoogle) {
      let email = rawEmail;
      let name = googleName;
      let photoURL = googlePhoto || "";
      let role = googleRole || "Supporter";

      if (googleCredential) {
        try {
          const profile = await verifyGoogleIdToken(googleCredential);
          email = profile.email;
          name = profile.name;
          photoURL = profile.photoURL;
          // Existing users keep their DB role; new users default to Supporter
          role = "Supporter";
        } catch (googleError) {
          return NextResponse.json(
            { error: googleError.message || "Google authentication failed." },
            { status: 401 }
          );
        }
      }

      if (!email) {
        return NextResponse.json({ error: "Google email is required." }, { status: 400 });
      }

      let user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        const dummyPassword = await bcrypt.hash(Math.random().toString(36).substring(7), 10);
        user = new User({
          name: name || "Google User",
          email: email.toLowerCase(),
          photoURL: photoURL || "",
          password: dummyPassword,
          role: role || "Supporter",
        });
        await user.save();
      } else if (email.endsWith("@demo.com") && user.photoURL?.includes("images.unsplash.com")) {
        user.photoURL = "";
        await user.save();
      } else if (photoURL && googleCredential && !user.photoURL) {
        user.photoURL = photoURL;
        await user.save();
      }

      const token = await signJWT({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return authSuccessResponse(user, token);
    }

    // Email + password login
    if (!rawEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: rawEmail.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await signJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return authSuccessResponse(user, token);
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during login." },
      { status: 500 }
    );
  }
}
