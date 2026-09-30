import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MASTER_PASSWORD = process.env.VAULT_PASSWORD || "hellodb";
const SESSION_COOKIE_NAME = "dbvault_session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (password === MASTER_PASSWORD) {
      const cookieStore = await cookies();
      
      // Set secure HTTP-only session cookie
      cookieStore.set(SESSION_COOKIE_NAME, "authenticated_divyansh_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      return NextResponse.json({
        success: true,
        message: "Welcome back, Divyansh!",
        user: "Divyansh",
      });
    }

    return NextResponse.json(
      { error: "Incorrect master password. Access denied." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error during authentication" },
      { status: 500 }
    );
  }
}
