"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SignPdf: true,
  SignPdfError: true
};
exports.SignPdf = void 0;
Object.defineProperty(exports, "SignPdfError", {
  enumerable: true,
  get: function () {
    return _SignPdfError.default;
  }
});
exports.default = void 0;

var _SignPdfError = _interopRequireDefault(require("./SignPdfError"));

var _helpers = require("./helpers");

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});

var _const = require("./helpers/const");

Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SignPdf {
  constructor() {
    this.byteRangePlaceholder = _const.DEFAULT_BYTE_RANGE_PLACEHOLDER;
    this.lastSignature = null;
  }

  static preparePdfForSigning(pdfBuffer) {
    if (!(pdfBuffer instanceof Buffer)) {
      throw new _SignPdfError.default("PDF expected as Buffer.", _SignPdfError.default.TYPE_INPUT);
    }

    let pdf = (0, _helpers.removeTrailingNewLine)(pdfBuffer); // Find the ByteRange placeholder.

    const {
      byteRangePlaceholder
    } = (0, _helpers.findByteRange)(pdf);

    if (!byteRangePlaceholder) {
      throw new _SignPdfError.default(`Could not find empty ByteRange placeholder: ${byteRangePlaceholder}`, _SignPdfError.default.TYPE_PARSE);
    }

    const byteRangePos = pdf.indexOf(byteRangePlaceholder); // Calculate the actual ByteRange that needs to replace the placeholder.

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
    actualByteRange += " ".repeat(byteRangePlaceholder.length - actualByteRange.length); // Replace the /ByteRange placeholder with the actual ByteRange

    pdf = Buffer.concat([pdf.slice(0, byteRangePos), Buffer.from(actualByteRange), pdf.slice(byteRangeEnd)]); // Remove the placeholder signature

    pdf = Buffer.concat([pdf.slice(0, byteRange[1]), pdf.slice(byteRange[2], byteRange[2] + byteRange[3])]);
    return {
      pdf,
      placeholderLength,
      byteRange1: byteRange[1]
    };
  }

  sign(pdfBuffer, gobSignature = null, phlength = 0, bRange = null) {
    if (!(pdfBuffer instanceof Buffer)) {
      throw new _SignPdfError.default("PDF expected as Buffer.", _SignPdfError.default.TYPE_INPUT);
    }

    let pdf = pdfBuffer;
    let signature = Buffer.from(gobSignature).toString("hex"); // Store the HEXified signature. At least useful in tests.

    this.lastSignature = signature; // Pad the signature with zeroes so the it is the same length as the placeholder

    signature += Buffer.from(String.fromCharCode(0).repeat((phlength - signature.length) / 2)).toString("hex"); // Place it in the document.

    pdf = Buffer.concat([pdf.slice(0, bRange), Buffer.from(`<${signature}>`), pdf.slice(bRange)]); // Magic. Done.

    return pdf;
  }

}

exports.SignPdf = SignPdf;

var _default = new SignPdf();

exports.default = _default;