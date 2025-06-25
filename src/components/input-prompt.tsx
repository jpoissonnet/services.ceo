"use client";
import { useMutation } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

const InputPrompt = () => {
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
  }
  interface Developer {
    id: string;
    name: string;
    bio: string;
    daily_rate?: number | null;
  }
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [devDetails, setDevDetails] = useState<Developer[]>([]);
  const [selectedDevId, setSelectedDevId] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
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
    setDevDetails(data.developers || []);
  };

  const handleStepClick = (step: Step) => {
    setSelectedStep(step);
    setService(null);
    setSelectedDevId("");
    fetchDevInfo(step.developer || []);
  };

  const createService = async () => {
    if (!selectedStep || !selectedDevId) return;
    const res = await fetch("/api/service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: selectedStep.step,
        description: selectedStep.description,
        duration: selectedStep.estimatedTime,
        developerId: selectedDevId,
        clientId: clientId || null, // Include clientId if available
      }),
    });
    const data = await res.json();
    setService(data.service);
  };

  const validateService = async () => {
    if (!service) return;
    const res = await fetch("/api/service", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: service.id, status: "validated" }),
    });
    const data = await res.json();
    setService(data.service);
  };

  const handleClose = () => {
    setSelectedStep(null);
    setDevDetails([]);
    setSelectedDevId("");
    setClientId("");
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
                className="group relative mb-10 ml-4 cursor-pointer"
              >
                <span className="absolute top-4 -left-4 flex h-4 w-4 -translate-x-1/2 translate-y-1 items-center justify-center rounded-full border-2 border-gray-400 bg-white"></span>
                <div className="group-hover:border-primary group-hover:bg-primary/5 relative flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all group-hover:shadow-lg">
                  <div className="flex items-center justify-between font-semibold text-gray-800">
                    {step.step}
                    <span className="text-primary ml-2 transition-transform group-hover:translate-x-1">
                      →
                    </span>
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
              {service && (
                <>
                  <span>Status: {service.status}</span>
                  {service.status !== "validated" && (
                    <Button onClick={validateService}>Validate Service</Button>
                  )}
                </>
              )}
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
