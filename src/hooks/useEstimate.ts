import { useState } from 'react'
import { generateEstimateAnthropic } from '../lib/anthropic'
import { generateEstimateGemini } from '../lib/gemini'
import { generateEstimateOpenAI } from '../lib/openai'
import type { AppSettings, EstimationResult, ProjectInfo } from '../types'

export const useEstimate = (
	settings: AppSettings,
	projectInfo: ProjectInfo,
	selectedTechs: string[],
) => {
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState<EstimationResult | null>(null)
	const [error, setError] = useState<string | null>(null)

	const getCurrentKey = () => {
		if (settings.provider === 'gemini') return settings.geminiKey
		if (settings.provider === 'openai') return settings.openaiKey
		if (settings.provider === 'anthropic') return settings.anthropicKey
		return ''
	}

	const generateEstimate = async (onRequireSettings: () => void) => {
		const apiKey = getCurrentKey()

		if (!apiKey) {
			setError(`Inserisci una API Key per ${settings.provider.toUpperCase()}`)
			onRequireSettings()
			return
		}

		if (selectedTechs.length === 0) {
			setError('Seleziona almeno una tecnologia')
			return
		}

		setLoading(true)
		setError(null)
		setResult(null)

		try {
			let fullText = ''
			const commonParams = [
				selectedTechs.join(', '),
				projectInfo.scope,
				projectInfo.requirements,
				projectInfo.notes || '',
				projectInfo.type === 'existing',
				projectInfo.existingContext || '',
				apiKey,
				settings.model,
			] as const

			if (settings.provider === 'gemini') {
				fullText = await generateEstimateGemini(...commonParams)
			} else if (settings.provider === 'openai') {
				fullText = await generateEstimateOpenAI(...commonParams)
			} else if (settings.provider === 'anthropic') {
				fullText = await generateEstimateAnthropic(...commonParams)
			}

			const [stima, sprints] = fullText.split('---SEPARATOR---')
			setResult({ stima: stima || fullText, sprints: sprints || '' })
		} catch (err: any) {
			setError(err.message || 'Errore durante la generazione')
		} finally {
			setLoading(false)
		}
	}

	return { generateEstimate, loading, result, error }
}
