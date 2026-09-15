export type Scope = 'Frontend' | 'Backend' | 'Full-stack'
export type ProjectType = 'new' | 'existing'
export type AIProvider = 'gemini' | 'openai' | 'anthropic'

export interface AppSettings {
	provider: AIProvider
	geminiKey: string
	openaiKey: string
	anthropicKey: string
	model: string
}

export interface ProjectInfo {
	techStack: string
	scope: Scope
	type: ProjectType
	experienceLevel: 'beginner' | 'intermediate' | 'experienced'
	percentage: {
		testing: number
		buffer: number
		changeRequest: number
	}
	requirements: string
	notes?: string
	existingContext?: string
	previousEstimates?: PreviousEstimate[]
}

export interface PreviousEstimate {
	name: string
	text: string
}

export interface EstimationResult {
	stima: string
	sprints: string
}
