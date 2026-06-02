import { NextResponse } from "next/server";
import { ROLE_COOKIE, TOKEN_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ROLE_COOKIE);
  response.cookies.delete(TOKEN_COOKIE);
  return response;
}
