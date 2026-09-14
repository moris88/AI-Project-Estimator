import { useState } from "react";
import { generateEstimateAnthropic } from "../lib/anthropic";
import { generateEstimateGemini } from "../lib/gemini";
import { generateEstimateOpenAI } from "../lib/openai";
import type { AppSettings, EstimationResult, ProjectInfo } from "../types";

const splitEstimateSections = (fullText: string): [string, string] => {
  const separatorMatch = /---\s*SEPARATOR\s*---/i;
  const separatorSections = fullText.split(separatorMatch);

  if (separatorSections.length > 1) {
    return [separatorSections[0], separatorSections.slice(1).join("\n")];
  }

  const planningHeading = fullText.search(
    /\n\s*#{1,6}\s*(?:Pianificazione(?:\s+Settimanale|\s+degli\s+Sprint)?|Sprints?)\b/i,
  );

  if (planningHeading >= 0) {
    return [
      fullText.slice(0, planningHeading),
      fullText.slice(planningHeading),
    ];
  }

  return [fullText, ""];
};

export const useEstimate = (
  settings: AppSettings,
  projectInfo: ProjectInfo,
  selectedTechs: string[],
) => {
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCurrentKey = () => {
    if (settings.provider === "gemini") return settings.geminiKey;
    if (settings.provider === "openai") return settings.openaiKey;
    if (settings.provider === "anthropic") return settings.anthropicKey;
    return "";
  };

  const generateEstimate = async (onRequireSettings: () => void) => {
    const apiKey = getCurrentKey();

    if (!apiKey) {
      setError(`Inserisci una API Key per ${settings.provider.toUpperCase()}`);
      onRequireSettings();
      return;
    }

    if (selectedTechs.length === 0) {
      setError("Seleziona almeno una tecnologia");
      return;
    }

    if (!projectInfo.requirements.trim()) {
      setError("Inserisci almeno un requisito del progetto");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let fullText = "";
      const commonParams = [
        selectedTechs.join(", "),
        projectInfo.scope,
        projectInfo.experienceLevel,
        projectInfo.percentage.testing,
        projectInfo.percentage.buffer,
        projectInfo.percentage.changeRequest,
        projectInfo.requirements,
        projectInfo.notes || "",
        projectInfo.type === "existing",
        projectInfo.existingContext || "",
        (projectInfo.previousEstimates || [])
          .map((estimate) => `--- ${estimate.name} ---\n${estimate.text}`)
          .join("\n\n"),
        apiKey,
        settings.model,
      ] as const;

      if (settings.provider === "gemini") {
        fullText = await generateEstimateGemini(...commonParams);
      } else if (settings.provider === "openai") {
        fullText = await generateEstimateOpenAI(...commonParams);
      } else if (settings.provider === "anthropic") {
        fullText = await generateEstimateAnthropic(...commonParams);
      }

      const [stima, sprints] = splitEstimateSections(fullText);
      setResult({ stima: stima || fullText, sprints: sprints || "" });
    } catch (err: any) {
      setError(err.message || "Errore durante la generazione");
    } finally {
      setLoading(false);
    }
  };

  const refineEstimate = async (refinementPrompt: string) => {
    const apiKey = getCurrentKey();
    if (!apiKey || !result) return;

    setRefining(true);
    setError(null);

    try {
      // Costruiamo un prompt arricchito includendo la stima precedente e le istruzioni di modifica
      const refinedRequirements = `
STIMA ATTUALE DA MODIFICARE:
${result.stima}
${result.sprints ? `\n--- SPRINT ATTUALI ---\n${result.sprints}` : ""}

ISTRUZIONI DI MODIFICA DALL'UTENTE:
"${refinementPrompt}"

Per favore, rigenera la stima mantenendo la struttura e il formato precedente, applicando accuratamente le modifiche o ricalcolando le ore e i costi richiesti.
`.trim();

      let fullText = "";
      const commonParams = [
        selectedTechs.join(", "),
        projectInfo.scope,
        projectInfo.experienceLevel,
        projectInfo.percentage.testing,
        projectInfo.percentage.buffer,
        projectInfo.percentage.changeRequest,
        refinedRequirements,
        projectInfo.notes || "",
        projectInfo.type === "existing",
        projectInfo.existingContext || "",
        (projectInfo.previousEstimates || [])
          .map((estimate) => `--- ${estimate.name} ---\n${estimate.text}`)
          .join("\n\n"),
        apiKey,
        settings.model,
      ] as const;

      if (settings.provider === "gemini") {
        fullText = await generateEstimateGemini(...commonParams);
      } else if (settings.provider === "openai") {
        fullText = await generateEstimateOpenAI(...commonParams);
      } else if (settings.provider === "anthropic") {
        fullText = await generateEstimateAnthropic(...commonParams);
      }

      const [stima, sprints] = splitEstimateSections(fullText);
      setResult({ stima: stima || fullText, sprints: sprints || "" });
    } catch (err: any) {
      setError(err.message || "Errore durante l'aggiornamento della stima");
    } finally {
      setRefining(false);
    }
  };

  const resetEstimate = () => {
    setResult(null);
    setError(null);
  };

  return {
    generateEstimate,
    refineEstimate,
    resetEstimate,
    loading,
    refining,
    result,
    error,
  };
};
