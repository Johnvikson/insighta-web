import { backendProxy } from "@/lib/backend";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return backendProxy("/auth/me", request);
}
