import { NextRequest, NextResponse } from "next/server";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/?error=missing_tokens", request.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  response.cookies.set("access_token", accessToken, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60,
  });
  response.cookies.set("refresh_token", refreshToken, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
