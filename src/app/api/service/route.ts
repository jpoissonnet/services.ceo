import { NextRequest, NextResponse } from "next/server";

import { db, services } from "@/lib/schema";
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

export async function POST(request: NextRequest) {
  const { name, description, duration, developerId, clientId } =
    await request.json();

  if (!name || !description || !duration || !developerId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const [service] = await db
      .insert(services)
      .values({
        name,
        description,
        duration,
        developerId,
        clientId: clientId || null,
      })
      .returning();
    console.log("👋 service", service);

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}
