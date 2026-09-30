import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "dbvault_session";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken === "authenticated_divyansh_session") {
    return NextResponse.json({
      authenticated: true,
      user: "Divyansh",
    });
  }

  return NextResponse.json({
    authenticated: false,
    user: null,
  });
}
