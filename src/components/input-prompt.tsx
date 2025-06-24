"use client";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const InputPrompt = () => {
  const [input, setInput] = useState("");
  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      console.log("👋 data", data);
      return data;
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(input);
  };
  return (
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
      {mutation.isSuccess && (
        <div className="ml-4 text-green-600">
          JSON.stringify: {JSON.stringify(mutation.data)}
          {/*Best dev: {mutation.data.result.name} (ID: {mutation.data.result.id})*/}
        </div>
      )}
      {mutation.isError && (
        <div className="ml-4 text-red-600">Error: {mutation.error.message}</div>
      )}
    </form>
  );
};

export default InputPrompt;
