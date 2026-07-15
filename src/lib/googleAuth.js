import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

/**
 * Verify a Google ID token (credential from Google Identity Services).
 * Returns profile fields or throws with a user-safe message.
 */
export async function verifyGoogleIdToken(credential) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      "Google Sign-In is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local."
    );
  }
  if (!credential) {
    throw new Error("Google credential is required.");
  }

  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new Error("Unable to read email from Google account.");
  }
  if (payload.email_verified === false) {
    throw new Error("Google email is not verified.");
  }

  return {
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
    photoURL: payload.picture || "",
  };
}

export function isGoogleAuthConfigured() {
  return Boolean(GOOGLE_CLIENT_ID);
}
