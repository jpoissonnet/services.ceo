"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Type for developer data
interface DeveloperData {
  id?: string;
  name: string;
  email: string;
  bio: string | null;
  date_of_starting_working: string;
}

export default function ProfileComponent({
  session,
}: {
  session: Session | null;
}) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<DeveloperData>({
    name: "",
    email: session?.user?.email || "",
    bio: "",
    date_of_starting_working: "",
  });

  // Query to fetch developer info
  const {
    data: developerData,
    isLoading: isLoadingDeveloper,
    error: fetchError,
  } = useQuery({
    queryKey: ["developerInfo", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;

      const res = await fetch(
        `/api/developer-info?email=${encodeURIComponent(session.user.email)}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch developer data");
      }

      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  // Mutation to update developer info
  const {
    mutate: updateDeveloper,
    isPending: isSubmitting,
    error: submitError,
  } = useMutation({
    mutationFn: async (data: DeveloperData) => {
      const res = await fetch("/api/developer-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save developer profile");
      }

      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => router.push("/"), 1200);
    },
  });

  // Update form when developer data is loaded
  useEffect(() => {
    if (developerData) {
      setForm({
        name: developerData.name || "",
        email: session?.user?.email || "",
        bio: developerData.bio || "",
        date_of_starting_working: developerData.date_of_starting_working || "",
      });
    }
  }, [developerData, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate date format
    if (!form.date_of_starting_working) {
      return; // Form validation will catch this
    }

    updateDeveloper(form);
  };

  // Show loading state if data is being fetched
  if (isLoadingDeveloper) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-8">
        <div className="bg-card w-full max-w-md animate-pulse space-y-4 rounded p-6 shadow">
          <div className="bg-muted h-8 w-3/4 rounded" />
          <div className="bg-muted h-10 rounded" />
          <div className="bg-muted h-24 rounded" />
          <div className="bg-muted h-10 rounded" />
          <div className="bg-muted mx-auto h-10 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-8">
      <h1 className="mb-6 text-2xl font-bold">Developer Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-card w-full max-w-md space-y-4 rounded p-6 shadow"
      >
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={true} // Email comes from auth session and shouldn't be editable
            required
          />
        </div>
        <div>
          <label htmlFor="bio" className="mb-1 block text-sm font-medium">
            Bio (Tell us about yourself)
          </label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Bio (Tell us about yourself)"
            value={form.bio || ""}
            onChange={handleChange}
            className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            rows={4}
          />
        </div>
        <div>
          <label
            htmlFor="date_of_starting_working"
            className="mb-1 block text-sm font-medium"
          >
            When did you start working?
          </label>
          <Input
            id="date_of_starting_working"
            name="date_of_starting_working"
            type="date"
            placeholder="Start date"
            value={form.date_of_starting_working}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        {(fetchError || submitError) && (
          <p className="text-sm text-red-500">
            {fetchError instanceof Error
              ? fetchError.message
              : submitError instanceof Error
                ? submitError.message
                : "An error occurred"}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-500">
            Profile saved successfully! Redirecting...
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
