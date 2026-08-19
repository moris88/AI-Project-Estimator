import { Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { techStacks } from '../lib/constants'

interface TechStackSelectorProps {
	selectedTechs: string[]
	onToggleTech: (techValue: string) => void
	className?: string
}

export const TechStackSelector = ({
	selectedTechs,
	onToggleTech,
	className = '',
}: TechStackSelectorProps) => {
	const [techSearch, setTechSearch] = useState<string | null>(null)
	const [showDropdown, setShowDropdown] = useState(false)

	const query = techSearch?.trim() ?? ''

	// Verifica se la voce cercata è già presente tra quelle selezionate
	const isAlreadySelected = selectedTechs.some(
		(tech) => tech.toLowerCase() === query.toLowerCase()
	)

	// Verifica se esiste già un match esatto tra le opzioni predefinite
	const hasExactMatchInPreset = techStacks.some(
		(tech) =>
			tech.name.toLowerCase() === query.toLowerCase() ||
			tech.value.toLowerCase() === query.toLowerCase()
	)

	const filteredTechs = techStacks.filter((tech) => {
		// Esclude sempre gli elementi già selezionati
		const isAlreadySelected = selectedTechs.includes(tech.value)
		if (isAlreadySelected) return false

		// Se non c'è ricerca, mostra tutti gli elementi rimanenti
		if (!techSearch) return true

		// Altrimenti applica il filtro per nome e descrizione
		const q = techSearch.toLowerCase()
		return (
			tech.name.toLowerCase().includes(q) ||
			tech.description.toLowerCase().includes(q)
		)
	})

	const handleToggle = (techValue: string) => {
		onToggleTech(techValue)
		setTechSearch(null)
	}

	// Permette di aggiungere il valore inserito premendo Invio
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && query && !isAlreadySelected) {
			e.preventDefault()
			handleToggle(query)
		}
	}

	return (
		<div className={className}>
			<div className="flex items-center justify-between">
				<span className="block font-medium text-slate-700 text-sm dark:text-slate-300">
					Stack Tecnologico
				</span>
			</div>

			<div className="mb-3 flex flex-wrap gap-2">
				{selectedTechs.map((techValue) => (
					<span
						key={techValue}
						className="group zoom-in-90 inline-flex animate-in items-center gap-1 rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700 text-xs transition-all dark:bg-blue-950 dark:text-blue-300"
					>
						{techValue}
						<button
							type="button"
							onClick={() => handleToggle(techValue)}
							className="hover:text-blue-900 focus:outline-none"
						>
							<X className="h-3 w-3" />
						</button>
					</span>
				))}
			</div>

			<div className="group relative">
				<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 transition-colors group-focus-within:text-blue-500">
					<Search className="h-4 w-4" />
				</div>
				<input
					type="text"
					value={techSearch ?? ''}
					onChange={(e) => setTechSearch(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={() => setShowDropdown(true)}
					onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
					placeholder="Cerca o aggiungi tecnologia (es: React, Rust...)"
					className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-4 pl-10 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
				/>
				{showDropdown && (
					<div className="fade-in slide-in-from-top-2 absolute z-20 mt-1 max-h-60 w-full animate-in overflow-auto rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
						{/* Opzione per aggiungere un elemento personalizzato */}
						{query && !isAlreadySelected && !hasExactMatchInPreset && (
							<button
								type="button"
								onClick={() => handleToggle(query)}
								className="flex w-full items-center gap-2 border-slate-100 border-b px-4 py-3 text-left font-medium text-blue-600 hover:bg-blue-50 dark:border-slate-800 dark:text-blue-400 dark:hover:bg-slate-800"
							>
								<Plus className="h-4 w-4" />
								<span>
									Aggiungi <strong className="font-bold">"{query}"</strong>
								</span>
							</button>
						)}

						{filteredTechs.length > 0 ? (
							filteredTechs.map((tech) => (
								<button
									key={tech.value}
									type="button"
									onClick={() => handleToggle(tech.value)}
									className="flex w-full flex-col border-slate-100 border-b px-4 py-3 text-left last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
								>
									<span className="font-semibold text-slate-800 text-sm dark:text-slate-100">
										{tech.name}
									</span>
									<span className="truncate text-slate-500 text-xs dark:text-slate-400">
										{tech.description}
									</span>
								</button>
							))
						) : (
							!query && (
								<div className="px-4 py-3 text-slate-500 text-sm italic dark:text-slate-400">
									Nessuna tecnologia trovata
								</div>
							)
						)}
					</div>
				)}
			</div>
		</div>
	)
}