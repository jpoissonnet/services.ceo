import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db, developers, reviews } from "@/lib/schema";

// Schema for creating a new review
const createReviewSchema = z.object({
  serviceId: z.string(),
  clientId: z.string(),
  description: z.string(),
  rating: z.number().min(1).max(5),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    // Insert the review into the database
    await db.insert(reviews).values({
      serviceId: validatedData.serviceId,
      clientId: validatedData.clientId,
      description: validatedData.description,
      rating: validatedData.rating,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Get developer reviews
    if (url.searchParams.has("developerId")) {
      const developerId = url.searchParams.get("developerId")!;
      const limit = parseInt(url.searchParams.get("limit") || "3");

      const developerReviews = await db
        .select()
        .from(reviews)
        .innerJoin(developers, eq(reviews.clientId, developers.id))
        .where(eq(developers.id, developerId))
        .limit(limit);

      return NextResponse.json({ reviews: developerReviews });
    }

    // Get service review (for a specific service)
    if (url.searchParams.has("serviceId")) {
      const serviceId = url.searchParams.get("serviceId")!;

      const serviceReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.serviceId, serviceId));

      return NextResponse.json({
        reviews: serviceReviews,
      });
    }

    return NextResponse.json(
      { error: "Missing query parameters" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
