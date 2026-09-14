import { PDFDownloadLink } from '@react-pdf/renderer'
import {
	CheckCircle2,
	ChevronDown,
	Download,
	FileText,
	ListChecks,
	Loader2,
	Send,
	Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
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

const markdownComponents: Components = {
	h1: ({ children }) => (
		<h1 className="mt-0 mb-7 border-slate-200 border-b pb-3 font-bold text-2xl text-slate-900 dark:border-slate-700 dark:text-slate-100">
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2 className="mt-10 mb-4 border-blue-200 border-l-4 pl-3 font-bold text-xl text-slate-800 dark:border-blue-800 dark:text-slate-100">
			{children}
		</h2>
	),
	h3: ({ children }) => (
		<h3 className="mt-8 mb-3 font-semibold text-lg text-slate-800 dark:text-slate-100">
			{children}
		</h3>
	),
	p: ({ children }) => (
		<p className="my-5 leading-7 text-slate-700 dark:text-slate-300">{children}</p>
	),
	ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6">{children}</ul>,
	ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>,
	li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
	strong: ({ children }) => <strong className="font-bold text-slate-900 dark:text-slate-100">{children}</strong>,
	table: ({ children }) => (
		<div className="my-7 w-full overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-600">
			<table className="w-full min-w-160 border-collapse text-left text-sm">{children}</table>
		</div>
	),
	thead: ({ children }) => <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>,
	tbody: ({ children }) => <tbody className="divide-y divide-slate-200 dark:divide-slate-700">{children}</tbody>,
	th: ({ children }) => (
		<th className="border-slate-300 border-r px-4 py-3 font-semibold text-slate-800 last:border-r-0 dark:border-slate-600 dark:text-slate-100">
			{children}
		</th>
	),
	td: ({ children }) => (
		<td className="border-slate-200 border-r px-4 py-3 align-top text-slate-700 last:border-r-0 dark:border-slate-700 dark:text-slate-300">
			{children}
		</td>
	),
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
	const [downloadOpen, setDownloadOpen] = useState(false)
	const [downloadName, setDownloadName] = useState('stima_progetto')
	const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'markdown'>('pdf')
	const [openSections, setOpenSections] = useState({ estimate: true, sprints: true })

	const estimateContent = result
		? `${result.stima}${result.sprints ? `\n\n${result.sprints}` : ''}`
		: ''
	const fileBaseName = (downloadName.trim() || 'stima_progetto').replace(/\.(pdf|md)$/i, '')

	const handleMarkdownDownload = () => {
		const blob = new Blob([estimateContent], { type: 'text/markdown;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `${fileBaseName}.md`
		link.click()
		URL.revokeObjectURL(url)
		setDownloadOpen(false)
	}

	const toggleSection = (section: 'estimate' | 'sprints') => {
		setOpenSections((current) => ({ ...current, [section]: !current[section] }))
	}

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
						<div className="relative">
							<button
								type="button"
								onClick={() => setDownloadOpen((isOpen) => !isOpen)}
								className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-600 px-3 py-1 font-medium text-blue-600 text-sm transition-colors hover:border-blue-800 hover:text-blue-800"
								aria-expanded={downloadOpen}
							>
								<Download className="h-4 w-4" />
								Scarica
							</button>
							{downloadOpen && (
								<div className="absolute top-full right-0 z-10 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
									<label htmlFor="download-name" className="mb-1 block font-medium text-slate-700 text-xs dark:text-slate-300">
										Nome del file
									</label>
									<input
										id="download-name"
										type="text"
										value={downloadName}
										onChange={(e) => setDownloadName(e.target.value)}
										placeholder="Es: stima_sito_e-commerce"
										className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
									/>
									<label htmlFor="download-format" className="mb-1 block font-medium text-slate-700 text-xs dark:text-slate-300">
										Formato
									</label>
									<select
										id="download-format"
										value={downloadFormat}
										onChange={(e) => setDownloadFormat(e.target.value as 'pdf' | 'markdown')}
										className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
									>
										<option value="pdf">PDF</option>
										<option value="markdown">Markdown (.md)</option>
									</select>
									{downloadFormat === 'pdf' ? (
										<PDFDownloadLink
											document={
												<EstimatePDF
													content={estimateContent}
													projectInfo={{
														techStack: selectedTechs.join(', '),
														scope: projectInfo.scope,
														type: projectInfo.type,
														notes: projectInfo.notes,
														existingContext: projectInfo.existingContext,
													}}
												/>
											}
											fileName={`${fileBaseName}.pdf`}
											className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-3 py-2 font-medium text-sm text-white hover:bg-blue-700"
										>
											{({ loading: pdfLoading }) => (pdfLoading ? 'Preparazione PDF...' : 'Scarica PDF')}
										</PDFDownloadLink>
									) : (
										<button
											type="button"
											onClick={handleMarkdownDownload}
											className="w-full rounded-lg bg-blue-600 px-3 py-2 font-medium text-sm text-white hover:bg-blue-700"
										>
											Scarica Markdown
										</button>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="not-prose mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
					<button
						type="button"
						onClick={() => toggleSection('estimate')}
						className="group flex w-full cursor-pointer items-center justify-between gap-4 bg-slate-50 px-5 py-4 text-left transition-colors hover:bg-blue-50/70 dark:bg-slate-950 dark:hover:bg-blue-950/30"
						aria-expanded={openSections.estimate}
						aria-controls="estimate-section"
					>
						<span className="flex min-w-0 items-center gap-3">
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
								<FileText className="h-5 w-5" />
							</span>
							<span className="min-w-0">
								<span className="block font-medium text-slate-400 text-xs uppercase tracking-wide dark:text-slate-500">
									Sezione 1
								</span>
								<span className="block truncate font-semibold text-slate-800 text-base dark:text-slate-100">
									Stima del progetto
								</span>
							</span>
						</span>
						<ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:text-blue-600 ${openSections.estimate ? 'rotate-180' : ''}`} />
					</button>
					{openSections.estimate && (
						<div id="estimate-section" className="max-w-none border-slate-200 border-t px-6 py-6 dark:border-slate-800">
							<ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>{result.stima}</ReactMarkdown>
						</div>
					)}
				</div>

				{result.sprints && (
					<>
						<div className="not-prose flex items-center gap-3 px-2 py-3" aria-hidden="true">
							<div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
							<span className="font-medium text-slate-400 text-[11px] uppercase tracking-widest dark:text-slate-500">
								Pianificazione
							</span>
							<div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
						</div>
						<div className="not-prose overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<button
							type="button"
							onClick={() => toggleSection('sprints')}
							className="group flex w-full cursor-pointer items-center justify-between gap-4 bg-slate-50 px-5 py-4 text-left transition-colors hover:bg-emerald-50/70 dark:bg-slate-950 dark:hover:bg-emerald-950/30"
							aria-expanded={openSections.sprints}
							aria-controls="sprints-section"
						>
							<span className="flex min-w-0 items-center gap-3">
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
									<ListChecks className="h-5 w-5" />
								</span>
								<span className="min-w-0">
									<span className="block font-medium text-slate-400 text-xs uppercase tracking-wide dark:text-slate-500">
										Sezione 2
									</span>
									<span className="block truncate font-semibold text-slate-800 text-base dark:text-slate-100">
										Pianificazione settimanale
									</span>
								</span>
							</span>
							<ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:text-emerald-600 ${openSections.sprints ? 'rotate-180' : ''}`} />
						</button>
						{openSections.sprints && (
							<div id="sprints-section" className="max-w-none border-slate-200 border-t px-6 py-6 dark:border-slate-800">
								<ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>{result.sprints}</ReactMarkdown>
							</div>
						)}
						</div>
					</>
				)}

				{/* Box per Affinare/Modificare la Stima al Volo */}
				<div className="not-prose mt-12 border-slate-200 border-t pt-8 dark:border-slate-800">
					<form onSubmit={handleRefineSubmit} className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-slate-800/50">
						<label htmlFor="refinePrompt" className="flex items-center gap-2 font-semibold text-slate-800 text-sm dark:text-slate-200">
							<Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
							Modifica o affina la stima al volo
						</label>
						<div className="flex gap-2">
							<textarea
								rows={4}
								id="refinePrompt"
								value={refinePrompt}
								onChange={(e) => setRefinePrompt(e.target.value)}
								placeholder="Es: Riduci le ore di frontend del 20%, aggiungi 10 ore di QA..."
								disabled={refining}
								className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
							/>
							<div className="flex items-start gap-2">
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