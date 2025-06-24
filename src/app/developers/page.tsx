import { notFound } from "next/navigation";

import { db, developers } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function DevelopersPage() {
  // Fetch all developers from database
  const devs = await db.select().from(developers);

  if (!devs) notFound();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Developers</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {devs.map((dev) => (
          <div key={dev.id} className="bg-card rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold">{dev.name}</h2>
            <p className="text-card-foreground mt-2 text-sm">{dev.bio}</p>
            <p className="mt-4 text-sm">Email: {dev.email}</p>
            <p className="text-xs">
              {new Date().getFullYear() -
                new Date(dev.date_of_starting_working).getFullYear()}
              &nbsp;years of xp
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
