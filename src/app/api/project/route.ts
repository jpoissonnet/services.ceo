import { ChatMistralAI } from "@langchain/mistralai";
import { z } from "zod";

import { db, developers } from "@/lib/schema";

const aiHandler = async (req: Request) => {
  const requestBody = await req.json();
  const { question } = requestBody;

  // Query all developers from the database
  const devs = await db.select().from(developers);

  // Format developers as context string
  const retrievedDevs = devs
    .map(
      (dev) =>
        `Id: ${dev.id} Name: ${dev.name}\nBio: ${dev.bio}\nStarted: ${dev.date_of_starting_working}\n`,
    )
    .join("\n");

  const model = new ChatMistralAI({
    model: "mistral-small-2503",
    temperature: 0,
  });

  const prompt = `
Context information is below.
---------------------
  ${retrievedDevs}
---------------------
Given the devs in the previous part information, the query you'll be provided will describe a project, answer the steps that the project needs and the best developers that matches the steps.

IMPORTANT: Return your response as an array of step objects, even if there's only one step.

Query: ${question}

Answer as a JSON array of steps:
`;

  const stepSchema = z.object({
    steps: z.array(
      z.object({
        step: z.string(),
        description: z.string(),
        estimatedTime: z.string(),
        developer: z.array(z.string()),
      }),
    ),
  });
  const result = await model.withStructuredOutput(stepSchema).invoke(prompt);

  console.log("👋 result", result);
  return new Response(JSON.stringify({ result }), {
    headers: { "Content-Type": "application/json" },
  });
};

export { aiHandler as POST };
