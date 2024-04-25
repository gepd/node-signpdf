import {
    convertBuffer,
    removeTrailingNewLine,
    findByteRange,
    SignPdfError,
    Signer,
} from './index';

export {Signer, SignPdfError};

/**
 * @typedef {object} SignerOptions
 * @prop {string} [passphrase]
 * @prop {boolean} [asn1StrictParsing]
 */

export class SignPdf {
    constructor() {
        this.lastSignature = null;
    }

    /**
   * @param {Buffer | Uint8Array | string} pdfBuffer
   * @param {Boolean} forhash
   * @param {ArrayBufferLike} signature
   * @param {number} phlength
   * @param {number} bRange
   */
    async sign(
        pdfBuffer,
        forhash,
        signature = null,
        phlength = 0,
        bRange = null,
    ) {
        if (forhash) {
            if (!(pdfBuffer instanceof Buffer)) {
                throw new SignPdfError(
                    'PDF expected as Buffer.',
                    SignPdfError.TYPE_INPUT,
                );
            }

            let pdf = removeTrailingNewLine(convertBuffer(pdfBuffer, 'PDF'));

            // Find the ByteRange placeholder.
            const {byteRangePlaceholder, byteRangePlaceholderPosition} = findByteRange(pdf);

            if (!byteRangePlaceholder) {
                throw new SignPdfError(
                    'No ByteRangeStrings found within PDF buffer.',
                    SignPdfError.TYPE_PARSE,
                );
            }

            // Calculate the actual ByteRange that needs to replace the placeholder.
            const byteRangeEnd = byteRangePlaceholderPosition + byteRangePlaceholder.length;
            const contentsTagPos = pdf.indexOf('/Contents ', byteRangeEnd);
            const placeholderPos = pdf.indexOf('<', contentsTagPos);
            const placeholderEnd = pdf.indexOf('>', placeholderPos);
            const placeholderLengthWithBrackets = placeholderEnd + 1 - placeholderPos;
            const placeholderLength = placeholderLengthWithBrackets - 2;
            const byteRange = [0, 0, 0, 0];
            byteRange[1] = placeholderPos;
            byteRange[2] = byteRange[1] + placeholderLengthWithBrackets;
            byteRange[3] = pdf.length - byteRange[2];
            let actualByteRange = `/ByteRange [${byteRange.join(' ')}]`;
            actualByteRange += ' '.repeat(
                byteRangePlaceholder.length - actualByteRange.length,
            );

            // Replace the /ByteRange placeholder with the actual ByteRange
            pdf = Buffer.concat([
                pdf.slice(0, byteRangePlaceholderPosition),
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
        let pdf = pdfBuffer;

        let internalSignature = Buffer.from(signature).toString('hex'); // Store the HEXified signature. At least useful in tests.
        this.lastSignature = internalSignature;

        // Pad the signature with zeroes so the it is the same length as the placeholder
        internalSignature += Buffer.from(
            String.fromCharCode(0).repeat((phlength - internalSignature.length) / 2),
        ).toString('hex');

        // Place it in the document.
        pdf = Buffer.concat([
            pdf.slice(0, bRange),
            Buffer.from(`<${internalSignature}>`),
            pdf.slice(bRange),
        ]); // Magic. Done.

        return pdf;
    }
}

export default new SignPdf();
