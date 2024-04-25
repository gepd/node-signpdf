"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignPdfError = exports.ERROR_VERIFY_SIGNATURE = exports.ERROR_TYPE_PARSE = exports.ERROR_TYPE_INPUT = exports.ERROR_TYPE_UNKNOWN = void 0;
exports.ERROR_TYPE_UNKNOWN = 1;
exports.ERROR_TYPE_INPUT = 2;
exports.ERROR_TYPE_PARSE = 3;
exports.ERROR_VERIFY_SIGNATURE = 4;
var SignPdfError = /** @class */ (function (_super) {
    __extends(SignPdfError, _super);
    function SignPdfError(msg, type) {
        if (type === void 0) { type = exports.ERROR_TYPE_UNKNOWN; }
        var _this = _super.call(this, msg) || this;
        _this.type = type;
        return _this;
    }
    return SignPdfError;
}(Error));
exports.SignPdfError = SignPdfError;
// Shorthand
SignPdfError.TYPE_UNKNOWN = exports.ERROR_TYPE_UNKNOWN;
SignPdfError.TYPE_INPUT = exports.ERROR_TYPE_INPUT;
SignPdfError.TYPE_PARSE = exports.ERROR_TYPE_PARSE;
SignPdfError.VERIFY_SIGNATURE = exports.ERROR_VERIFY_SIGNATURE;
