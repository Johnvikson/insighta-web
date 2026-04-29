import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://profile-api-zeta.vercel.app";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "X-API-Version": "1",
    "Content-Type": "application/json",
  };
}

async function callBackend(
  path: string,
  token: string,
  init: RequestInit
): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(token), ...(init.headers ?? {}) },
  });
}

/**
 * Proxy a request to the backend, handling 401 → token refresh → retry.
 * Sets updated cookies on the NextResponse when tokens are refreshed.
 */
export async function backendProxy(
  path: string,
  request: NextRequest,
  init: RequestInit = {}
): Promise<NextResponse> {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { status: "error", message: "Not authenticated" },
      { status: 401 }
    );
  }

  let res = await callBackend(path, accessToken, init);

  // Token expired — attempt refresh
  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!refreshRes.ok) {
      const expired = NextResponse.json(
        { status: "error", message: "Session expired" },
        { status: 401 }
      );
      expired.cookies.delete("access_token");
      expired.cookies.delete("refresh_token");
      return expired;
    }

    const { access_token: newAccess, refresh_token: newRefresh } =
      await refreshRes.json();

    res = await callBackend(path, newAccess, init);
    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });

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

  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("text/csv")) {
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          res.headers.get("Content-Disposition") ?? "attachment",
      },
    });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
