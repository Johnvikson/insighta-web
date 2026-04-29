import { backendProxy } from "@/lib/backend";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  return backendProxy(`/api/profiles?${searchParams.toString()}`, request);
}
