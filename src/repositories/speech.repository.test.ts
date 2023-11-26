import dataSource from '../datasource';
import SpeechRepository from './speech.repository';

describe('SpeechRepository', () => {
    beforeAll(async () => {
        await dataSource.initialize();
    });
    afterAll(async () => {
        await dataSource.destroy();
    });

    describe('getSpeakersWithMostSpeeches', () => {
        it('returns speaker with most speeches', async () => {
            const result = await SpeechRepository.getSpeakersWithMostSpeeches(2012);
            expect(result).toBe(null);
        });

        it('returns null when it has no answer', async () => {
            const result = await SpeechRepository.getSpeakersWithMostSpeeches(2013);
            expect(result).toBe(null);
        });

        it('returns null when answer is ambigous', async () => {
            const result = await SpeechRepository.getSpeakersWithMostSpeeches(2014);
            expect(result).toBe(null);
        });
    });
});