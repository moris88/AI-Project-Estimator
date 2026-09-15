export function createPrompt(
	techStack: string,
	scope: 'Frontend' | 'Backend' | 'Full-stack',
	experienceLevel: 'beginner' | 'experienced' | 'intermediate',
	testingPercentage: number,
	bufferPercentage: number,
	changeRequestPercentage: number,
	requirements: string,
	notes: string,
	isExistingProject: boolean,
	existingContext: string,
	previousEstimates: string,
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

Esperienza del Team:
- Se il team è composto da sviluppatori con esperienza "beginner", applica un coefficiente di complessità del 20% in più rispetto alle stime standard.
- Se il team è composto da sviluppatori con esperienza "experienced", applica un coefficiente di complessità del 10% in meno rispetto alle stime standard.
- Se il team è composto da sviluppatori con esperienza "intermediate", applica un coefficiente di complessità standard senza modifiche.
Attualmente il team è composto da sviluppatori con esperienza "${experienceLevel}".

Calcolo delle Ore:
Analizza i requisiti forniti e scomponili in task tecnici specifici.
Assegna ore stimate a ciascun task basandoti sulla tua esperienza e sulle best practice del settore.
Se il calcolo dei singoli task risulta inferiore alla soglia minima individuata, distribuisci le ore mancanti proporzionalmente.
Restituisci sempre le ore in numeri interi arrotondando per difetto, inoltre diminuisci del 20% perchè ci sarà un margine di ottimizzazione tramite l'uso di strumenti AI che velocizza il lavoro e lo sviluppo.

Vincoli Temporali Mandatori:
- Setup Progetto: Massimo 1 ora (per progetti esistenti, consideralo come tempo di allineamento/analisi ambiente).
- Deploy & Supporto Finale: Massimo 1 ora.
- Testing: Massimo ${testingPercentage}% del totale ore (per progetti esistenti, assicurati che copra i test di regressione).
- Buffer Imprevisti: Aggiungi un buffer del ${bufferPercentage}% sul totale ore.
- Aggiungi un ${changeRequestPercentage}% di ore per eventuali richieste di modifica.
- Riduci le ore del 40% per tenere conto dell'ottimizzazione tramite strumenti AI.

Istruzioni di Output:
Genera DUE SEZIONI distinte. Dopo la prima sezione inserisci una riga contenente ESATTAMENTE
---SEPARATOR---
Non modificare il separatore, non racchiuderlo in un blocco di codice e non aggiungere testo sulla stessa riga.
Entrambe le sezioni devono essere scritte RIGOROSAMENTE in Markdown valido e devono mantenere la
formattazione Markdown in ogni parte del documento. Usa titoli Markdown con #, elenchi con -,
elenchi numerati e tabelle Markdown con | quando appropriato. Non restituire JSON, HTML o testo
senza formattazione e non racchiudere le sezioni intere in blocchi di codice Markdown.

Lo stile del Markdown deve essere moderno, ordinato e piacevole da leggere anche per un utente non
tecnico. Evita muri di testo: usa paragrafi brevi, titoli e sottotitoli descrittivi, spazio tra le
sezioni, elenchi puntati per i concetti principali e grassetto solo per evidenziare le informazioni
importanti. Usa tabelle compatte e leggibili per ore, giornate e riepiloghi; mantieni le colonne
coerenti e inserisci sempre una riga di intestazione. Organizza ogni sprint in blocchi facilmente
scansionabili con obiettivo, attività e risultato atteso. Non usare emoji, colori tramite HTML,
decorazioni eccessive o formattazioni decorative che non siano Markdown standard. Inserisci una
riga vuota tra ogni titolo, paragrafo, elenco, tabella e blocco di contenuto per migliorare la
leggibilità. Non mettere più contenuti diversi nello stesso paragrafo.

SEZIONE 1 (Stima):
# Stima del Progetto
Documento in formato Markdown con questa struttura:
- Obiettivo del Progetto
- Classificazione Progetto (Specifica se Nuovo o Evolutivo)
- Funzionalità Principali
- Stima Effort (Tabella): Elenco task, Buffer (20%), Totale Ore e Giornate.
- Vincoli e Assunzioni
- Criticità e Rischi

SEZIONE 2 (Pianificazione settimanale):
# Pianificazione Settimanale
Crea una roadmap operativa dell'implementazione organizzata per settimane consecutive. Non limitarti
a elencare gli sprint e non usare attività generiche come "sviluppo feature" o "implementazione":
ogni attività deve spiegare concretamente cosa viene fatto.

Regole obbligatorie per la pianificazione:
- Considera una settimana lavorativa di 5 giorni e 40 ore, salvo diversa indicazione nei requisiti.
- Distribuisci le ore e le attività in modo coerente con la stima della prima sezione; non inventare
  ore scollegate dal totale stimato.
- Indica per ogni settimana l'obiettivo principale, le attività e il risultato verificabile alla fine.
- Dividi ogni attività complessa in sotto-attività operative e dettagliate.
- Per ogni attività specifica: cosa viene realizzato, quali passaggi comprende, quante ore richiede,
  da cosa dipende e come si verifica che sia completata.
- Indica chiaramente le attività di analisi, configurazione, sviluppo, collegamento con servizi esterni,
  gestione degli errori, test, correzioni, pubblicazione e supporto finale quando pertinenti.
- Evidenzia le dipendenze tra attività e indica il percorso critico, cioè le attività che possono
  ritardare l'intero progetto.
- Inserisci una tabella iniziale con: Settimana, Obiettivo, Attività principali, Ore previste,
  Risultato atteso.
- Dopo la tabella, crea una sezione dettagliata per ogni settimana. Usa questo schema:
  - Obiettivo della settimana
  - Attività numerate con sotto-attività, ore, dipendenze e criterio di completamento
  - Risultato verificabile della settimana
  - Rischi o punti di attenzione, solo se presenti
- Concludi con una breve sezione "Mappa delle dipendenze" e una sezione "Percorso critico".
- Mantieni una riga vuota tra settimana, attività e sotto-attività per rendere il documento leggibile.

Non inserire alcuna spiegazione o testo al di fuori dei documenti Markdown e nessuna intestazione. Non menzionare mai le soglie minime o i vincoli nei documenti, ma assicurati che siano rispettati nella stima finale. No conclusioni o raccomandazioni, solo la stima e la pianificazione degli sprint.

Dati del Progetto:
${requirements}

${notes ? `Note Aggiuntive:\n${notes}` : ''}
${previousEstimates ? `\nSTIME DI PROGETTI PRECEDENTI (usale come riferimento, non copiarle):\n${previousEstimates}` : ''}
`
}
