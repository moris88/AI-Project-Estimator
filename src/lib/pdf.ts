import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerSrc;

export const MAX_REFERENCE_PDFS = 5;
export const MAX_REFERENCE_PDF_SIZE = 10 * 1024 * 1024;

export async function extractPdfText(file: File): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new Error(`${file.name} non è un file PDF valido`);
  }

  if (file.size > MAX_REFERENCE_PDF_SIZE) {
    throw new Error(`${file.name} supera il limite di 10 MB`);
  }

  const data = await file.arrayBuffer();
  const pdf = await getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .trim();

    if (pageText) pages.push(`Pagina ${pageNumber}\n${pageText}`);
  }

  return pages.join("\n\n");
}
