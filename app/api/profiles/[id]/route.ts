import { backendProxy } from "@/lib/backend";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return backendProxy(`/api/profiles/${params.id}`, request);
}
