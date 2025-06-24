import { eq } from "drizzle-orm";
import { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { NextRequest, NextResponse } from "next/server";

import { db, developers } from "@/lib/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const dev = await db
      .select()
      .from(developers)
      .where(eq(developers.email, email))
      .then((rows) => rows[0]);

    if (!dev) return NextResponse.json({}, { status: 404 });

    return NextResponse.json(dev);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch developer info" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { name, email, bio, date_of_starting_working } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const existing = await db
      .select()
      .from(developers)
      .where(eq(developers.email, email))
      .then((rows) => rows[0]);

    let developer;
    if (existing) {
      // Update existing developer
      const updateData: PgUpdateSetSource<typeof developers> = {};
      if (name) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (date_of_starting_working)
        updateData.date_of_starting_working = date_of_starting_working;

      developer = await db
        .update(developers)
        .set(updateData)
        .where(eq(developers.id, existing.id))
        .returning();
      developer = developer[0];
    } else {
      // Create new developer
      if (!name || !date_of_starting_working) {
        return NextResponse.json(
          {
            error:
              "Name and date_of_starting_working are required for new developers",
          },
          { status: 400 },
        );
      }

      developer = await db
        .insert(developers)
        .values({ name, email, bio, date_of_starting_working })
        .returning();
      developer = developer[0];
    }

    return NextResponse.json(developer);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to save developer info" },
      { status: 500 },
    );
  }
}
