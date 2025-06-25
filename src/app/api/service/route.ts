import { NextRequest, NextResponse } from "next/server";

import { getServicesForUser } from "@/lib/services-queries";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 },
    );
  }

  const services = await getServicesForUser(userId);
  return NextResponse.json(services);
}
