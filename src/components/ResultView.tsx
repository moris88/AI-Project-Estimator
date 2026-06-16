import { PDFDownloadLink } from '@react-pdf/renderer'
import { CheckCircle2, Download, FileText, Loader2, Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { EstimationResult, ProjectInfo } from '../types'
import { EstimatePDF } from './EstimatePDF'

interface ResultViewProps {
	result: EstimationResult | null
	loading: boolean
	provider: string
	model: string
	projectInfo: ProjectInfo
	selectedTechs: string[]
}

export const ResultView = ({
	result,
	loading,
	provider,
	model,
	projectInfo,
	selectedTechs,
}: ResultViewProps) => {
	if (!result && !loading) {
		return (
			<div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-slate-200 border-dashed p-8 text-center text-slate-400">
				<div className="mb-4 rounded-full bg-slate-100 p-4">
					<Send className="h-8 w-8" />
				</div>
				<h3 className="mb-1 font-medium text-lg text-slate-600">
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
			<div className="flex h-full min-h-[400px] animate-pulse flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
				<Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />
				<p className="font-medium text-slate-600">
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
			<div className="prose prose-slate max-w-none prose-table:rounded-lg rounded-xl border prose-table:border border-slate-200 bg-white p-8 prose-headings:font-bold prose-a:text-blue-600 prose-headings:text-slate-900 shadow-sm">
				<div className="not-prose mb-6 flex items-center justify-between">
					<div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 font-semibold text-green-600 text-sm">
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
							className="flex items-center gap-2 font-medium text-blue-600 text-sm transition-colors hover:text-blue-800"
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
						<button
							type="button"
							onClick={() => window.print()}
							className="flex items-center gap-2 font-medium text-slate-500 text-sm transition-colors hover:text-slate-800"
						>
							<FileText className="h-4 w-4" />
							Stampa
						</button>
					</div>
				</div>

				<div className="mb-12">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{result.stima}
					</ReactMarkdown>
				</div>

				{result.sprints && (
					<div className="mt-12 border-slate-200 border-t pt-12">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{result.sprints}
						</ReactMarkdown>
					</div>
				)}
			</div>
		</div>
	)
}
