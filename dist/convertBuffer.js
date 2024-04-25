"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBuffer = void 0;
var SignPdfError_1 = require("./SignPdfError");
/**
 * @param {Buffer | Uint8Array | string} input
 * @param {string} name
 * @returns {Buffer}
 */
function convertBuffer(input, name) {
    if (typeof input === 'string') {
        return Buffer.from(input, 'base64');
    }
    if (input instanceof Buffer || input instanceof Uint8Array) {
        return Buffer.from(input);
    }
    throw new SignPdfError_1.SignPdfError("".concat(name, " expected as Buffer, Uint8Array or base64-encoded string."), SignPdfError_1.SignPdfError.TYPE_INPUT);
}
exports.convertBuffer = convertBuffer;
