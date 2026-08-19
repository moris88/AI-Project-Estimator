import Anthropic from "@anthropic-ai/sdk";
import { createPrompt } from "./prompt";

export async function generateEstimateAnthropic(
  techStack: string,
  scope: "Frontend" | "Backend" | "Full-stack",
  experienceLevel: "beginner" | "experienced",
  testingPercentage: number,
  bufferPercentage: number,
  changeRequestPercentage: number,
  requirements: string,
  notes: string,
  isExistingProject: boolean,
  existingContext: string,
  previousEstimates: string,
  apiKey: string,
  modelUsed: string,
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const prompt = createPrompt(
    techStack,
    scope,
    experienceLevel,
    testingPercentage,
    bufferPercentage,
    changeRequestPercentage,
    requirements,
    notes,
    isExistingProject,
    existingContext,
    previousEstimates,
  );

  try {
    const response = await anthropic.messages.create({
      model: modelUsed,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    return content.type === "text" ? content.text.trim() : "";
  } catch (error) {
    console.error(
      "Errore durante la generazione della stima (Anthropic):",
      error,
    );
    throw error;
  }
}
