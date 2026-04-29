import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://profile-api-zeta.vercel.app";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { status: "error", message: "No refresh token" },
      { status: 401 }
    );
  }

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    const response = NextResponse.json(
      { status: "error", message: "Refresh failed" },
      { status: 401 }
    );
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  const { access_token: newAccess, refresh_token: newRefresh } =
    await res.json();

  const response = NextResponse.json({ status: "success" });
  response.cookies.set("access_token", newAccess, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60,
  });
  response.cookies.set("refresh_token", newRefresh, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
