"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByteRange = void 0;
var SignPdfError_1 = require("./SignPdfError");
var const_1 = require("./const");
/**
* @typedef {object} OutputType
* @property {string | undefined} byteRangePlaceholder
* @property {number | undefined} byteRangePlaceholderPosition
* @property {string[]} byteRangeStrings
* @property {string[]} byteRange
*/
/**
 * Finds ByteRange information within a given PDF Buffer if one exists
 *
 * @param {Buffer} pdf
 * @returns {OutputType}
 */
var findByteRange = function (pdf, placeholder) {
    if (placeholder === void 0) { placeholder = const_1.DEFAULT_BYTE_RANGE_PLACEHOLDER; }
    if (!(pdf instanceof Buffer)) {
        throw new SignPdfError_1.SignPdfError('PDF expected as Buffer.', SignPdfError_1.SignPdfError.TYPE_INPUT);
    }
    var byteRangePlaceholder;
    var byteRangePlaceholderPosition;
    var byteRangeStrings = [];
    var byteRanges = [];
    var offset = 0;
    do {
        var position = pdf.indexOf('/ByteRange', offset);
        if (position === -1) {
            break;
        }
        var rangeStart = pdf.indexOf('[', position);
        var rangeEnd = pdf.indexOf(']', rangeStart);
        var byteRangeString = pdf.subarray(position, rangeEnd + 1);
        byteRangeStrings.push(byteRangeString.toString());
        var range = pdf.subarray(rangeStart + 1, rangeEnd)
            .toString()
            .split(' ')
            .filter(function (c) { return c !== ''; })
            .map(function (c) { return c.trim(); });
        byteRanges.push(range);
        var placeholderName = "/".concat(placeholder);
        if (range[0] === '0' && range[1] === placeholderName && range[2] === placeholderName && range[3] === placeholderName) {
            if (typeof byteRangePlaceholder !== 'undefined') {
                throw new SignPdfError_1.SignPdfError('Found multiple ByteRange placeholders.', SignPdfError_1.SignPdfError.TYPE_INPUT);
            }
            byteRangePlaceholder = byteRangeString.toString();
            byteRangePlaceholderPosition = position;
        }
        offset = rangeEnd;
        // eslint-disable-next-line no-constant-condition
    } while (true);
    return {
        byteRangePlaceholder: byteRangePlaceholder,
        byteRangePlaceholderPosition: byteRangePlaceholderPosition,
        byteRangeStrings: byteRangeStrings,
        byteRanges: byteRanges,
    };
};
exports.findByteRange = findByteRange;
