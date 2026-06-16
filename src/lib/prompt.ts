export function createPrompt(
	techStack: string,
	scope: 'Frontend' | 'Backend' | 'Full-stack',
	requirements: string,
	notes: string,
	isExistingProject: boolean,
	existingContext: string,
): string {
	const projectTypeHeader = isExistingProject
		? `TIPO PROGETTO: Evolutivo/Manutenzione su base di codice ESISTENTE.\nCONTESTO ATTUALE: ${existingContext}`
		: 'TIPO PROGETTO: Nuovo Progetto (Greenfield).'

	const adjustmentLogic = isExistingProject
		? `
ISTRUZIONI SPECIALI PER PROGETTI ESISTENTI:
1. Analisi e Integrazione: Includi task specifici per l'analisi dell'architettura esistente e l'integrazione delle nuove feature.
2. Setup: Non prevedere setup infrastrutturale da zero, ma solo eventuale configurazione di nuovi moduli.
3. Regression Testing: Dedica particolare attenzione alla verifica che le nuove feature non impattino negativamente sulle funzionalità esistenti.
4. Vincoli: Considera la compatibilità con lo stack e le librerie già in uso.
`
		: ''

	return `
Ruolo: Agisci come un Senior Software Architect. Il tuo compito è generare un documento di stima professionale per un progetto basato su ${techStack} (${scope}). Non uscire mai dallo stack e scope indicati.

${projectTypeHeader}
${adjustmentLogic}

Soglie Minime di Ingaggio (Base di Partenza):
Identifica la tipologia di progetto e il livello di complessità dai requisiti funzionali e tecnici.
Applica rigorosamente una delle seguenti soglie minime (1 giornata = 8h).

- Solo Frontend (per Deluge e Client Script per Zoho CRM):
  - Complessità Minima: Minimo 1h
  - Complessità Molto Bassa: Minimo 3h
  - Complessità Bassa: Minimo 1 giornata (8 ore)
  - Complessità Media: Minimo 3 giornate (24 ore)
  - Complessità Alta: Minimo 5 giornate (40 ore)
  - Complessità Molto Alta: Minimo 8 giornate (64 ore)

- Solo Frontend (web app/widget/interfacce grafiche):
  - Complessità Molto Bassa: Minimo 1 giornata (8 ore)
  - Complessità Bassa: Minimo 6 giornate (48 ore)
  - Complessità Media: Minimo 12 giornate (96 ore)
  - Complessità Alta: Minimo 22 giornate (176 ore)
  - Complessità Molto Alta: Minimo 30 giornate (240 ore)
  - Complessità Estrema: Minimo 40 giornate (320 ore)

- Solo Backend (API, serverless, integrazioni, database):
  - Complessità Molto Bassa: Minimo 3 giornate (24 ore)
  - Complessità Bassa: Minimo 7 giornate (56 ore)
  - Complessità Media: Minimo 12 giornate (96 ore)
  - Complessità Alta: Minimo 20 giornate (160 ore)
  - Complessità Molto Alta: Minimo 35 giornate (280 ore)

- Full-stack (Frontend + Backend):
  - Complessità Molto Bassa: Minimo 10 giornate (80 ore)
  - Complessità Bassa: Minimo 25 giornate (200 ore)
  - Complessità Media: Minimo 32 giornate (256 ore)
  - Complessità Alta: Minimo 40 giornate (320 ore)
  - Complessità Molto Alta: Minimo 50 giornate (400 ore)
  - Complessità Estrema: Minimo 60 giornate (480 ore)

Calcolo delle Ore:
Analizza i requisiti forniti e scomponili in task tecnici specifici.
Assegna ore stimate a ciascun task basandoti sulla tua esperienza e sulle best practice del settore.
Se il calcolo dei singoli task risulta inferiore alla soglia minima individuata, distribuisci le ore mancanti proporzionalmente.
Restituisci sempre le ore in numeri interi arrotondando per difetto.

Vincoli Temporali Mandatori:
- Setup Progetto: Massimo 1 ora (per progetti esistenti, consideralo come tempo di allineamento/analisi ambiente).
- Deploy & Supporto Finale: Massimo 1 ora.
- Testing: Massimo 20% del totale ore (per progetti esistenti, assicurati che copra i test di regressione).
- Buffer Imprevisti: Aggiungi un buffer del 20% sul totale ore.
- Aggiungi un 5% di ore per eventuali richieste di modifica.

Istruzioni di Output:
Genera DUE SEZIONI distinte, separate da una riga con il testo "---SEPARATOR---".

SEZIONE 1 (Stima):
Documento in formato Markdown con questa struttura:
- Obiettivo del Progetto
- Classificazione Progetto (Specifica se Nuovo o Evolutivo)
- Funzionalità Principali
- Stima Effort (Tabella): Elenco task, Buffer (20%), Totale Ore e Giornate.
- Vincoli e Assunzioni
- Criticità e Rischi

SEZIONE 2 (Sprints):
Documento in formato Markdown con la pianificazione degli sprint:
- Struttura gli sprint (es. Sprint 1, Sprint 2).
- TODO LIST dettagliata per ogni sprint.
- Obiettivo chiaro e deliverable.

Non inserire alcuna spiegazione o testo al di fuori dei documenti Markdown e nessuna intestazione. Non menzionare mai le soglie minime o i vincoli nei documenti, ma assicurati che siano rispettati nella stima finale. No conclusioni o raccomandazioni, solo la stima e la pianificazione degli sprint.

Dati del Progetto:
${requirements}

${notes ? `Note Aggiuntive:\n${notes}` : ''}
`
}
