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
	requirements: string
	notes?: string
	existingContext?: string
}

export interface EstimationResult {
	stima: string
	sprints: string
}
