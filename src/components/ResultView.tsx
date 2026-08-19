import { PDFDownloadLink } from '@react-pdf/renderer'
import { CheckCircle2, Download, Loader2, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { EstimationResult, ProjectInfo } from '../types'
import { EstimatePDF } from './EstimatePDF'

interface ResultViewProps {
	result: EstimationResult | null
	loading: boolean
	refining: boolean
	provider: string
	model: string
	projectInfo: ProjectInfo
	selectedTechs: string[]
	onRefine: (prompt: string) => Promise<void>
}

export const ResultView = ({
	result,
	loading,
	refining,
	provider,
	model,
	projectInfo,
	selectedTechs,
	onRefine,
}: ResultViewProps) => {
	const [refinePrompt, setRefinePrompt] = useState('')

	const handleRefineSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!refinePrompt.trim() || refining) return
		await onRefine(refinePrompt)
		setRefinePrompt('')
	}

	if (!result && !loading) {
		return (
			<div className="flex h-full min-h-100 flex-col items-center justify-center rounded-xl border-2 border-slate-200 border-dashed p-8 text-center text-slate-400 dark:border-slate-800">
				<div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-900">
					<Send className="h-8 w-8" />
				</div>
				<h3 className="mb-1 font-medium text-lg text-slate-600 dark:text-slate-300">
					Pronto per iniziare?
				</h3>
				<p className="max-w-xs">
					Inserisci i dettagli del progetto a sinistra per generare una stima
					tecnica dettagliata.
				</p>
			</div>
		)
	}

	if (loading) {
		return (
			<div className="flex h-full min-h-100 animate-pulse flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
				<Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />
				<p className="font-medium text-slate-600 dark:text-slate-300">
					L'AI sta analizzando i requisiti...
				</p>
				<p className="text-slate-400 text-sm">
					Lavorando con {provider} ({model})
				</p>
			</div>
		)
	}

	if (!result) return null

	return (
		<div className="fade-in zoom-in-95 animate-in space-y-8 duration-500">
			<div className="prose prose-slate dark:prose-invert max-w-none overflow-y-auto prose-table:rounded-lg rounded-xl border prose-table:border border-slate-200 bg-white p-8 prose-headings:font-bold prose-a:text-blue-600 prose-headings:text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:prose-headings:text-slate-100">
				<div className="not-prose mb-6 flex items-center justify-between">
					<div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 font-semibold text-green-600 text-sm dark:bg-green-950 dark:text-green-300">
						<CheckCircle2 className="h-4 w-4" />
						Stima Generata con Successo
					</div>
					<div className="flex gap-4">
						<PDFDownloadLink
							document={
								<EstimatePDF
									content={`${result.stima}\n\n${result.sprints}`}
									projectInfo={{
										techStack: selectedTechs.join(', '),
										scope: projectInfo.scope,
										type: projectInfo.type,
										notes: projectInfo.notes,
										existingContext: projectInfo.existingContext,
									}}
								/>
							}
							fileName={`stima_${Date.now()}.pdf`}
							className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-600 px-3 py-1 font-medium text-blue-600 text-sm transition-colors hover:border-blue-800 hover:text-blue-800"
						>
							{({ loading: pdfLoading }) =>
								pdfLoading ? (
									'Preparazione PDF...'
								) : (
									<>
										<Download className="h-4 w-4" />
										Scarica PDF
									</>
								)
							}
						</PDFDownloadLink>
					</div>
				</div>

				<div className="mb-12">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{result.stima}
					</ReactMarkdown>
				</div>

				{result.sprints && (
					<div className="mt-12 border-slate-200 border-t pt-12 dark:border-slate-800">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{result.sprints}
						</ReactMarkdown>
					</div>
				)}

				{/* Box per Affinare/Modificare la Stima al Volo */}
				<div className="not-prose mt-12 border-slate-200 border-t pt-8 dark:border-slate-800">
					<form onSubmit={handleRefineSubmit} className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-slate-800/50">
						<label htmlFor="refinePrompt" className="flex items-center gap-2 font-semibold text-slate-800 text-sm dark:text-slate-200">
							<Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
							Modifica o affina la stima al volo
						</label>
						<div className="flex gap-2">
							<input
								id="refinePrompt"
								type="text"
								value={refinePrompt}
								onChange={(e) => setRefinePrompt(e.target.value)}
								placeholder="Es: Riduci le ore di frontend del 20%, aggiungi 10 ore di QA..."
								disabled={refining}
								className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
							/>
							<button
								type="submit"
								disabled={refining || !refinePrompt.trim()}
								className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-sm text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{refining ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Aggiornamento...
									</>
								) : (
									<>
										<Send className="h-4 w-4" />
										Applica
									</>
								)}
							</button>
						</div>
						<p className="text-slate-500 text-xs dark:text-slate-400">
							Chiedi all'AI di rimodulare ore, aggiungere/rimuovere task o ricalcolare i costi in base ai nuovi vincoli.
						</p>
					</form>
				</div>
			</div>
		</div>
	)
}