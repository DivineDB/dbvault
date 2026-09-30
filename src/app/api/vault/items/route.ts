import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { VaultItem } from "@/types/vault";
import { INITIAL_VAULT_ITEMS } from "@/lib/initial-data";

const SESSION_COOKIE_NAME = "dbvault_session";

// Server memory storage store (in production can be backed by Vercel KV / Supabase / SQLite)
let serverVaultStore: VaultItem[] = [...INITIAL_VAULT_ITEMS];

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken !== "authenticated_divyansh_session") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    items: serverVaultStore,
    syncedAt: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken !== "authenticated_divyansh_session") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (Array.isArray(body.items)) {
      serverVaultStore = body.items;
      return NextResponse.json({
        success: true,
        message: "Vault synced with cloud store",
        itemsCount: serverVaultStore.length,
        syncedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server sync failed" }, { status: 500 });
  }
}
