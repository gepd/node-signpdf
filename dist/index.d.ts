export * from "./signpdf";
import { SignPdf, SignPdfError } from "./signpdf";
declare const defaultExport: {
    DEFAULT_SIGNATURE_LENGTH: number;
    DEFAULT_BYTE_RANGE_PLACEHOLDER: string;
    SUBFILTER_ADOBE_PKCS7_DETACHED: string;
    SUBFILTER_ADOBE_PKCS7_SHA1: string;
    SUBFILTER_ADOBE_X509_SHA1: string;
    SUBFILTER_ETSI_CADES_DETACHED: string;
    SIG_FLAGS: {
        SIGNATURES_EXIST: number;
        APPEND_ONLY: number;
    };
    ANNOTATION_FLAGS: {
        INVISIBLE: number;
        HIDDEN: number;
        PRINT: number;
        NO_ZOOM: number;
        NO_ROTATE: number;
        NO_VIEW: number;
        READ_ONLY: number;
    };
    SignPdf: typeof SignPdf;
    SignPdfError: typeof SignPdfError;
};
export default defaultExport;
//# sourceMappingURL=index.d.ts.map