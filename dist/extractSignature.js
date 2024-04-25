"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSignature = void 0;
var SignPdfError_1 = require("./SignPdfError");
var getSubstringIndex = function (str, substring, n) {
    var times = 0;
    var index = null;
    while (times < n && index !== -1) {
        index = str.indexOf(substring, index + 1);
        times += 1;
    }
    return index;
};
/**
 * Basic implementation of signature extraction.
 *
 * Really basic. Would work in the simplest of cases where there is only one signature
 * in a document and ByteRange is only used once in it.
 *
 * @param {Buffer} pdf
 * @returns {Object} {ByteRange: Number[], signature: Buffer, signedData: Buffer}
 */
var extractSignature = function (pdf, signatureCount) {
    if (signatureCount === void 0) { signatureCount = 1; }
    if (!(pdf instanceof Buffer)) {
        throw new SignPdfError_1.SignPdfError('PDF expected as Buffer.', SignPdfError_1.SignPdfError.TYPE_INPUT);
    }
    // const byteRangePos = pdf.indexOf('/ByteRange [');
    var byteRangePos = getSubstringIndex(pdf, '/ByteRange [', signatureCount);
    if (byteRangePos === -1) {
        throw new SignPdfError_1.SignPdfError('Failed to locate ByteRange.', SignPdfError_1.SignPdfError.TYPE_PARSE);
    }
    var byteRangeEnd = pdf.indexOf(']', byteRangePos);
    if (byteRangeEnd === -1) {
        throw new SignPdfError_1.SignPdfError('Failed to locate the end of the ByteRange.', SignPdfError_1.SignPdfError.TYPE_PARSE);
    }
    var byteRange = pdf.slice(byteRangePos, byteRangeEnd + 1).toString();
    var matches = (/\/ByteRange \[(\d+) +(\d+) +(\d+) +(\d+) *\]/).exec(byteRange);
    if (matches === null) {
        throw new SignPdfError_1.SignPdfError('Failed to parse the ByteRange.', SignPdfError_1.SignPdfError.TYPE_PARSE);
    }
    var ByteRange = matches.slice(1).map(Number);
    var signedData = Buffer.concat([
        pdf.slice(ByteRange[0], ByteRange[0] + ByteRange[1]),
        pdf.slice(ByteRange[2], ByteRange[2] + ByteRange[3]),
    ]);
    var signatureHex = pdf.slice(ByteRange[0] + ByteRange[1] + 1, ByteRange[2])
        .toString('binary')
        .replace(/(?:00|>)+$/, '');
    var signature = Buffer.from(signatureHex, 'hex').toString('binary');
    return {
        ByteRange: matches.slice(1, 5).map(Number),
        signature: signature,
        signedData: signedData,
    };
};
exports.extractSignature = extractSignature;
