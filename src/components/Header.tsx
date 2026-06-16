import { Database, Settings } from 'lucide-react'
import { cn } from '../utils/cn'

interface HeaderProps {
	showSettings: boolean
	onToggleSettings: () => void
	hasApiKey: boolean
}

export const Header = ({
	showSettings,
	onToggleSettings,
	hasApiKey,
}: HeaderProps) => {
	return (
		<header className="sticky top-0 z-10 border-slate-200 border-b bg-white">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-2">
					<div className="rounded-lg bg-blue-600 p-2">
						<Database className="h-5 w-5 text-white" />
					</div>
					<h1 className="font-bold text-xl tracking-tight">
						AI Project Estimator
					</h1>
				</div>
				<button
					type="button"
					onClick={onToggleSettings}
					className="relative rounded-full p-2 transition-colors hover:bg-slate-100"
					title="Impostazioni"
				>
					<Settings
						className={cn(
							'h-5 w-5 text-slate-600',
							showSettings && 'text-blue-600',
						)}
					/>
					{!hasApiKey && (
						<span className="absolute top-1 right-1 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
					)}
				</button>
			</div>
		</header>
	)
}
