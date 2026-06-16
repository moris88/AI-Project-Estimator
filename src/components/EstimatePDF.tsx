import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
	page: {
		padding: 50,
		fontSize: 10,
		fontFamily: 'Helvetica',
		lineHeight: 1.6,
		color: '#334155',
	},
	header: {
		marginBottom: 30,
		borderBottom: 2,
		borderBottomColor: '#2563eb',
		paddingBottom: 15,
	},
	mainTitle: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#1e3a8a',
		marginBottom: 5,
	},
	metaContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 15,
		marginTop: 10,
	},
	metaItem: {
		fontSize: 9,
		color: '#64748b',
		backgroundColor: '#f8fafc',
		padding: '4 8',
		borderRadius: 4,
	},
	section: {
		marginTop: 20,
		marginBottom: 10,
	},
	h1: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1e40af',
		borderBottom: 1,
		borderBottomColor: '#e2e8f0',
		paddingBottom: 5,
		marginBottom: 10,
		textTransform: 'uppercase',
	},
	h2: {
		fontSize: 13,
		fontWeight: 'bold',
		color: '#1e3a8a',
		marginTop: 15,
		marginBottom: 8,
	},
	paragraph: {
		marginBottom: 8,
		textAlign: 'justify',
	},
	listItem: {
		flexDirection: 'row',
		marginBottom: 4,
		paddingLeft: 15,
	},
	bullet: {
		width: 15,
		fontWeight: 'bold',
	},
	bold: {
		fontWeight: 'bold',
		color: '#0f172a',
	},
	table: {
		marginTop: 10,
		marginBottom: 15,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 4,
		overflow: 'hidden',
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
		minHeight: 25,
		alignItems: 'center',
	},
	tableHeader: {
		backgroundColor: '#f1f5f9',
		fontWeight: 'bold',
	},
	tableCell: {
		flex: 1,
		padding: 6,
		fontSize: 9,
	},
	footer: {
		position: 'absolute',
		bottom: 30,
		left: 50,
		right: 50,
		textAlign: 'center',
		color: '#94a3b8',
		fontSize: 8,
		borderTop: 0.5,
		borderTopColor: '#e2e8f0',
		paddingTop: 10,
	},
	notesSection: {
		marginTop: 10,
		padding: 10,
		backgroundColor: '#fffbeb',
		borderLeft: 4,
		borderLeftColor: '#f59e0b',
		fontSize: 9,
	},
})

interface EstimatePDFProps {
	content: string
	projectInfo: {
		techStack: string
		scope: string
		type: string
		notes?: string
		existingContext?: string
	}
}

export const EstimatePDF = ({ content, projectInfo }: EstimatePDFProps) => {
	const lines = content.split('\n')

	// Helper per gestire il grassetto inline **text**
	const renderTextWithBold = (text: string) => {
		const parts = text.split(/(\*\*.*?\*\*)/g)
		return parts.map((part, i) => {
			if (part.startsWith('**') && part.endsWith('**')) {
				return (
					<Text key={i} style={styles.bold}>
						{part.slice(2, -2)}
					</Text>
				)
			}
			return part
		})
	}

	// Helper per rilevare se una riga è parte di una tabella markdown
	const isTableRow = (line: string) =>
		line.includes('|') && line.trim().startsWith('|')

	const renderTable = (rows: string[]) => {
		const data = rows
			.filter((row) => !row.includes('---')) // Rimuove la riga di separazione |---|
			.map((row) =>
				row
					.split('|')
					.filter((cell) => cell.trim() !== '')
					.map((cell) => cell.trim()),
			)

		return (
			<View style={styles.table}>
				{data.map((row, rowIndex) => (
					<View
						key={rowIndex}
						style={[styles.tableRow, rowIndex === 0 ? styles.tableHeader : {}]}
					>
						{row.map((cell, cellIndex) => (
							<Text key={cellIndex} style={styles.tableCell}>
								{cell}
							</Text>
						))}
					</View>
				))}
			</View>
		)
	}

	const processedBlocks: any[] = []
	let currentTable: string[] = []

	lines.forEach((line, _index) => {
		if (isTableRow(line)) {
			currentTable.push(line)
		} else {
			if (currentTable.length > 0) {
				processedBlocks.push({ type: 'table', data: [...currentTable] })
				currentTable = []
			}
			if (line.trim() !== '') {
				processedBlocks.push({ type: 'line', data: line })
			}
		}
	})

	return (
		<Document title="Stima Progetto Software">
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<Text style={styles.mainTitle}>Documento di Stima Tecnica</Text>
					<View style={styles.metaContainer}>
						<Text style={styles.metaItem}>
							<Text style={styles.bold}>TIPO: </Text>
							{projectInfo.type === 'new' ? 'Nuovo Progetto' : 'Evolutivo'}
						</Text>
						<Text style={styles.metaItem}>
							<Text style={styles.bold}>AMBITO: </Text>
							{projectInfo.scope}
						</Text>
						<Text style={styles.metaItem}>
							<Text style={styles.bold}>DATA: </Text>
							{new Date().toLocaleDateString('it-IT')}
						</Text>
					</View>
					<Text style={{ marginTop: 10, fontSize: 10 }}>
						<Text style={styles.bold}>STACK: </Text>
						{projectInfo.techStack}
					</Text>
				</View>

				{(projectInfo.notes || projectInfo.existingContext) && (
					<View style={styles.notesSection}>
						{projectInfo.existingContext && (
							<Text style={{ marginBottom: 4 }}>
								<Text style={styles.bold}>Contesto Esistente: </Text>
								{projectInfo.existingContext}
							</Text>
						)}
						{projectInfo.notes && (
							<Text>
								<Text style={styles.bold}>Note Originali: </Text>
								{projectInfo.notes}
							</Text>
						)}
					</View>
				)}

				<View style={{ marginTop: 10 }}>
					{processedBlocks.map((block, i) => {
						if (block.type === 'table') {
							return renderTable(block.data)
						}

						const line = block.data
						if (line.startsWith('# ')) {
							return (
								<Text key={i} style={styles.h1}>
									{line.replace('# ', '')}
								</Text>
							)
						}
						if (line.startsWith('## ')) {
							return (
								<Text key={i} style={styles.h2}>
									{line.replace('## ', '')}
								</Text>
							)
						}
						if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
							return (
								<View key={i} style={styles.listItem}>
									<Text style={styles.bullet}>•</Text>
									<Text style={{ flex: 1 }}>
										{renderTextWithBold(line.trim().substring(2))}
									</Text>
								</View>
							)
						}

						return (
							<Text key={i} style={styles.paragraph}>
								{renderTextWithBold(line)}
							</Text>
						)
					})}
				</View>

				<Text
					style={styles.footer}
					render={({ pageNumber, totalPages }) =>
						`Pagina ${pageNumber} di ${totalPages}  |  AI Project Estimator  |  Generated on ${new Date().toLocaleDateString()}`
					}
					fixed
				/>
			</Page>
		</Document>
	)
}
