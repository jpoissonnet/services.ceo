"use client";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
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
      // return {
      //   steps: [
      //     {
      //       step: "Frontend Development",
      //       description:
      //         "Develop the React application to display weather information.",
      //       estimatedTime: "2-4 weeks",
      //       developer: ["Rosa Diaz"],
      //     },
      //     {
      //       step: "Backend Development",
      //       description:
      //         "Create a backend service to fetch weather data from a weather API.",
      //       estimatedTime: "1-2 weeks",
      //       developer: ["Rosa Diaz"],
      //     },
      //     {
      //       step: "API Integration",
      //       description:
      //         "Integrate the weather API with the frontend application.",
      //       estimatedTime: "1 week",
      //       developer: ["Rosa Diaz"],
      //     },
      //     {
      //       step: "Testing and Quality Assurance",
      //       description:
      //         "Conduct thorough testing to ensure the application works correctly and is free of bugs.",
      //       estimatedTime: "1-2 weeks",
      //       developer: ["Rosa Diaz"],
      //     },
      //   ],
      // };
    },
  });

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
          <ol className="relative ml-6 border-l border-gray-200">
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
          <ol className="relative ml-6 border-l border-gray-300">
            {mutation.data.steps?.map(
              (
                step: {
                  step: string;
                  description: string;
                  estimatedTime: string;
                  developer?: string[];
                },
                idx: number,
              ) => (
                <li key={idx} className="mb-10 ml-4">
                  <span className="absolute -left-3 flex h-4 w-4 translate-1 items-center justify-center rounded-full border-2 border-gray-400 bg-white"></span>
                  <div className="font-semibold text-gray-800">{step.step}</div>
                  <div className="text-gray-600">{step.description}</div>
                  <div className="text-sm text-gray-500">
                    Estimated time: {step.estimatedTime}
                  </div>
                  {step.developer && (
                    <div className="text-xs text-gray-400">
                      Developer(s): {step.developer.join(", ")}
                    </div>
                  )}
                </li>
              ),
            )}
          </ol>
        </div>
      )}
    </>
  );
};

export default InputPrompt;
