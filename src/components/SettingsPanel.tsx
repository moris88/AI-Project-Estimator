import { Code2, Cpu, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import type { AIProvider, AppSettings } from '../types'
import { cn } from '../utils/cn'

interface SettingsPanelProps {
	settings: AppSettings
	onSettingsChange: (settings: AppSettings) => void
}

const MODEL_SUGGESTIONS: Record<AIProvider, string[]> = {
	gemini: ['gemini-2.5-fresh', 'gemini-3.5-flash'],
	openai: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'gpt-4-turbo'],
	anthropic: [
		'claude-3-5-sonnet-latest',
		'claude-3-5-haiku-latest',
		'claude-3-opus-latest',
	],
}

const DEFAULT_MODELS: Record<AIProvider, string> = {
	gemini: 'gemini-2.5-fresh',
	openai: 'gpt-4o',
	anthropic: 'claude-3-5-sonnet-latest',
}

export const SettingsPanel = ({
	settings,
	onSettingsChange,
}: SettingsPanelProps) => {
	const handleProviderChange = (newProvider: AIProvider) => {
		onSettingsChange({
			...settings,
			provider: newProvider,
			model: DEFAULT_MODELS[newProvider],
		})
	}

	return (
		<div className="fade-in slide-in-from-top-4 mb-8 animate-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm duration-300">
			<div className="mb-6 flex items-center gap-2 border-slate-100 border-b pb-4">
				<SettingsIcon className="h-5 w-5 text-blue-600" />
				<h2 className="font-semibold text-lg">Configurazione AI Provider</h2>
			</div>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-12">
				<div className="md:col-span-4 lg:col-span-3">
					<span className="mb-3 block font-medium text-slate-700 text-sm">
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
										? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
										: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
								)}
							>
								<div
									className={cn(
										'rounded-md p-1.5',
										settings.provider === p
											? 'bg-blue-600 text-white'
											: 'bg-slate-100 text-slate-500',
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
								className="mb-1 block font-medium text-slate-700 text-sm"
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
								className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label
								htmlFor="modelInput"
								className="mb-1 block font-medium text-slate-700 text-sm"
							>
								Modello (Nome Libero)
							</label>
							<div className="relative">
								<input
									id="modelInput"
									type="text"
									value={settings.model}
									onChange={(e) =>
										onSettingsChange({ ...settings, model: e.target.value })
									}
									placeholder="Es: gpt-4o, claude-3-5-sonnet..."
									className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
								/>
								<div className="mt-2 flex flex-wrap gap-2">
									{MODEL_SUGGESTIONS[settings.provider].map((m) => (
										<button
											key={m}
											type="button"
											onClick={() =>
												onSettingsChange({ ...settings, model: m })
											}
											className="rounded-full bg-slate-100 px-3 py-1 font-medium text-[10px] text-slate-600 transition-colors hover:bg-slate-200"
										>
											{m}
										</button>
									))}
								</div>
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
