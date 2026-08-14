import {
	Code2,
	Database,
	Layout,
	Loader2,
	PlusCircle,
	Send,
	Server,
} from 'lucide-react'
import type { ProjectInfo, Scope } from '../types'
import { cn } from '../utils/cn'
import { TechStackSelector } from './TechStackSelector'

interface ProjectFormProps {
	projectInfo: ProjectInfo
	selectedTechs: string[]
	onProjectInfoChange: (info: Partial<ProjectInfo>) => void
	onToggleTech: (techValue: string) => void
	onSubmit: (e: React.FormEvent) => void
	loading: boolean
	error: string | null
	provider: string
	model: string
}

export const ProjectForm = ({
	projectInfo,
	selectedTechs,
	onProjectInfoChange,
	onToggleTech,
	onSubmit,
	loading,
	error,
	provider,
	model,
}: ProjectFormProps) => {
	return (
		<div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
			<form onSubmit={onSubmit} className="space-y-6">
				<TechStackSelector
					selectedTechs={selectedTechs}
					onToggleTech={onToggleTech}
					provider={provider}
					model={model}
				/>

				<div className="grid grid-cols-2 gap-4">
					<fieldset className="space-y-2">
						<legend className="block font-medium text-slate-700 text-sm dark:text-slate-300">
							Ambito
						</legend>
						<div className="grid grid-cols-1 gap-2">
							{(['Frontend', 'Backend', 'Full-stack'] as Scope[]).map((s) => (
								<button
									key={s}
									type="button"
									onClick={() => onProjectInfoChange({ scope: s })}
									className={cn(
										'flex items-center gap-2 rounded-lg border px-3 py-2 font-medium text-xs transition-all',
										projectInfo.scope === s
											? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-950 dark:text-blue-300'
											: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
									)}
								>
									{s === 'Frontend' && <Layout className="h-3 w-3" />}
									{s === 'Backend' && <Server className="h-3 w-3" />}
									{s === 'Full-stack' && <Database className="h-3 w-3" />}
									{s}
								</button>
							))}
						</div>
					</fieldset>

					<fieldset className="space-y-2">
						<legend className="block font-medium text-slate-700 text-sm dark:text-slate-300">
							Tipo Progetto
						</legend>
						<div className="grid grid-cols-1 gap-2">
							<button
								type="button"
								onClick={() => onProjectInfoChange({ type: 'new' })}
								className={cn(
									'flex items-center gap-2 rounded-lg border px-3 py-2 font-medium text-xs transition-all',
									projectInfo.type === 'new'
										? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-950 dark:text-blue-300'
										: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
								)}
							>
								<PlusCircle className="h-3 w-3" />
								Nuovo
							</button>
							<button
								type="button"
								onClick={() => onProjectInfoChange({ type: 'existing' })}
								className={cn(
									'flex items-center gap-2 rounded-lg border px-3 py-2 font-medium text-xs transition-all',
									projectInfo.type === 'existing'
										? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-950 dark:text-blue-300'
										: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
								)}
							>
								<Code2 className="h-3 w-3" />
								Esistente
							</button>
						</div>
					</fieldset>
				</div>

				{projectInfo.type === 'existing' && (
					<div className="fade-in slide-in-from-top-2 animate-in">
						<label
							htmlFor="existingContext"
							className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300"
						>
							Stato Attuale / Contesto del Codice
						</label>
						<textarea
							id="existingContext"
							required
							value={projectInfo.existingContext || ''}
							onChange={(e) =>
								onProjectInfoChange({ existingContext: e.target.value })
							}
							placeholder="Descrivi l'app attuale, l'architettura, i moduli già presenti..."
							rows={3}
							className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
						/>
					</div>
				)}

				<div>
					<label
						htmlFor="requirements"
						className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300"
					>
						Nuove Funzionalità / Requisiti
					</label>
					<textarea
						id="requirements"
						required
						value={projectInfo.requirements}
						onChange={(e) =>
							onProjectInfoChange({ requirements: e.target.value })
						}
						placeholder="Descrivi cosa deve essere aggiunto o modificato..."
						rows={10}
						className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
					/>
				</div>

				<div>
					<label
						htmlFor="notes"
						className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300"
					>
						Note Aggiuntive (opzionale)
					</label>
					<textarea
						id="notes"
						value={projectInfo.notes || ''}
						onChange={(e) => onProjectInfoChange({ notes: e.target.value })}
						placeholder="Vincoli particolari, performance, sicurezza..."
						rows={5}
						className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
					/>
				</div>

				{error && (
					<div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-red-600 text-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
						<span className="h-1.5 w-1.5 rounded-full bg-red-600" />
						{error}
					</div>
				)}

				<button
					type="submit"
					disabled={loading}
					className={cn(
						'cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-all active:scale-[0.98]',
						loading
							? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
							: 'bg-blue-600 text-white hover:bg-blue-700',
					)}
				>
					{loading ? (
						<>
							<Loader2 className="h-5 w-5 animate-spin" />
							Elaborazione in corso...
						</>
					) : (
						<>
							<Send className="h-5 w-5" />
							Genera Stima Professionale
						</>
					)}
				</button>
			</form>
		</div>
	)
}
