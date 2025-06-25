import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db, services } from "@/lib/schema";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { name, description, duration, developerId } = await request.json();
    if (!name || !description || !duration || !developerId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const [service] = await db
      .insert(services)
      .values({
        name,
        description,
        duration,
        developerId,
        clientId: session.user.id,
      })
      .returning();
    return NextResponse.json({ service });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 },
      );
    }

    const [service] = await db
      .update(services)
      .set({ status })
      .where(eq(services.id, id))
      .returning();

    return NextResponse.json({ service });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }
}
