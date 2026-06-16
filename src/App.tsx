import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { ProjectForm } from './components/ProjectForm'
import { ResultView } from './components/ResultView'
import { SettingsPanel } from './components/SettingsPanel'
import { useEstimate } from './hooks/useEstimate'
import type { AppSettings, ProjectInfo } from './types'

export default function App() {
	const [settings, setSettings] = useState<AppSettings>(() => {
		const saved = localStorage.getItem('stime-settings-v2')
		return saved
			? JSON.parse(saved)
			: {
					provider: 'gemini',
					geminiKey: '',
					openaiKey: '',
					anthropicKey: '',
					model: 'gemini-1.5-pro',
				}
	})

	const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
		techStack: '',
		scope: 'Frontend',
		type: 'new',
		requirements: '',
		notes: '',
		existingContext: '',
	})
	const [selectedTechs, setSelectedTechs] = useState<string[]>([])
	const [showSettings, setShowSettings] = useState(
		!settings.geminiKey && !settings.openaiKey && !settings.anthropicKey,
	)

	const { generateEstimate, loading, result, error } = useEstimate(
		settings,
		projectInfo,
		selectedTechs,
	)

	useEffect(() => {
		localStorage.setItem('stime-settings-v2', JSON.stringify(settings))
	}, [settings])

	const handleProjectInfoChange = (info: Partial<ProjectInfo>) => {
		setProjectInfo((prev) => ({ ...prev, ...info }))
	}

	const handleToggleTech = (techValue: string) => {
		setSelectedTechs((prev) =>
			prev.includes(techValue)
				? prev.filter((t) => t !== techValue)
				: [...prev, techValue],
		)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		generateEstimate(() => setShowSettings(true))
	}

	const hasApiKey = Boolean(
		(settings.provider === 'gemini' && settings.geminiKey) ||
			(settings.provider === 'openai' && settings.openaiKey) ||
			(settings.provider === 'anthropic' && settings.anthropicKey),
	)

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
			<Header
				showSettings={showSettings}
				onToggleSettings={() => setShowSettings(!showSettings)}
				hasApiKey={hasApiKey}
			/>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{showSettings && (
					<SettingsPanel settings={settings} onSettingsChange={setSettings} />
				)}

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<ProjectForm
							projectInfo={projectInfo}
							selectedTechs={selectedTechs}
							onProjectInfoChange={handleProjectInfoChange}
							onToggleTech={handleToggleTech}
							onSubmit={handleSubmit}
							loading={loading}
							error={error}
							provider={settings.provider}
							model={settings.model}
						/>
					</div>

					<div className="lg:col-span-7">
						<ResultView
							result={result}
							loading={loading}
							provider={settings.provider}
							model={settings.model}
							projectInfo={projectInfo}
							selectedTechs={selectedTechs}
						/>
					</div>
				</div>
			</main>

			<footer className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-400 text-sm sm:px-6 lg:px-8">
				<p>© 2026 AI Project Estimator - Powered by Multi-LLM Support</p>
				<p className="mt-1 italic">
					Basato sugli standard di complessità aziendali Senior Architect
				</p>
			</footer>
		</div>
	)
}
