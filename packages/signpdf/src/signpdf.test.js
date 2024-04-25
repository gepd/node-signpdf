import {
    Signer,
    SignPdfError,
} from '@signpdf/utils';
import signpdf from './signpdf';

describe('Test signing', () => {
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
