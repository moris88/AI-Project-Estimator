import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { ProjectForm } from './components/ProjectForm'
import { ResultView } from './components/ResultView'
import { SettingsPanel } from './components/SettingsPanel'
import { useEstimate } from './hooks/useEstimate'
import type { AppSettings, ProjectInfo } from './types'

const EMPTY_PROJECT_INFO: ProjectInfo = {
	techStack: '',
	scope: 'Frontend',
	type: 'new',
	experienceLevel: 'beginner',
	percentage: {
		testing: 20,
		buffer: 20,
		changeRequest: 5,
	},
	requirements: '',
	notes: '',
	existingContext: '',
	previousEstimates: [],
}

export default function App() {
	const [darkMode, setDarkMode] = useState(() => {
		const saved = localStorage.getItem('stime-dark-mode')
		return saved === null
			? window.matchMedia('(prefers-color-scheme: dark)').matches
			: saved === 'true'
	})
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

	const [projectInfo, setProjectInfo] = useState<ProjectInfo>(EMPTY_PROJECT_INFO)
	const [selectedTechs, setSelectedTechs] = useState<string[]>([])
	const [showSettings, setShowSettings] = useState(
		!settings.geminiKey && !settings.openaiKey && !settings.anthropicKey,
	)

	const { generateEstimate, refineEstimate, resetEstimate, loading, refining, result, error } = useEstimate(
		settings,
		projectInfo,
		selectedTechs,
	)

	useEffect(() => {
		localStorage.setItem('stime-settings-v2', JSON.stringify(settings))
	}, [settings])

	useEffect(() => {
		document.documentElement.classList.toggle('dark', darkMode)
		localStorage.setItem('stime-dark-mode', String(darkMode))
	}, [darkMode])

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

	const handleReset = () => {
		setProjectInfo({ ...EMPTY_PROJECT_INFO, previousEstimates: [] })
		setSelectedTechs([])
		resetEstimate()
	}

	const hasApiKey = Boolean(
		(settings.provider === 'gemini' && settings.geminiKey) ||
		(settings.provider === 'openai' && settings.openaiKey) ||
		(settings.provider === 'anthropic' && settings.anthropicKey),
	)

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-blue-900">
			<Header
				showSettings={showSettings}
				onToggleSettings={() => setShowSettings(!showSettings)}
				hasApiKey={hasApiKey}
				darkMode={darkMode}
				onToggleDarkMode={() => setDarkMode((current) => !current)}
			/>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{showSettings && (
					<SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} settings={settings} onSettingsChange={setSettings} />
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
							onReset={handleReset}
							error={error}
						/>
					</div>

					<div className="lg:col-span-7">
						<ResultView
							result={result}
							loading={loading}
							refining={refining}
							provider={settings.provider}
							model={settings.model}
							projectInfo={projectInfo}
							selectedTechs={selectedTechs}
							onRefine={refineEstimate}
						/>
					</div>
				</div>
			</main>

			<footer className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-400 text-sm sm:px-6 lg:px-8 dark:text-slate-500">
				<p>© 2026 AI Project Estimator - Powered by Multi-LLM Support</p>
				<p className="mt-1 italic">
					Basato sugli standard di complessità aziendali Senior Architect
				</p>
			</footer>
		</div>
	)
}