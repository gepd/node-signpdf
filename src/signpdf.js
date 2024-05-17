import SignPdfError from "./SignPdfError";
import { findByteRange, removeTrailingNewLine } from "./helpers";
import { DEFAULT_BYTE_RANGE_PLACEHOLDER } from "./helpers/const";

export { default as SignPdfError } from "./SignPdfError";
export * from "./helpers";

export * from "./helpers/const";

export class SignPdf {
  constructor() {
    this.byteRangePlaceholder = DEFAULT_BYTE_RANGE_PLACEHOLDER;
    this.lastSignature = null;
  }

  static preparePdfForSigning(pdfBuffer) {
    if (!(pdfBuffer instanceof Buffer)) {
      throw new SignPdfError(
        "PDF expected as Buffer.",
        SignPdfError.TYPE_INPUT
      );
    }

    let pdf = removeTrailingNewLine(pdfBuffer);

    // Find the ByteRange placeholder.
    const { byteRangePlaceholder } = findByteRange(pdf);

    if (!byteRangePlaceholder) {
      throw new SignPdfError(
        `Could not find empty ByteRange placeholder: ${byteRangePlaceholder}`,
        SignPdfError.TYPE_PARSE
      );
    }

    const byteRangePos = pdf.indexOf(byteRangePlaceholder);

    // Calculate the actual ByteRange that needs to replace the placeholder.
    const byteRangeEnd = byteRangePos + byteRangePlaceholder.length;
    const contentsTagPos = pdf.indexOf("/Contents ", byteRangeEnd);
    const placeholderPos = pdf.indexOf("<", contentsTagPos);
    const placeholderEnd = pdf.indexOf(">", placeholderPos);
    const placeholderLengthWithBrackets = placeholderEnd + 1 - placeholderPos;
    const placeholderLength = placeholderLengthWithBrackets - 2;
    const byteRange = [0, 0, 0, 0];
    byteRange[1] = placeholderPos;
    byteRange[2] = byteRange[1] + placeholderLengthWithBrackets;
    byteRange[3] = pdf.length - byteRange[2];
    let actualByteRange = `/ByteRange [${byteRange.join(" ")}]`;
    actualByteRange += " ".repeat(
      byteRangePlaceholder.length - actualByteRange.length
    );

    // Replace the /ByteRange placeholder with the actual ByteRange
    pdf = Buffer.concat([
      pdf.slice(0, byteRangePos),
      Buffer.from(actualByteRange),
      pdf.slice(byteRangeEnd),
    ]);

    // Remove the placeholder signature
    pdf = Buffer.concat([
      pdf.slice(0, byteRange[1]),
      pdf.slice(byteRange[2], byteRange[2] + byteRange[3]),
    ]);

    return {
      pdf,
      placeholderLength,
      byteRange1: byteRange[1],
    };
  }

  sign(pdfBuffer, gobSignature = null, phlength = 0, bRange = null) {
    if (!(pdfBuffer instanceof Buffer)) {
      throw new SignPdfError(
        "PDF expected as Buffer.",
        SignPdfError.TYPE_INPUT
      );
    }

    let pdf = pdfBuffer;
    let signature = Buffer.from(gobSignature).toString("hex");
    // Store the HEXified signature. At least useful in tests.
    this.lastSignature = signature;

    // Pad the signature with zeroes so the it is the same length as the placeholder
    signature += Buffer.from(
      String.fromCharCode(0).repeat((phlength - signature.length) / 2)
    ).toString("hex");

    // Place it in the document.
    pdf = Buffer.concat([
      pdf.slice(0, bRange),
      Buffer.from(`<${signature}>`),
      pdf.slice(bRange),
    ]); // Magic. Done.

    return pdf;
  }
}

export default new SignPdf();
