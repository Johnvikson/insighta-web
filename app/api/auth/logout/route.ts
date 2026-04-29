import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://profile-api-zeta.vercel.app";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (refreshToken && accessToken) {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => {});
  }

  const response = NextResponse.json({ status: "success" });
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}
