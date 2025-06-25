import { auth } from "@/lib/auth";

import { ServicesTable } from "./services-table";

export default async function ServicesPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="container py-8">
        Please sign in to view your services.
      </div>
    );
  }
  return <ServicesTable session={session} />;
}
