import { Code2, Cpu, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import React from 'react'
import { getModels } from '../lib/utils'
import type { AIProvider, AppSettings } from '../types'
import { cn } from '../utils/cn'

interface SettingsPanelProps {
	settings: AppSettings
	onSettingsChange: (settings: AppSettings) => void
}

const DEFAULT_MODELS: Record<AIProvider, string> = {
	gemini: '',
	openai: '',
	anthropic: '',
}

export const SettingsPanel = ({
	settings,
	onSettingsChange,
}: SettingsPanelProps) => {
	const [availableModels, setAvailableModels] = React.useState<string[]>([])

	React.useEffect(() => {
		getModels(settings.provider, settings[`${settings.provider}Key`]).then(
			(models) => {
				setAvailableModels(models)
			},
		)
	}, [settings.provider, settings[`${settings.provider}Key`]])

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
		<div className="fade-in slide-in-from-top-4 mb-8 animate-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm duration-300 dark:border-slate-800 dark:bg-slate-900">
			<div className="mb-6 flex items-center gap-2 border-slate-100 border-b pb-4 dark:border-slate-800">
				<SettingsIcon className="h-5 w-5 text-blue-600" />
				<h2 className="font-semibold text-lg">Configurazione AI Provider</h2>
			</div>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-12">
				<div className="md:col-span-4 lg:col-span-3">
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

				<div className="space-y-6 md:col-span-8 lg:col-span-9">
					<div className="grid grid-cols-1 gap-4">
						<div>
							<label
								htmlFor="providerApiKey"
								className="mb-1 block font-medium text-slate-700 text-sm dark:text-slate-300"
							>
								{settings.provider.toUpperCase()} API Key
							</label>
							<input
								id="providerApiKey"
								type="password"
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
								className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
							/>
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
		</div>
	)
}
