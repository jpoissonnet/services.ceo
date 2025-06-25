import { eq } from "drizzle-orm";

import { db, developers, services, users } from "@/lib/schema";

export async function getServicesForUser(userId: string) {
  // As client
  const asClient = await db
    .select({
      id: services.id,
      name: services.name,
      status: services.status,
    })
    .from(services)
    .where(eq(services.clientId, userId));

  // As developer
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

  return { asClient, asDeveloper };
}
