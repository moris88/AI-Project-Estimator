import OpenAI from 'openai'
import { createPrompt } from './prompt'

export async function generateEstimateOpenAI(
	techStack: string,
	scope: 'Frontend' | 'Backend' | 'Full-stack',
	requirements: string,
	notes: string,
	isExistingProject: boolean,
	existingContext: string,
	apiKey: string,
	modelUsed: string,
): Promise<string> {
	const openai = new OpenAI({
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
		const response = await openai.chat.completions.create({
			model: modelUsed,
			messages: [{ role: 'user', content: prompt }],
		})

		return response.choices[0].message.content?.trim() || ''
	} catch (error) {
		console.error('Errore durante la generazione della stima (OpenAI):', error)
		throw error
	}
}
