"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignPdf = exports.SignPdfError = exports.Signer = void 0;
var convertBuffer_1 = require("./convertBuffer");
var removeTrailingNewLine_1 = require("./removeTrailingNewLine");
var findByteRange_1 = require("./findByteRange");
var SignPdfError_1 = require("./SignPdfError");
Object.defineProperty(exports, "SignPdfError", { enumerable: true, get: function () { return SignPdfError_1.SignPdfError; } });
var Signer_1 = require("./Signer");
Object.defineProperty(exports, "Signer", { enumerable: true, get: function () { return Signer_1.Signer; } });
/**
 * @typedef {object} SignerOptions
 * @prop {string} [passphrase]
 * @prop {boolean} [asn1StrictParsing]
 */
var SignPdf = /** @class */ (function () {
    function SignPdf() {
        this.lastSignature = null;
    }
    /**
   * @param {Buffer | Uint8Array | string} pdfBuffer
   * @param {Boolean} forhash
   * @param {ArrayBufferLike} signature
   * @param {number} phlength
   * @param {number} bRange
   */
    SignPdf.prototype.sign = function (pdfBuffer, forhash, signature, phlength, bRange) {
        if (signature === void 0) { signature = null; }
        if (phlength === void 0) { phlength = 0; }
        if (bRange === void 0) { bRange = null; }
        if (forhash) {
            if (!(pdfBuffer instanceof Buffer)) {
                throw new SignPdfError_1.SignPdfError('PDF expected as Buffer.', SignPdfError_1.SignPdfError.TYPE_INPUT);
            }
            var pdf_1 = (0, removeTrailingNewLine_1.removeTrailingNewLine)((0, convertBuffer_1.convertBuffer)(pdfBuffer, 'PDF'));
            // Find the ByteRange placeholder.
            var _a = (0, findByteRange_1.findByteRange)(pdf_1), byteRangePlaceholder = _a.byteRangePlaceholder, byteRangePlaceholderPosition = _a.byteRangePlaceholderPosition;
            if (!byteRangePlaceholder) {
                throw new SignPdfError_1.SignPdfError('No ByteRangeStrings found within PDF buffer.', SignPdfError_1.SignPdfError.TYPE_PARSE);
            }
            // Calculate the actual ByteRange that needs to replace the placeholder.
            var byteRangeEnd = byteRangePlaceholderPosition + byteRangePlaceholder.length;
            var contentsTagPos = pdf_1.indexOf('/Contents ', byteRangeEnd);
            var placeholderPos = pdf_1.indexOf('<', contentsTagPos);
            var placeholderEnd = pdf_1.indexOf('>', placeholderPos);
            var placeholderLengthWithBrackets = placeholderEnd + 1 - placeholderPos;
            var placeholderLength = placeholderLengthWithBrackets - 2;
            var byteRange = [0, 0, 0, 0];
            byteRange[1] = placeholderPos;
            byteRange[2] = byteRange[1] + placeholderLengthWithBrackets;
            byteRange[3] = pdf_1.length - byteRange[2];
            var actualByteRange = "/ByteRange [".concat(byteRange.join(' '), "]");
            actualByteRange += ' '.repeat(byteRangePlaceholder.length - actualByteRange.length);
            // Replace the /ByteRange placeholder with the actual ByteRange
            pdf_1 = Buffer.concat([
                pdf_1.slice(0, byteRangePlaceholderPosition),
                Buffer.from(actualByteRange),
                pdf_1.slice(byteRangeEnd),
            ]);
            // Remove the placeholder signature
            pdf_1 = Buffer.concat([
                pdf_1.slice(0, byteRange[1]),
                pdf_1.slice(byteRange[2], byteRange[2] + byteRange[3]),
            ]);
            return {
                pdf: pdf_1,
                placeholderLength: placeholderLength,
                byteRange1: byteRange[1],
            };
        }
        var pdf = pdfBuffer;
        var internalSignature = Buffer.from(signature).toString('hex'); // Store the HEXified signature. At least useful in tests.
        this.lastSignature = internalSignature;
        // Pad the signature with zeroes so the it is the same length as the placeholder
        internalSignature += Buffer.from(String.fromCharCode(0).repeat((phlength - internalSignature.length) / 2)).toString('hex');
        // Place it in the document.
        pdf = Buffer.concat([
            pdf.slice(0, bRange),
            Buffer.from("<".concat(internalSignature, ">")),
            pdf.slice(bRange),
        ]); // Magic. Done.
        return pdf;
    };
    return SignPdf;
}());
exports.SignPdf = SignPdf;
exports.default = new SignPdf();
