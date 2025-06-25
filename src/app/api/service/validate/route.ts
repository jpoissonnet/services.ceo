import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db, services } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await req.formData();
  const serviceId = formData.get("serviceId") as string;
  if (!serviceId) {
    return NextResponse.json({ error: "Missing serviceId" }, { status: 400 });
  }
  // Only allow if user is the developer of the service
  const updated = await db
    .update(services)
    .set({ status: "validated" })
    .where(
      and(
        eq(services.id, serviceId),
        eq(services.developerId, session.user.id),
      ),
    );
  if (!updated.rowCount) {
    return NextResponse.json(
      { error: "Service not found or you are not the developer" },
      { status: 404 },
    );
  }
  return NextResponse.json(
    { message: "Service validated successfully" },
    { status: 200 },
  );
}
