import {
	Award,
	Clipboard,
	Code2,
	Database,
	FileText,
	FileUp,
	GraduationCap,
	Layout,
	Loader2,
	PlusCircle,
	Send,
	Server,
	Trash2,
	X,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { extractPdfText, MAX_REFERENCE_PDFS } from '../lib/pdf'
import type { PreviousEstimate, ProjectInfo, Scope } from '../types'
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
	onReset: () => void
}

export const ProjectForm = ({
	projectInfo,
	selectedTechs,
	onProjectInfoChange,
	onToggleTech,
	onSubmit,
	loading,
	error,
	onReset,
}: ProjectFormProps) => {
	const [pdfLoading, setPdfLoading] = useState(false)
	const [pdfError, setPdfError] = useState<string | null>(null)
	const previousEstimates = projectInfo.previousEstimates || []

	// Refs per i file input dei singoli textarea
	const existingContextPdfRef = useRef<HTMLInputElement>(null)
	const requirementsPdfRef = useRef<HTMLInputElement>(null)
	const notesPdfRef = useRef<HTMLInputElement>(null)

	const handlePdfChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = Array.from(event.target.files || [])
		const availableSlots = MAX_REFERENCE_PDFS - previousEstimates.length

		setPdfError(null)
		event.target.value = ''

		if (files.length === 0) return
		if (availableSlots <= 0) {
			setPdfError(`Puoi allegare al massimo ${MAX_REFERENCE_PDFS} PDF.`)
			return
		}
		if (files.length > availableSlots) {
			setPdfError(`Puoi aggiungere ancora ${availableSlots} PDF.`)
		}

		setPdfLoading(true)
		try {
			const extracted = await Promise.all(
				files.slice(0, availableSlots).map(
					async (file): Promise<PreviousEstimate> => ({
						name: file.name,
						text: await extractPdfText(file),
					}),
				),
			)
			onProjectInfoChange({
				previousEstimates: [...previousEstimates, ...extracted],
			})
		} catch (error) {
			setPdfError(
				error instanceof Error ? error.message : 'Impossibile leggere il PDF.',
			)
		} finally {
			setPdfLoading(false)
		}
	}

	const handleRemovePdf = (estimateToRemove: PreviousEstimate) => {
		onProjectInfoChange({
			previousEstimates: previousEstimates.filter(
				(estimate) => estimate !== estimateToRemove,
			),
		})
	}

	// Incolla il testo dagli appunti
	const handlePasteClipboard = async (fieldKey: keyof ProjectInfo) => {
		try {
			const text = await navigator.clipboard.readText()
			if (text) {
				const currentValue = (projectInfo[fieldKey] as string) || ''
				const newValue = currentValue ? `${currentValue}\n${text}` : text
				onProjectInfoChange({ [fieldKey]: newValue })
			}
		} catch (err) {
			console.error('Impossibile accedere agli appunti:', err)
		}
	}

	// Estrae il testo da un PDF e lo incolla nel textarea specificato
	const handlePastePdfToField = async (
		fieldKey: keyof ProjectInfo,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0]
		e.target.value = ''
		if (!file) return

		setPdfLoading(true)
		setPdfError(null)

		try {
			const extractedText = await extractPdfText(file)
			if (extractedText) {
				const currentValue = (projectInfo[fieldKey] as string) || ''
				const newValue = currentValue
					? `${currentValue}\n\n${extractedText}`
					: extractedText
				onProjectInfoChange({ [fieldKey]: newValue })
			}
		} catch (error) {
			setPdfError(
				error instanceof Error ? error.message : 'Impossibile leggere il PDF.',
			)
		} finally {
			setPdfLoading(false)
		}
	}

	return (
		<div className="sticky top-24 max-h-[calc(100vh-10rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
			<div className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-slate-50 p-6 dark:bg-slate-950">
				<h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
					Dati del progetto
				</h2>
				<button
					type="button"
					onClick={onReset}
					disabled={loading}
					className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-medium text-red-600 text-xs transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
					title="Cancella tutti i dati del progetto"
				>
					<Trash2 className="h-4 w-4" />
					Reimposta
				</button>
			</div>
			<form onSubmit={onSubmit} className="space-y-6">
				<TechStackSelector
					className="mt-4 px-6"
					selectedTechs={selectedTechs}
					onToggleTech={onToggleTech}
				/>

				<div className="grid grid-cols-2 gap-4 px-6">
					<fieldset className="space-y-2">
						<legend className="block font-medium text-slate-700 text-sm dark:text-slate-300">
							Ambito
						</legend>
						<p className="text-slate-500 text-xs dark:text-slate-400">
							Scegli quale parte dell’app deve essere realizzata:{' '}
							<strong>Frontend</strong> è ciò che l’utente vede e usa,{' '}
							<strong>Backend</strong> è ciò che lavora dietro le quinte e{' '}
							<strong>Full-stack</strong> comprende entrambe.
						</p>
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
						<p className="text-slate-500 text-xs dark:text-slate-400">
							Scegli se si parte da zero o se si interviene su un’applicazione
							già esistente.
						</p>
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

				<fieldset className="space-y-2 px-6">
					<legend className="block font-medium text-slate-700 text-sm dark:text-slate-300">
						Livello di Esperienza del Team
					</legend>
					<p className="text-slate-500 text-xs dark:text-slate-400">
						Indica quanto il team conosce già gli strumenti scelti per questo
						progetto. Considera la familiarità media delle persone che
						lavoreranno al progetto, non solo gli anni di esperienza
						complessivi.
					</p>
					<div className="grid grid-cols-2 gap-2">
						<button
							type="button"
							onClick={() =>
								onProjectInfoChange({ experienceLevel: 'beginner' })
							}
							className={cn(
								'flex items-center gap-2 rounded-lg border px-3 py-2 font-medium text-xs transition-all',
								projectInfo.experienceLevel === 'beginner'
									? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-950 dark:text-blue-300'
									: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
							)}
						>
							<GraduationCap className="h-4 w-4" />
							Principiante
						</button>
						<button
							type="button"
							onClick={() =>
								onProjectInfoChange({ experienceLevel: 'experienced' })
							}
							className={cn(
								'flex items-center gap-2 rounded-lg border px-3 py-2 font-medium text-xs transition-all',
								projectInfo.experienceLevel === 'experienced'
									? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-950 dark:text-blue-300'
									: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
							)}
						>
							<Award className="h-4 w-4" />
							Esperto
						</button>
					</div>
					<div className="space-y-1 text-slate-500 text-xs dark:text-slate-400">
						<p>
							<strong className="font-medium text-slate-600 dark:text-slate-300">
								Principiante:
							</strong>{' '}
							il team ha poca esperienza con gli strumenti scelti o con lavori
							simili. La stima considera circa il 20% di tempo in più per
							imparare e gestire gli imprevisti.
						</p>
						<p>
							<strong className="font-medium text-slate-600 dark:text-slate-300">
								Esperto:
							</strong>{' '}
							il team ha già svolto lavori simili e sa usare gli strumenti
							scelti in autonomia. La stima considera circa il 10% di tempo in
							meno.
						</p>
					</div>
				</fieldset>

				{/* Percentuali di margine */}
				<div className="grid grid-cols-3 gap-3 px-6">
					<div className="col-span-3">
						<p className="text-slate-500 text-xs dark:text-slate-400">
							Aggiungi del tempo extra alla stima per tenere conto dei
							controlli, dei problemi imprevisti e dei possibili cambiamenti
							durante il progetto.
						</p>
					</div>
					<div className="flex flex-col">
						<label
							htmlFor="testing"
							className="mb-1 flex min-h-8 items-start font-medium text-slate-700 text-xs dark:text-slate-300"
						>
							Testing (%)
						</label>
						<p className="mb-1 min-h-8 text-[11px] text-slate-500 dark:text-slate-400">
							Tempo per controllare che tutto funzioni.
						</p>
						<input
							type="number"
							id="testing"
							min={0}
							max={100}
							value={projectInfo.percentage?.testing ?? 5}
							onChange={(e) =>
								onProjectInfoChange({
									percentage: {
										...projectInfo.percentage,
										testing: Number(e.target.value),
									},
								})
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
						/>
					</div>
					<div className="flex flex-col">
						<label
							htmlFor="buffer"
							className="mb-1 flex min-h-8 items-start font-medium text-slate-700 text-xs dark:text-slate-300"
						>
							Imprevisti (%)
						</label>
						<p className="mb-1 min-h-8 text-[11px] text-slate-500 dark:text-slate-400">
							Tempo per problemi o attività impreviste.
						</p>
						<input
							type="number"
							id="buffer"
							min={0}
							max={100}
							value={projectInfo.percentage?.buffer ?? 10}
							onChange={(e) =>
								onProjectInfoChange({
									percentage: {
										...projectInfo.percentage,
										buffer: Number(e.target.value),
									},
								})
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
						/>
					</div>
					<div className="flex flex-col">
						<label
							htmlFor="cr"
							className="mb-1 flex min-h-8 items-start font-medium text-slate-700 text-xs dark:text-slate-300"
						>
							Change Request (%)
						</label>
						<p className="mb-1 min-h-8 text-[11px] text-slate-500 dark:text-slate-400">
							Tempo per cambiamenti richiesti in seguito.
						</p>
						<input
							type="number"
							id="cr"
							min={0}
							max={100}
							value={projectInfo.percentage?.changeRequest ?? 5}
							onChange={(e) =>
								onProjectInfoChange({
									percentage: {
										...projectInfo.percentage,
										changeRequest: Number(e.target.value),
									},
								})
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
						/>
					</div>
				</div>

				{projectInfo.type === 'existing' && (
					<div className="fade-in slide-in-from-top-2 animate-in px-6">
						<div className="flex items-center justify-between space-y-2">
							<label
								htmlFor="existingContext"
								className="block font-medium text-slate-700 text-sm dark:text-slate-300"
							>
								Stato Attuale / Contesto del Codice
							</label>
							<div className="flex gap-1.5">
								<button
									type="button"
									onClick={() => handlePasteClipboard('existingContext')}
									className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-medium text-slate-600 text-xs hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
									title="Incolla dagli appunti"
								>
									<Clipboard className="h-3 w-3" />
									Incolla
								</button>
								<button
									type="button"
									onClick={() => existingContextPdfRef.current?.click()}
									className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 font-medium text-blue-600 text-xs hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/80"
									title="Incolla testo estraendolo da un PDF"
								>
									<FileUp className="h-3 w-3" />
									Incolla da PDF
								</button>
								<input
									ref={existingContextPdfRef}
									type="file"
									accept="application/pdf,.pdf"
									className="hidden"
									onChange={(e) => handlePastePdfToField('existingContext', e)}
								/>
							</div>
						</div>
						<p className="mb-2 text-slate-500 text-xs dark:text-slate-400">
							Spiega com’è fatta oggi l’app, cosa funziona già e quali parti
							potrebbero richiedere lavoro prima delle modifiche.
						</p>
						<textarea
							id="existingContext"
							required
							value={projectInfo.existingContext || ''}
							onChange={(e) =>
								onProjectInfoChange({ existingContext: e.target.value })
							}
							placeholder="Es: sito per prenotare visite già online; login e calendario funzionano, ma manca il pagamento..."
							rows={3}
							className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
						/>
					</div>
				)}

				<div className="px-6">
					<div className="flex items-center justify-between space-y-2">
						<label
							htmlFor="requirements"
							className="block font-medium text-slate-700 text-sm dark:text-slate-300"
						>
							Nuove Funzionalità / Requisiti{' '}
							<span className="font-normal text-red-500">(obbligatorio)</span>
						</label>
						<div className="flex gap-1.5">
							<button
								type="button"
								onClick={() => handlePasteClipboard('requirements')}
								className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-medium text-slate-600 text-xs hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
								title="Incolla dagli appunti"
							>
								<Clipboard className="h-3 w-3" />
								Incolla
							</button>
							<button
								type="button"
								onClick={() => requirementsPdfRef.current?.click()}
								className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 font-medium text-blue-600 text-xs hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/80"
								title="Incolla testo estraendolo da un PDF"
							>
								<FileUp className="h-3 w-3" />
								Incolla da PDF
							</button>
							<input
								ref={requirementsPdfRef}
								type="file"
								accept="application/pdf,.pdf"
								className="hidden"
								onChange={(e) => handlePastePdfToField('requirements', e)}
							/>
						</div>
					</div>
					<p className="mb-2 text-slate-500 text-xs dark:text-slate-400">
						Scrivi cosa vuoi ottenere, chi userà la funzione e quali regole deve
						rispettare. Più informazioni fornisci, più la stima sarà precisa.
					</p>
					<textarea
						id="requirements"
						required
						aria-required="true"
						value={projectInfo.requirements}
						onChange={(e) =>
							onProjectInfoChange({ requirements: e.target.value })
						}
						placeholder="Es: permettere agli utenti di registrarsi, scegliere una data e pagare la prenotazione con carta..."
						rows={10}
						className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
					/>
				</div>

				<div className="px-6">
					<div className="flex items-center justify-between space-y-2">
						<label
							htmlFor="notes"
							className="block font-medium text-slate-700 text-sm dark:text-slate-300"
						>
							Note Aggiuntive (opzionale)
						</label>
						<div className="flex gap-1.5">
							<button
								type="button"
								onClick={() => handlePasteClipboard('notes')}
								className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-medium text-slate-600 text-xs hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
								title="Incolla dagli appunti"
							>
								<Clipboard className="h-3 w-3" />
								Incolla
							</button>
							<button
								type="button"
								onClick={() => notesPdfRef.current?.click()}
								className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 font-medium text-blue-600 text-xs hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/80"
								title="Incolla testo estraendolo da un PDF"
							>
								<FileUp className="h-3 w-3" />
								Incolla da PDF
							</button>
							<input
								ref={notesPdfRef}
								type="file"
								accept="application/pdf,.pdf"
								className="hidden"
								onChange={(e) => handlePastePdfToField('notes', e)}
							/>
						</div>
					</div>
					<p className="mb-2 text-slate-500 text-xs dark:text-slate-400">
						Aggiungi regole o richieste particolari, ad esempio sicurezza,
						velocità, scadenze o informazioni utili che non hai inserito sopra.
					</p>
					<textarea
						id="notes"
						value={projectInfo.notes || ''}
						onChange={(e) => onProjectInfoChange({ notes: e.target.value })}
						placeholder="Es: deve funzionare bene da smartphone, rispettare la privacy e andare online entro il 30 giugno..."
						rows={5}
						className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
					/>
					<div className="mt-4">
						<label
							htmlFor="previous-estimates"
							className="mb-2 flex items-center gap-2 font-medium text-slate-700 text-sm dark:text-slate-300"
						>
							<FileText className="h-4 w-4 text-blue-600" />
							Stime precedenti in PDF (opzionale)
						</label>
						<p className="mb-2 text-slate-500 text-xs dark:text-slate-400">
							Allega stime già approvate o progetti comparabili per fornire
							all’AI un riferimento storico. Il contenuto viene usato solo come
							contesto.
						</p>
						<input
							id="previous-estimates"
							type="file"
							accept="application/pdf,.pdf"
							multiple
							disabled={
								pdfLoading || previousEstimates.length >= MAX_REFERENCE_PDFS
							}
							onChange={handlePdfChange}
							className="block w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
						/>
						<p className="mt-1 text-slate-400 text-xs">
							Puoi allegare fino a {MAX_REFERENCE_PDFS} PDF con stime precedenti
							o progetti simili. Il contenuto verrà usato come riferimento.
						</p>
						{pdfLoading && (
							<p className="mt-2 flex items-center gap-2 text-blue-600 text-xs">
								<Loader2 className="h-3 w-3 animate-spin" /> Lettura dei PDF in
								corso...
							</p>
						)}
						{previousEstimates.length > 0 && (
							<div className="mt-3 space-y-2">
								{previousEstimates.map((estimate) => (
									<div
										key={`${estimate.name}-${estimate.text.length}`}
										className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300"
									>
										<span className="flex min-w-0 items-center gap-2 truncate">
											<FileText className="h-4 w-4 shrink-0" />
											<span className="truncate">{estimate.name}</span>
										</span>
										<button
											type="button"
											onClick={() => handleRemovePdf(estimate)}
											className="shrink-0 rounded p-1 hover:bg-blue-100 dark:hover:bg-blue-900"
											aria-label={`Rimuovi ${estimate.name}`}
											title={`Rimuovi ${estimate.name}`}
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								))}
							</div>
						)}
						{pdfError && (
							<p className="mt-2 text-red-600 text-xs dark:text-red-300">
								{pdfError}
							</p>
						)}
					</div>
				</div>

				{error && (
					<div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-6 text-red-600 text-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
						<span className="h-1.5 w-1.5 rounded-full bg-red-600" />
						{error}
					</div>
				)}

				<div className="sticky bottom-0 flex w-full items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
					<button
						type="submit"
						disabled={loading}
						className={cn(
							'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-all active:scale-[0.98]',
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
								Genera Stima
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	)
}
