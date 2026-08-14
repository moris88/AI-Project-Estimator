import OpenAI from "openai";
import type { AIProvider } from "../types";
import Anthropic from "@anthropic-ai/sdk";

export async function getModels(
  provider: AIProvider,
  apiKey: string,
): Promise<string[]> {
  if (provider === "openai") {
    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    return openai.models
      .list()
      .then((res) => res.data.map((model) => model.id));
  }

  if (provider === "anthropic") {
    const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    return anthropic.models
      .list()
      .then((res) => res.data.map((model) => model.display_name));
  }

  let OriginalModels: any = {};
  const nameOnlyList: string[] = [];
  const realModelNames: string[] = [];

  // gemini api
  return await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      OriginalModels = data;
      // get the name only list

      OriginalModels.models.forEach((model: { name: string }) => {
        nameOnlyList.push(model.name);
      });

      // get the real model name

      nameOnlyList.forEach((model) => {
        const name = model.split("/")[1];
        realModelNames.push(name);
      });

      return realModelNames;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}
