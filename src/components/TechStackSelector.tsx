import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { techStacks } from '../lib/constants'

interface TechStackSelectorProps {
	selectedTechs: string[]
	onToggleTech: (techValue: string) => void
	provider: string
	model: string
}

export const TechStackSelector = ({
	selectedTechs,
	onToggleTech,
	provider,
	model,
}: TechStackSelectorProps) => {
	const [techSearch, setTechSearch] = useState('')

	const filteredTechs = techStacks.filter(
		(tech) =>
			(tech.name.toLowerCase().includes(techSearch.toLowerCase()) ||
				tech.description.toLowerCase().includes(techSearch.toLowerCase())) &&
			!selectedTechs.includes(tech.value),
	)

	const handleToggle = (techValue: string) => {
		onToggleTech(techValue)
		setTechSearch('')
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="block font-medium text-slate-700 text-sm">
					Stack Tecnologico
				</span>
				<span className="rounded-full bg-blue-50 px-2 py-0.5 font-bold text-[10px] text-blue-600 uppercase">
					{provider} - {model}
				</span>
			</div>

			<div className="mb-3 flex flex-wrap gap-2">
				{selectedTechs.map((techValue) => (
					<span
						key={techValue}
						className="group zoom-in-90 inline-flex animate-in items-center gap-1 rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700 text-xs transition-all"
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
					value={techSearch}
					onChange={(e) => setTechSearch(e.target.value)}
					placeholder="Cerca tecnologie (es: React, Zoho...)"
					className="w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 outline-none transition-all focus:ring-2 focus:ring-blue-500"
				/>

				{techSearch && (
					<div className="fade-in slide-in-from-top-2 absolute z-20 mt-1 max-h-60 w-full animate-in overflow-auto rounded-lg border border-slate-200 bg-white shadow-xl">
						{filteredTechs.length > 0 ? (
							filteredTechs.map((tech) => (
								<button
									key={tech.value}
									type="button"
									onClick={() => handleToggle(tech.value)}
									className="flex w-full flex-col border-slate-100 border-b px-4 py-3 text-left last:border-0 hover:bg-slate-50"
								>
									<span className="font-semibold text-slate-800 text-sm">
										{tech.name}
									</span>
									<span className="truncate text-slate-500 text-xs">
										{tech.description}
									</span>
								</button>
							))
						) : (
							<div className="px-4 py-3 text-slate-500 text-sm italic">
								Nessuna tecnologia trovata
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
