import { eq } from "drizzle-orm";

import { db, developers, reviews, services, users } from "@/lib/schema";

export async function getServicesForUser(userId: string) {
  // As client
  const asClient = await db
    .select({
      id: services.id,
      name: services.name,
      status: services.status,
      developerName: developers.name,
    })
    .from(services)
    .innerJoin(developers, eq(services.developerId, developers.id))
    .where(eq(services.clientId, userId));

  const allReviews = await db
    .select()
    .from(reviews)
    .innerJoin(services, eq(reviews.serviceId, services.id));

  asClient.forEach((service) => {
    // We're filtering allReviews where the nested review object's serviceId matches the current service's ID.
    // We then map to get just the review object itself, not the { review: ..., service: ... } wrapper.
    /* @ts-expect-error new property*/
    service.reviews = allReviews
      .filter((reviewItem) => reviewItem.review.serviceId === service.id)
      .map((reviewItem) => reviewItem.review);

    // Check if the current user (client) has already reviewed this service
    /* @ts-expect-error new property*/
    service.hasReview = service.reviews.some(
      /* @ts-expect-error new property*/
      (review) => review.clientId === userId,
    );
  });

  const asDeveloper = await db
    .select({
      id: services.id,
      name: services.name,
      status: services.status,
    })
    .from(services)
    .innerJoin(developers, eq(services.developerId, developers.id))
    .innerJoin(users, eq(developers.email, users.email))
    .where(eq(users.id, userId));

  asDeveloper.forEach((service) => {
    /* @ts-expect-error new property*/
    service.reviews = allReviews
      .filter((reviewItem) => reviewItem.review.serviceId === service.id)
      .map((reviewItem) => reviewItem.review);
  });

  return { asClient, asDeveloper };
}
