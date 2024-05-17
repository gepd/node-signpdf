export { default as SignPdfError } from "./SignPdfError";
export * from "./helpers";
export * from "./helpers/const";
export class SignPdf {
    static preparePdfForSigning(pdfBuffer: any): {
        pdf: Buffer;
        placeholderLength: number;
        byteRange1: number;
    };
    byteRangePlaceholder: string;
    lastSignature: string;
    sign(pdfBuffer: any, gobSignature?: any, phlength?: number, bRange?: any): Buffer;
}
declare const _default: SignPdf;
export default _default;
//# sourceMappingURL=signpdf.d.ts.map