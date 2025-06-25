import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db, developers } from "@/lib/schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, bio, date_of_starting_working, daily_rate } = body;

  if (!name || !email || !date_of_starting_working) {
    return NextResponse.json(
      { error: "Name, email, and date_of_starting_working are required" },
      { status: 400 },
    );
  }

  try {
    // Upsert developer by email
    const existing = await db
      .select()
      .from(developers)
      .where(eq(developers.email, email))
      .then((rows) => rows[0]);

    let developer;
    if (existing) {
      developer = await db
        .update(developers)
        .set({ name, bio, date_of_starting_working, daily_rate })
        .where(eq(developers.id, existing.id))
        .returning();
      developer = developer[0];
    } else {
      developer = await db
        .insert(developers)
        .values({ name, email, bio, date_of_starting_working, daily_rate })
        .returning();
      developer = developer[0];
    }

    return NextResponse.json({ developer });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to save developer" },
      { status: 500 },
    );
  }
}
