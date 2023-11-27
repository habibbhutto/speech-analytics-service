import Speech from '../entities/speech';
import dataSource from '../datasource';
import SpeechRepository from './speech.repository';

jest.mock('../utils/logger');

describe('SpeechRepository', () => {
    beforeAll(async () => {
        await dataSource.initialize();
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    describe('getSpeakersWithMostSpeeches()', () => {
        it('returns speaker with most speeches', async () => {
            const fileUrl = 'https://some/file/url/to/speeches1.csv';
            const speechData = [
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Education Policy',
                    Date: '2012-10-30',
                    Words: 5310
                },
                {
                    Speaker: 'Bernhard Belling',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-05',
                    Words: 1210
                },
                {
                    Speaker: 'Caesare Collins',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-06',
                    Words: 1119,
                },
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Internal Security',
                    Date: '2012-12-11',
                    Words: 1911,
                },
            ];

            await SpeechRepository.delete({file_url: fileUrl});
            for (const s of speechData) {
                const speech = Speech.create(fileUrl, s);
                await SpeechRepository.save(speech);
            }

            const result = await SpeechRepository.getSpeakerWithMostSpeeches([fileUrl], 2012);
            expect(result).toBe('Alexander Abel');

            await SpeechRepository.delete({file_url: fileUrl});

        });

        it('returns null when it has no answer', async () => {
            const fileUrl = 'https://some/file/url/to/speeches2.csv';
            const speechData = [
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Education Policy',
                    Date: '2012-10-30',
                    Words: 5310
                },
                {
                    Speaker: 'Bernhard Belling',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-05',
                    Words: 1210
                },
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Internal Security',
                    Date: '2012-12-11',
                    Words: 1911,
                },
            ];

            await SpeechRepository.delete({file_url: fileUrl});
            for (const s of speechData) {
                const speech = Speech.create(fileUrl, s);
                await SpeechRepository.save(speech);
            }

            const result = await SpeechRepository.getSpeakerWithMostSpeeches([fileUrl], 2013);
            expect(result).toBe(null);

            await SpeechRepository.delete({file_url: fileUrl});
        });

        it('returns null when answer is ambigous', async () => {
            const fileUrl = 'https://some/file/url/to/speeches2.csv';
            const speechData = [
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Education Policy',
                    Date: '2012-10-30',
                    Words: 5310
                },
                {
                    Speaker: 'Bernhard Belling',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-05',
                    Words: 1210
                },
                {
                    Speaker: 'Caesare Collins',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-06',
                    Words: 1119,
                },
            ];

            await SpeechRepository.delete({file_url: fileUrl});
            for (const s of speechData) {
                const speech = Speech.create(fileUrl, s);
                await SpeechRepository.save(speech);
            }

            const result = await SpeechRepository.getSpeakerWithMostSpeeches([fileUrl], 2014);
            expect(result).toBe(null);

            await SpeechRepository.delete({file_url: fileUrl});
        });
    });

    describe('getSpeakerWithMostSecuritySpeeches()', () => {
        it('returns speaker with most security', async () => {
            const fileUrl = 'https://some/file/url/to/security1.csv';
            const speechData = [
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Education Policy',
                    Date: '2012-10-30',
                    Words: 5310
                },
                {
                    Speaker: 'Bernhard Belling',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-05',
                    Words: 1210
                },
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Internal Security',
                    Date: '2012-12-11',
                    Words: 1911,
                },
            ];

            await SpeechRepository.delete({file_url: fileUrl});
            for (const s of speechData) {
                const speech = Speech.create(fileUrl, s);
                await SpeechRepository.save(speech);
            }

            const result = await SpeechRepository.getSpeakerWithMostSecuritySpeeches([fileUrl]);
            expect(result).toBe('Alexander Abel');

            await SpeechRepository.delete({file_url: fileUrl});
        });
        it('returns null when it has no answer', async () => {
            const fileUrl = 'https://some/file/url/to/security2.csv';
            const speechData = [
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Education Policy',
                    Date: '2012-10-30',
                    Words: 5310
                },
                {
                    Speaker: 'Bernhard Belling',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-05',
                    Words: 1210
                },
                {
                    Speaker: 'Caesare Collins',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-06',
                    Words: 1119,
                }
            ];

            await SpeechRepository.delete({file_url: fileUrl});
            for (const s of speechData) {
                const speech = Speech.create(fileUrl, s);
                await SpeechRepository.save(speech);
            }

            const result = await SpeechRepository.getSpeakerWithMostSecuritySpeeches([fileUrl]);
            expect(result).toBe(null);

            await SpeechRepository.delete({file_url: fileUrl});

        });
        it('returns null when answer is ambigous', async () => {
            const fileUrl = 'https://some/file/url/to/security3.csv';
            const speechData = [
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Education Policy',
                    Date: '2012-10-30',
                    Words: 5310
                },
                {
                    Speaker: 'Bernhard Belling',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-05',
                    Words: 1210
                },
                {
                    Speaker: 'Caesare Collins',
                    Topic: 'Internal Security',
                    Date: '2012-11-06',
                    Words: 1119,
                },
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Internal Security',
                    Date: '2012-12-11',
                    Words: 1911,
                },
            ];

            await SpeechRepository.delete({file_url: fileUrl});
            for (const s of speechData) {
                const speech = Speech.create(fileUrl, s);
                await SpeechRepository.save(speech);
            }

            const result = await SpeechRepository.getSpeakerWithMostSecuritySpeeches([fileUrl]);
            expect(result).toBe(null);

            await SpeechRepository.delete({file_url: fileUrl});
        });
    });

    describe('getLeastWordySpeaker()', () => {
        it('returns speaker who is least wordy', async () => {
            const fileUrl = 'https://some/file/url/to/words1.csv';
            const speechData = [
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Education Policy',
                    Date: '2012-10-30',
                    Words: 5310
                },
                {
                    Speaker: 'Bernhard Belling',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-05',
                    Words: 1210
                },
                {
                    Speaker: 'Caesare Collins',
                    Topic: 'Internal Security',
                    Date: '2012-11-06',
                    Words: 1119,
                },
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Internal Security',
                    Date: '2012-12-11',
                    Words: 1911,
                },
            ];

            await SpeechRepository.delete({file_url: fileUrl});
            for (const s of speechData) {
                const speech = Speech.create(fileUrl, s);
                await SpeechRepository.save(speech);
            }

            const result = await SpeechRepository.getLeastWordySpeaker([fileUrl]);
            expect(result).toBe('Caesare Collins');

            await SpeechRepository.delete({file_url: fileUrl});
        });

        it('returns null when it has no answer', async () => {
            const fileUrl = 'https://some/file/url/to/words2.csv';

            const result = await SpeechRepository.getLeastWordySpeaker([fileUrl]);
            expect(result).toBe(null);
        });
        it('returns null when answer is ambigous', async () => {
            const fileUrl = 'https://some/file/url/to/words3.csv';
            const speechData = [
                {
                    Speaker: 'Bernhard Belling',
                    Topic: 'Coal Subsidies',
                    Date: '2012-11-05',
                    Words: 1210,
                },
                {
                    Speaker: 'Caesare Collins',
                    Topic: 'Internal Security',
                    Date: '2012-11-06',
                    Words: 1210,
                },
                {
                    Speaker: 'Alexander Abel',
                    Topic: 'Internal Security',
                    Date: '2012-12-11',
                    Words: 1911,
                },
            ];

            await SpeechRepository.delete({file_url: fileUrl});
            for (const s of speechData) {
                const speech = Speech.create(fileUrl, s);
                await SpeechRepository.save(speech);
            }

            const result = await SpeechRepository.getLeastWordySpeaker([fileUrl]);
            expect(result).toBe(null);

            await SpeechRepository.delete({file_url: fileUrl});
        });
    });
});