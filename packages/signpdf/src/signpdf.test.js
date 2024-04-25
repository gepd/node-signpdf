import {
    Signer,
    SignPdfError,
} from '@signpdf/utils';
import signpdf from './signpdf';

describe('Test signing', () => {
    it('expects P12 signer to be Buffer', async () => {
        try {
            await signpdf.sign(Buffer.from(''), 'non-buffer');
            expect('here').not.toBe('here');
        } catch (e) {
            expect(e instanceof SignPdfError).toBe(true);
            expect(e.type).toBe(SignPdfError.TYPE_INPUT);
            expect(e.message).toMatchInlineSnapshot('"Signer implementation expected."');
        }

        try {
            await signpdf.sign(Buffer.from(''), {});
            expect('here').not.toBe('here');
        } catch (e) {
            expect(e instanceof SignPdfError).toBe(true);
            expect(e.type).toBe(SignPdfError.TYPE_INPUT);
            expect(e.message).toMatchInlineSnapshot('"Signer implementation expected."');
        }
    });
    it('expects PDF to contain a ByteRange placeholder', async () => {
        try {
            await signpdf.sign(Buffer.from('No BR placeholder\n%%EOF'), new Signer());
            expect('here').not.toBe('here');
        } catch (e) {
            expect(e instanceof SignPdfError).toBe(true);
            expect(e.type).toBe(SignPdfError.TYPE_PARSE);
            expect(e.message).toMatchInlineSnapshot('"No ByteRangeStrings found within PDF buffer."');
        }
    });
});
