import Anthropic from '@anthropic-ai/sdk'
import { createPrompt } from './prompt'

export async function generateEstimateAnthropic(
	techStack: string,
	scope: 'Frontend' | 'Backend' | 'Full-stack',
	requirements: string,
	notes: string,
	isExistingProject: boolean,
	existingContext: string,
	apiKey: string,
	modelUsed: string,
): Promise<string> {
	const anthropic = new Anthropic({
		apiKey,
		dangerouslyAllowBrowser: true,
	})

	const prompt = createPrompt(
		techStack,
		scope,
		requirements,
		notes,
		isExistingProject,
		existingContext,
	)

	try {
		const response = await anthropic.messages.create({
			model: modelUsed,
			max_tokens: 4096,
			messages: [{ role: 'user', content: prompt }],
		})

		const content = response.content[0]
		return content.type === 'text' ? content.text.trim() : ''
	} catch (error) {
		console.error(
			'Errore durante la generazione della stima (Anthropic):',
			error,
		)
		throw error
	}
}
