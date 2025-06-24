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
  Given the devs in the previous part information, find the best developer for the need described in the query.
  Query: ${question}
  Answer:
  `;

  const result = await model
    .withStructuredOutput(
      z.object({
        answer: z
          .string()
          .describe(
            "The name and the id of the best developer for the need described in the query",
          ),
      }),
    )
    .invoke(prompt);

  console.log("👋 result", result);
  return new Response(JSON.stringify({ result }), {
    headers: { "Content-Type": "application/json" },
  });
};

export { aiHandler as POST };
