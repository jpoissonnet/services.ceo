import { eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db, developers, reviews, services } from "@/lib/schema";

export async function POST(request: NextRequest) {
  const { names } = await request.json();
  if (!Array.isArray(names) || names.length === 0) {
    return NextResponse.json(
      { error: "Names array is required" },
      { status: 400 },
    );
  }

  try {
    const rows = await db
      .select()
      .from(developers)
      .where(inArray(developers.name, names));

    for (const dev of rows) {
      /* @ts-expect-error new props*/
      dev.reviews = await db
        .select()
        .from(reviews)
        .innerJoin(services, eq(reviews.serviceId, services.id))
        .innerJoin(developers, eq(services.developerId, developers.id))
        .where(eq(reviews.clientId, dev.id));
    }

    console.log("👋 rows", rows);

    return NextResponse.json({ developers: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch developer info" },
      { status: 500 },
    );
  }
}
