"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignPdf = exports.SignPdfError = exports.Signer = void 0;
var convertBuffer_1 = require("./convertBuffer");
var removeTrailingNewLine_1 = require("./removeTrailingNewLine");
var findByteRange_1 = require("./findByteRange");
var SignPdfError_1 = require("./SignPdfError");
Object.defineProperty(exports, "SignPdfError", { enumerable: true, get: function () { return SignPdfError_1.SignPdfError; } });
var Signer_1 = require("./Signer");
Object.defineProperty(exports, "Signer", { enumerable: true, get: function () { return Signer_1.Signer; } });
__exportStar(require("./const"), exports);
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
        return __awaiter(this, void 0, void 0, function () {
            var pdf_1, _a, byteRangePlaceholder, byteRangePlaceholderPosition, byteRangeEnd, contentsTagPos, placeholderPos, placeholderEnd, placeholderLengthWithBrackets, placeholderLength, byteRange, actualByteRange, pdf, internalSignature;
            return __generator(this, function (_b) {
                if (forhash) {
                    if (!(pdfBuffer instanceof Buffer)) {
                        throw new SignPdfError_1.SignPdfError('PDF expected as Buffer.', SignPdfError_1.SignPdfError.TYPE_INPUT);
                    }
                    pdf_1 = (0, removeTrailingNewLine_1.removeTrailingNewLine)((0, convertBuffer_1.convertBuffer)(pdfBuffer, 'PDF'));
                    _a = (0, findByteRange_1.findByteRange)(pdf_1), byteRangePlaceholder = _a.byteRangePlaceholder, byteRangePlaceholderPosition = _a.byteRangePlaceholderPosition;
                    if (!byteRangePlaceholder) {
                        throw new SignPdfError_1.SignPdfError('No ByteRangeStrings found within PDF buffer.', SignPdfError_1.SignPdfError.TYPE_PARSE);
                    }
                    byteRangeEnd = byteRangePlaceholderPosition + byteRangePlaceholder.length;
                    contentsTagPos = pdf_1.indexOf('/Contents ', byteRangeEnd);
                    placeholderPos = pdf_1.indexOf('<', contentsTagPos);
                    placeholderEnd = pdf_1.indexOf('>', placeholderPos);
                    placeholderLengthWithBrackets = placeholderEnd + 1 - placeholderPos;
                    placeholderLength = placeholderLengthWithBrackets - 2;
                    byteRange = [0, 0, 0, 0];
                    byteRange[1] = placeholderPos;
                    byteRange[2] = byteRange[1] + placeholderLengthWithBrackets;
                    byteRange[3] = pdf_1.length - byteRange[2];
                    actualByteRange = "/ByteRange [".concat(byteRange.join(' '), "]");
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
                    return [2 /*return*/, {
                            pdf: pdf_1,
                            placeholderLength: placeholderLength,
                            byteRange1: byteRange[1],
                        }];
                }
                pdf = pdfBuffer;
                internalSignature = Buffer.from(signature).toString('hex');
                this.lastSignature = internalSignature;
                // Pad the signature with zeroes so the it is the same length as the placeholder
                internalSignature += Buffer.from(String.fromCharCode(0).repeat((phlength - internalSignature.length) / 2)).toString('hex');
                // Place it in the document.
                pdf = Buffer.concat([
                    pdf.slice(0, bRange),
                    Buffer.from("<".concat(internalSignature, ">")),
                    pdf.slice(bRange),
                ]); // Magic. Done.
                return [2 /*return*/, pdf];
            });
        });
    };
    return SignPdf;
}());
exports.SignPdf = SignPdf;
exports.default = new SignPdf();
