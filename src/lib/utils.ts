import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import type { AIProvider } from '../types'

export async function getModels(
	provider: AIProvider,
	apiKey: string,
): Promise<string[]> {
	if (!apiKey.trim()) {
		return []
	}

	if (provider === 'openai') {
		const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
		return openai.models.list().then((res) => res.data.map((model) => model.id))
	}

	if (provider === 'anthropic') {
		const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
		return anthropic.models
			.list()
			.then((res) => res.data.map((model) => model.display_name))
	}

	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
		)

		if (!response.ok) {
			return []
		}

		const data: unknown = await response.json()
		if (!isGeminiModelsResponse(data)) {
			return []
		}

		return data.models
			.map((model) => model.name.split('/')[1])
			.filter((model): model is string => Boolean(model))
	} catch (error) {
		console.error('Impossibile recuperare i modelli Gemini:', error)
		return []
	}
}

function isGeminiModelsResponse(
	data: unknown,
): data is { models: Array<{ name: string }> } {
	return (
		typeof data === 'object' &&
		data !== null &&
		'models' in data &&
		Array.isArray(data.models) &&
		data.models.every(
			(model) =>
				typeof model === 'object' &&
				model !== null &&
				'name' in model &&
				typeof model.name === 'string',
		)
	)
}
