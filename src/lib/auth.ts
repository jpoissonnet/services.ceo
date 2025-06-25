import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { env } from "@/env.mjs";
import { db, developers } from "@/lib/schema";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (!session.user) return session;

      session.user.id = user.id;
      session.user.stripeCustomerId = user.stripeCustomerId;
      session.user.isActive = user.isActive;
      // @ts-expect-error role is not defined in the user type
      session.role =
        user.id === "3f2483a9-89bc-4f40-a789-c65aea7ab13d" ? "dev" : "user";

      // Ensure a developer profile exists for this user
      if (session.user.email) {
        // Check if developer profile exists
        const existingDev = await db
          .select()
          .from(developers)
          .where(eq(developers.email, session.user.email))
          .then((rows) => rows[0]);

        // If no profile exists, create one
        if (!existingDev && session.user.name) {
          try {
            await db.insert(developers).values({
              name: session.user.name,
              email: session.user.email,
              bio: "",
              date_of_starting_working: new Date().toISOString().split("T")[0],
              daily_rate: null,
            });
            console.log(`Developer profile created for ${session.user.email}`);
          } catch (error) {
            console.error("Error creating developer profile:", error);
          }
        }
      }

      return session;
    },
  },
});
