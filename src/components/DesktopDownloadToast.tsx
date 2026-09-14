import { Download, X } from 'lucide-react'

interface DesktopDownloadToastProps {
	onDismiss: () => void
}

export const DesktopDownloadToast = ({
	onDismiss,
}: DesktopDownloadToastProps) => {
	return (
		<section
			className="border-blue-200 border-b bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/40"
			aria-label="Download applicazione desktop"
		>
			<div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
				<Download className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
				<p className="min-w-0 flex-1 text-slate-700 text-sm dark:text-slate-200">
					Preferisci lavorare offline? Scarica l&apos;app desktop per Windows o
					Linux.
				</p>
				<a
					href="https://github.com/moris88/AI-Project-Estimator/releases"
					target="_blank"
					rel="noreferrer"
					className="shrink-0 rounded-md bg-blue-600 px-3 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
				>
					Scarica
				</a>
				<button
					type="button"
					onClick={onDismiss}
					className="shrink-0 rounded-md p-2 text-slate-500 transition-colors hover:bg-blue-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-blue-900/50 dark:hover:text-slate-100"
					aria-label="Chiudi avviso download desktop"
					title="Chiudi"
				>
					<X className="h-5 w-5" />
				</button>
			</div>
		</section>
	)
}
