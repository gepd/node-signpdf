"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTrailingNewLine = void 0;
var SignPdfError_1 = require("./SignPdfError");
/**
 * Removes a trailing character if it is the one passed as the second parameter.
 * @param {Buffer} pdf
 * @param {string} character
 * @returns {Buffer}
 */
var sliceLastChar = function (pdf, character) {
    var lastChar = pdf.subarray(pdf.length - 1).toString();
    if (lastChar === character) {
        return pdf.subarray(0, pdf.length - 1);
    }
    return pdf;
};
/**
 * Removes a trailing new line if there is such.
 *
 * Also makes sure the file ends with an EOF line as per spec.
 * @param {Buffer} pdf
 * @returns {Buffer}
 */
var removeTrailingNewLine = function (pdf) {
    if (!(pdf instanceof Buffer)) {
        throw new SignPdfError_1.SignPdfError('PDF expected as Buffer.', SignPdfError_1.SignPdfError.TYPE_INPUT);
    }
    var output = pdf;
    output = sliceLastChar(output, '\n');
    output = sliceLastChar(output, '\r');
    var lastLine = output.subarray(output.length - 6).toString();
    if (lastLine !== '\n%%EOF' && lastLine !== '\r%%EOF') {
        throw new SignPdfError_1.SignPdfError('A PDF file must end with an EOF line.', SignPdfError_1.SignPdfError.TYPE_PARSE);
    }
    return output;
};
exports.removeTrailingNewLine = removeTrailingNewLine;
