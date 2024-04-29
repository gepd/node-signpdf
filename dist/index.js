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
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./const"), exports);
__exportStar(require("./signpdf"), exports);
var signpdf_1 = require("./signpdf");
var const_1 = require("./const");
var defaultExport = {
    DEFAULT_SIGNATURE_LENGTH: const_1.DEFAULT_SIGNATURE_LENGTH,
    DEFAULT_BYTE_RANGE_PLACEHOLDER: const_1.DEFAULT_BYTE_RANGE_PLACEHOLDER,
    SUBFILTER_ADOBE_PKCS7_DETACHED: const_1.SUBFILTER_ADOBE_PKCS7_DETACHED,
    SUBFILTER_ADOBE_PKCS7_SHA1: const_1.SUBFILTER_ADOBE_PKCS7_SHA1,
    SUBFILTER_ADOBE_X509_SHA1: const_1.SUBFILTER_ADOBE_X509_SHA1,
    SUBFILTER_ETSI_CADES_DETACHED: const_1.SUBFILTER_ETSI_CADES_DETACHED,
    SIG_FLAGS: const_1.SIG_FLAGS,
    ANNOTATION_FLAGS: const_1.ANNOTATION_FLAGS,
    SignPdf: signpdf_1.SignPdf,
    SignPdfError: signpdf_1.SignPdfError,
    Signer: signpdf_1.Signer,
};
exports.default = defaultExport;
