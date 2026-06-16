import { GoogleGenerativeAI } from '@google/generative-ai'
import { createPrompt } from './prompt'

export async function generateEstimateGemini(
	techStack: string,
	scope: 'Frontend' | 'Backend' | 'Full-stack',
	requirements: string,
	notes: string,
	isExistingProject: boolean,
	existingContext: string,
	apiKey: string,
	modelUsed: string,
): Promise<string> {
	const genAI = new GoogleGenerativeAI(apiKey)
	const model = genAI.getGenerativeModel({ model: modelUsed })

	const prompt = createPrompt(
		techStack,
		scope,
		requirements,
		notes,
		isExistingProject,
		existingContext,
	)

	try {
		const result = await model.generateContent(prompt)
		const response = result.response
		const text = response.text().trim()
		return text
	} catch (error) {
		console.error('Errore durante la generazione della stima:', error)
		throw error
	}
}
