import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db, developers, services } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let serviceId: string | null;
  const contentType = req.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    // Handle JSON request
    const body = await req.json();
    serviceId = body.serviceId;
  } else {
    // Handle form data request for backward compatibility
    const formData = await req.formData();
    serviceId = formData.get("serviceId") as string;
  }

  if (!serviceId) {
    return NextResponse.json({ error: "Missing serviceId" }, { status: 400 });
  }

  // Only allow if user is the developer of the service
  const updated = await db
    .update(services)
    .set({ status: "validated" })
    .from(developers)
    .where(
      and(eq(services.id, serviceId), eq(developers.email, session.user.email)),
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
