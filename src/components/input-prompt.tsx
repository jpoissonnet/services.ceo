"use client";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import React, { ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

const InputPrompt = ({ session }: { session: Session | null }) => {
  const [input, setInput] = useState("");
  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      console.log("👋 data", data);
      return data.result;
    },
  });

  // Types and state for service creation and validation
  interface Step {
    step: string;
    description: string;
    estimatedTime: string;
    developer?: string[];
    status?: string; // Add status to track completion
  }
  interface Developer {
    id: string;
    name: string;
    bio: string;
    daily_rate?: number | null;
    reviews?: Array<{
      id: string;
      description: string;
      rating: number;
      serviceName?: string;
      clientName?: string;
    }>;
  }
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [devDetails, setDevDetails] = useState<Developer[]>([]);
  const [selectedDevId, setSelectedDevId] = useState<string>("");
  const [service, setService] = useState<null | Record<string, ReactNode>>(
    null,
  );

  const fetchDevInfo = async (names: string[]) => {
    const res = await fetch("/api/developer-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ names }),
    });
    const data = await res.json();

    // For each developer, fetch their reviews
    const devsWithReviews = await Promise.all(
      (data.developers || []).map(async (dev: Developer) => {
        try {
          const reviewsRes = await fetch(
            `/api/review?developerId=${dev.id}&limit=3`,
          );
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            return {
              ...dev,
              reviews: reviewsData.reviews || [],
            };
          }
          return dev;
        } catch (error) {
          console.error("Error fetching developer reviews:", error);
          return dev;
        }
      }),
    );

    setDevDetails(devsWithReviews);
  };

  const handleStepClick = (step: Step) => {
    // Don't open drawer for steps that already have a service created
    if (step.status === "done" || step.status === "validated") {
      return;
    }

    setSelectedStep(step);
    setService(null);
    setSelectedDevId("");
    fetchDevInfo(step.developer || []);
  };

  const createService = async () => {
    if (!selectedStep || !selectedDevId) return;
    try {
      const res = await fetch("/api/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedStep.step,
          description: selectedStep.description,
          duration: selectedStep.estimatedTime,
          developerId: selectedDevId,
          clientId: session?.user.id ?? null,
        }),
      });

      if (res.ok) {
        // Update step status in the UI to mark it as done
        mutation.data.steps = mutation.data.steps.map((s: Step) =>
          s.step === selectedStep.step ? { ...s, status: "done" } : s,
        );

        // Close the drawer after successfully creating a service
        handleClose();
      } else {
        console.error("Failed to create service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleClose = () => {
    setSelectedStep(null);
    setDevDetails([]);
    setSelectedDevId("");
    setService(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(input);
  };
  return (
    <>
      <form className="flex w-full gap-2" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Describe your need..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" className="px-6" disabled={mutation.isPending}>
          {mutation.isPending ? "Loading..." : "Submit"}
        </Button>
        {mutation.isError && (
          <div className="ml-4 text-red-600">
            Error: {mutation.error.message}
          </div>
        )}
      </form>
      {mutation.isPending && (
        <div className="mt-8 w-full max-w-2xl animate-pulse">
          <ol className="relative border-l border-gray-200">
            {[...Array(4)].map((_, idx) => (
              <li key={idx} className="relative mb-10 ml-4">
                <span className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-200 bg-white" />
                <div className="mb-2 h-4 w-48 rounded bg-gray-200" />
                <div className="mb-1 h-3 w-64 rounded bg-gray-100" />
                <div className="mb-1 h-3 w-32 rounded bg-gray-100" />
                <div className="h-2 w-24 rounded bg-gray-100" />
              </li>
            ))}
          </ol>
        </div>
      )}
      {mutation.isSuccess && (
        <div className="mt-8 w-full max-w-2xl">
          <h3 className="mb-4 text-xl font-bold">Project Roadmap</h3>
          <ol className="relative border-l border-gray-300">
            {mutation.data.steps?.map((step: Step, idx: number) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
              <li
                key={idx}
                onClick={() => handleStepClick(step)}
                className={`group relative mb-10 ml-4 ${
                  step.status === "done" ? "cursor-default" : "cursor-pointer"
                }`}
                data-status={step.status}
              >
                <span
                  className={`absolute top-4 -left-4 flex h-4 w-4 -translate-x-1/2 translate-y-1 items-center justify-center rounded-full ${
                    step.status === "done"
                      ? "border-2 border-green-500 bg-green-200"
                      : "border-2 border-gray-400 bg-white"
                  }`}
                ></span>
                <div
                  className={`relative flex flex-col gap-1 rounded-xl border ${
                    step.status === "done"
                      ? "border-green-200 bg-green-50"
                      : "group-hover:border-primary group-hover:bg-primary/5 border-gray-200 bg-white group-hover:shadow-lg"
                  } p-4 shadow-sm transition-all`}
                >
                  <div className="flex justify-between font-semibold text-gray-800">
                    {step.step}
                    {step.status === "done" ? (
                      <span className="text-sm font-medium text-green-500">
                        ✅
                      </span>
                    ) : (
                      <span className="text-primary ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600">{step.description}</div>
                  <div className="text-sm text-gray-500">
                    Estimated time: {step.estimatedTime}
                  </div>
                  {step.developer && (
                    <div className="text-xs text-gray-400">
                      Developer(s): {step.developer.join(", ")}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Drawer for step details and service actions */}
      <Drawer open={!!selectedStep} onClose={handleClose}>
        {selectedStep && (
          <div className="p-6">
            <h4 className="mb-4 text-lg font-bold">{selectedStep.step}</h4>
            <p className="mb-4">{selectedStep.description}</p>
            <div className="mb-4">
              <h5 className="mb-2 font-semibold">Select Developer:</h5>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {devDetails.map((dev) => (
                  <label
                    key={dev.id}
                    className={`flex flex-1 flex-shrink-0 cursor-pointer flex-col items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition-all ${
                      selectedDevId === dev.id
                        ? "border-primary ring-primary/30 bg-primary/5 ring-2"
                        : ""
                    }`}
                  >
                    <div
                      className={"flex w-full flex-row-reverse justify-between"}
                    >
                      <input
                        type="radio"
                        name="developer"
                        value={dev.id}
                        checked={selectedDevId === dev.id}
                        onChange={() => setSelectedDevId(dev.id)}
                        className="accent-primary"
                      />
                      <span className="text-base font-medium">{dev.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{dev.bio}</p>
                    {typeof dev.daily_rate === "number" && (
                      <p className="text-xs text-gray-500">
                        Daily Rate: ${dev.daily_rate}
                      </p>
                    )}
                    {/* Reviews section */}
                    {dev.reviews && dev.reviews.length > 0 && (
                      <div className="mt-2 w-full rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                        <strong className="block text-gray-800">
                          Reviews:
                        </strong>
                        {dev.reviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="mt-1">
                            <div className="flex items-center">
                              <span className="mr-1 text-yellow-500">
                                {/* Render star icons based on the rating */}
                                {[...Array(review.rating)].map((_, i) => (
                                  <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 fill-current text-yellow-500"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 .587l3.668 7.431 8.209 1.188-5.934 5.759 1.398 8.165L12 18.896l-7.341 3.86 1.398-8.165-5.934-5.759 8.209-1.188z" />
                                  </svg>
                                ))}
                              </span>
                              <span className="text-xs text-gray-500">
                                {review.clientName}
                              </span>
                            </div>
                            <p className="text-gray-600">
                              {review.description}
                            </p>
                          </div>
                        ))}
                        {dev.reviews.length > 3 && (
                          <span className="text-primary mt-2 block cursor-pointer hover:underline">
                            View all reviews
                          </span>
                        )}
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {!service && (
                <Button onClick={createService} disabled={!selectedDevId}>
                  Save Service
                </Button>
              )}
              {service && <span>Status: {service.status}</span>}
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default InputPrompt;
