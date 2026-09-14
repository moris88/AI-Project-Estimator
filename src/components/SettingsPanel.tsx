import {
	Clipboard,
	Code2,
	Cpu,
	Eye,
	EyeOff,
	Settings as SettingsIcon,
	Sparkles,
	X,
} from 'lucide-react'
import React from 'react'
import { getModels } from '../lib/utils'
import type { AIProvider, AppSettings } from '../types'
import { cn } from '../utils/cn'

interface SettingsPanelProps {
	isOpen: boolean
	onClose: () => void
	settings: AppSettings
	onSettingsChange: (settings: AppSettings) => void
}

const DEFAULT_MODELS: Record<AIProvider, string> = {
	gemini: '',
	openai: '',
	anthropic: '',
}

export const SettingsPanel = ({
	isOpen,
	onClose,
	settings,
	onSettingsChange,
}: SettingsPanelProps) => {
	const [availableModels, setAvailableModels] = React.useState<string[]>([])
	const [showApiKey, setShowApiKey] = React.useState(false)

	React.useEffect(() => {
		if (!isOpen) return

		getModels(settings.provider, settings[`${settings.provider}Key`]).then(
			(models) => {
				setAvailableModels(models)
			},
		)
	}, [isOpen, settings.provider, settings[`${settings.provider}Key`]])

	if (!isOpen) return null

	const options = availableModels.map((model) => (
		<option key={model} value={model}>
			{model}
		</option>
	))

	const disabledOptions =
		availableModels.length === 0 || !settings[`${settings.provider}Key`]

	const handleProviderChange = (newProvider: AIProvider) => {
		onSettingsChange({
			...settings,
			provider: newProvider,
			model: DEFAULT_MODELS[newProvider],
		})
	}

	const modelName = settings.model || DEFAULT_MODELS[settings.provider]

	const handleModelChange = (newModel: string) => {
		onSettingsChange({
			...settings,
			model: newModel,
		})
	}

	return (
		<div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
			<div className="zoom-in-95 relative max-h-[90vh] w-full max-w-2xl animate-in overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl duration-200 dark:border-slate-800 dark:bg-slate-900">
				{/* Header con titolo e pulsante di chiusura */}
				<div className="mb-6 flex items-center justify-between border-slate-100 border-b pb-4 dark:border-slate-800">
					<div className="flex items-center gap-2">
						<SettingsIcon className="h-5 w-5 text-blue-600" />
						<h2 className="font-semibold text-lg">
							Configurazione AI Provider
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
						aria-label="Chiudi"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-12">
					<div className="md:col-span-4 lg:col-span-4">
						<span className="mb-3 block font-medium text-slate-700 text-sm dark:text-slate-300">
							Provider AI Attivo
						</span>
						<div className="space-y-2">
							{(['gemini', 'openai', 'anthropic'] as AIProvider[]).map((p) => (
								<button
									key={p}
									type="button"
									onClick={() => handleProviderChange(p)}
									className={cn(
										'flex w-full items-center gap-3 rounded-lg border p-3 font-medium transition-all',
										settings.provider === p
											? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-950 dark:text-blue-300'
											: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
									)}
								>
									<div
										className={cn(
											'rounded-md p-1.5',
											settings.provider === p
												? 'bg-blue-600 text-white'
												: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
										)}
									>
										{p === 'gemini' && <Sparkles className="h-4 w-4" />}
										{p === 'openai' && <Cpu className="h-4 w-4" />}
										{p === 'anthropic' && <Code2 className="h-4 w-4" />}
									</div>
									<span className="capitalize">{p}</span>
								</button>
							))}
						</div>
					</div>

					<div className="space-y-6 md:col-span-8 lg:col-span-8">
						<div className="grid grid-cols-1 gap-4">
							<div>
								<label
									htmlFor="providerApiKey"
									className="mb-1 block font-medium text-slate-700 text-sm dark:text-slate-300"
								>
									{settings.provider.toUpperCase()} API Key
								</label>
								<div className="relative">
									<input
										id="providerApiKey"
										type={showApiKey ? 'text' : 'password'}
										value={
											settings.provider === 'gemini'
												? settings.geminiKey
												: settings.provider === 'openai'
													? settings.openaiKey
													: settings.anthropicKey
										}
										onChange={(e) =>
											onSettingsChange({
												...settings,
												[`${settings.provider}Key`]: e.target.value,
											})
										}
										placeholder={`Incolla la tua ${settings.provider} API key...`}
										className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-20 pl-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
									/>
									<button
										type="button"
										onClick={() => setShowApiKey((prev) => !prev)}
										aria-label={
											showApiKey ? 'Nascondi API key' : 'Mostra API key'
										}
										title={showApiKey ? 'Nascondi API key' : 'Mostra API key'}
										className="absolute inset-y-0 right-9 flex items-center px-2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
									>
										{showApiKey ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
									<button
										type="button"
										onClick={async () => {
											try {
												const text = await navigator.clipboard.readText()
												onSettingsChange({
													...settings,
													[`${settings.provider}Key`]: text,
												})
											} catch {
												// accesso agli appunti negato dal browser
											}
										}}
										aria-label="Incolla API key dagli appunti"
										title="Incolla dagli appunti"
										className="absolute inset-y-0 right-1 flex items-center px-2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
									>
										<Clipboard className="h-4 w-4" />
									</button>
								</div>
							</div>
							<div>
								<div>
									<label
										htmlFor="model-name"
										className="block font-semibold text-slate-700 text-sm dark:text-slate-300"
									>
										Modello
									</label>
									<select
										id="model-name"
										disabled={disabledOptions}
										value={modelName}
										onChange={(e) => handleModelChange(e.target.value)}
										className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
									>
										{options}
									</select>
								</div>
							</div>
						</div>
						<p className="text-slate-400 text-xs italic">
							Le chiavi vengono salvate esclusivamente nel tuo browser tramite
							LocalStorage.
						</p>
					</div>
				</div>

				<footer className="mx-auto max-w-7xl px-4 pt-4 text-center text-slate-400 text-sm sm:px-6 lg:px-8 dark:text-slate-500">
					<p>
						© {new Date().getFullYear()} AI Project Estimator - Powered by
						Maurizio Tolomeo
					</p>
				</footer>
			</div>
		</div>
	)
}
