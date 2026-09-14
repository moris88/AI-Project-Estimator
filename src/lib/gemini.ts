import { GoogleGenerativeAI } from '@google/generative-ai'
import { createPrompt } from './prompt'

export async function generateEstimateGemini(
	techStack: string,
	scope: 'Frontend' | 'Backend' | 'Full-stack',
	experienceLevel: 'beginner' | 'experienced',
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
	const genAI = new GoogleGenerativeAI(apiKey)
	const model = genAI.getGenerativeModel({ model: modelUsed })

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
