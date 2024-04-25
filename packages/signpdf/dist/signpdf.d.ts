/**
 * @typedef {object} SignerOptions
 * @prop {string} [passphrase]
 * @prop {boolean} [asn1StrictParsing]
 */
export class SignPdf {
    lastSignature: string;
    /**
   * @param {Buffer | Uint8Array | string} pdfBuffer
   * @param {Boolean} forhash
   * @param {ArrayBufferLike} signature
   * @param {number} phlength
   * @param {number} bRange
   */
    sign(pdfBuffer: Buffer | Uint8Array | string, forhash: boolean, signature?: ArrayBufferLike, phlength?: number, bRange?: number): Promise<Uint8Array | Buffer | {
        pdf: Buffer;
        placeholderLength: number;
        byteRange1: number;
    }>;
}
declare const _default: SignPdf;
export default _default;
export type SignerOptions = {
    passphrase?: string;
    asn1StrictParsing?: boolean;
};
import { Signer } from './index';
import { SignPdfError } from './index';
export { Signer, SignPdfError };
//# sourceMappingURL=signpdf.d.ts.map