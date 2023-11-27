import nock from 'nock';
import request from 'supertest';
import { In } from 'typeorm';
import dataSource from '../datasource';
import SpeechRepository from '../repositories/speech.repository';
import createApp from '../app';

jest.mock('../utils/logger');

describe('EvaluationController', () => {
    beforeAll(async () => {
        await dataSource.initialize();
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    describe('GET api/evaluation', () => {
        it('returns evaluation for a single url', async () => {
            const fileUrl = 'https://fid-recruiting.s3-eu-west-1.amazonaws.com/politics_en.csv'
            nock('https://fid-recruiting.s3-eu-west-1.amazonaws.com')
                .get('/politics_en.csv')
                .replyWithFile(200, __dirname + '/../../test.data/politics_en.csv', {
                    'Content-Type': 'text/csv',
                });

            await SpeechRepository.delete({ file_url: fileUrl });

            const app = createApp();
            await request(app)
                .get('/api/evaluation')
                .query({ url: fileUrl })
                .expect(200, {
                    leastWordy: 'Caesare Collins',
                    mostSecurity: 'Alexander Abel',
                    mostSpeeches: null,
                });

            const records = await SpeechRepository.find({ where: { file_url: fileUrl } });
            expect(records.length).toBe(4);

            await SpeechRepository.delete({ file_url: fileUrl });
        });

        it('returns evaluation for multiple urls', async () => {
            const fileUrl1 = 'https://fid-recruiting.s3-eu-west-1.amazonaws.com/politics_en1.csv'
            const fileUrl2 = 'https://fid-recruiting.s3-eu-west-1.amazonaws.com/politics_en2.csv'
            nock('https://fid-recruiting.s3-eu-west-1.amazonaws.com')
                .get('/politics_en1.csv')
                .replyWithFile(200, __dirname + '/../../test.data/politics_en.csv', {
                    'Content-Type': 'text/csv',
                })
                .get('/politics_en2.csv')
                .replyWithFile(200, __dirname + '/../../test.data/politics_en.csv', {
                    'Content-Type': 'text/csv',
                });


            await SpeechRepository.delete({ file_url: In([fileUrl1, fileUrl2]) });

            const app = createApp();
            await request(app)
                .get('/api/evaluation')
                .query({ url: [fileUrl1, fileUrl2] })
                .expect(200, {
                    leastWordy: 'Caesare Collins',
                    mostSecurity: 'Alexander Abel',
                    mostSpeeches: null,
                });

            const records = await SpeechRepository.find({ where: { file_url: In([fileUrl1, fileUrl2]) } });
            expect(records.length).toBe(8);

            await SpeechRepository.delete({ file_url: In([fileUrl1, fileUrl2]) });
        });

        it('returns evaluation for for a custom year', async () => {
            const fileUrl1 = 'https://fid-recruiting.s3-eu-west-1.amazonaws.com/politics_en1.csv'
            const fileUrl2 = 'https://fid-recruiting.s3-eu-west-1.amazonaws.com/politics_en2.csv'
            nock('https://fid-recruiting.s3-eu-west-1.amazonaws.com')
                .get('/politics_en1.csv')
                .replyWithFile(200, __dirname + '/../../test.data/politics_en.csv', {
                    'Content-Type': 'text/csv',
                })
                .get('/politics_en2.csv')
                .replyWithFile(200, __dirname + '/../../test.data/politics_en.csv', {
                    'Content-Type': 'text/csv',
                });


            await SpeechRepository.delete({ file_url: In([fileUrl1, fileUrl2]) });

            const app = createApp();
            await request(app)
                .get('/api/evaluation')
                .query({ url: [fileUrl1, fileUrl2], year: 2012 })
                .expect(200, {
                    leastWordy: 'Caesare Collins',
                    mostSecurity: 'Alexander Abel',
                    mostSpeeches: 'Alexander Abel',
                });

            const records = await SpeechRepository.find({ where: { file_url: In([fileUrl1, fileUrl2]) } });
            expect(records.length).toBe(8);

            await SpeechRepository.delete({ file_url: In([fileUrl1, fileUrl2]) });
        });
        
        it('returns null if there is no answer', async () => {
            const fileUrl = 'https://fid-recruiting.s3-eu-west-1.amazonaws.com/politics_en.csv'
            nock('https://fid-recruiting.s3-eu-west-1.amazonaws.com')
                .get('/politics_en.csv')
                .replyWithFile(200, __dirname + '/../../test.data/politics_en.csv', {
                    'Content-Type': 'text/csv',
                });

            await SpeechRepository.delete({ file_url: fileUrl });

            const app = createApp();
            await request(app)
                .get('/api/evaluation')
                .query({ url: fileUrl, year: 2013 })
                .expect(200, {
                    leastWordy: 'Caesare Collins',
                    mostSecurity: 'Alexander Abel',
                    mostSpeeches: null,
                });

            const records = await SpeechRepository.find({ where: { file_url: fileUrl } });
            expect(records.length).toBe(4);

            await SpeechRepository.delete({ file_url: fileUrl });
        });
        
        it('returns null if there is ambiguity', async () => {
            const fileUrl = 'https://fid-recruiting.s3-eu-west-1.amazonaws.com/politics_en.ambiguity.csv'
            nock('https://fid-recruiting.s3-eu-west-1.amazonaws.com')
                .get('/politics_en.ambiguity.csv')
                .replyWithFile(200, __dirname + '/../../test.data/politics_en.ambiguity.csv', {
                    'Content-Type': 'text/csv',
                });

            await SpeechRepository.delete({ file_url: fileUrl });

            const app = createApp();
            await request(app)
                .get('/api/evaluation')
                .query({ url: fileUrl, year: 2013 })
                .expect(200, {
                    leastWordy: 'Bernhard Belling',
                    mostSecurity: 'Alexander Abel',
                    mostSpeeches: null,
                });

            const records = await SpeechRepository.find({ where: { file_url: fileUrl } });
            expect(records.length).toBe(5);

            await SpeechRepository.delete({ file_url: fileUrl });
        });

        it('returns 400 when required url parameter is missing', async () => {
            const app = createApp();
            await request(app)
                .get('/api/evaluation')
                .query({})
                .expect(400, {
                    type: 'BAD_REQUEST',
                    message: 'url query parameter is required.'
                });
        });

        it('returns 500 when there is internal server error', async () => {
            const fileUrl = 'https://fid-recruiting.s3-eu-west-1.amazonaws.com/politics_en.csv'
            nock('https://fid-recruiting.s3-eu-west-1.amazonaws.com')
                .get('/politics_en.csv')
                .reply(500, {
                    message: 'something went terribly wrong'
                });

            await SpeechRepository.delete({ file_url: fileUrl });

            const app = createApp();
            await request(app)
                .get('/api/evaluation')
                .query({ url: fileUrl })
                .expect(500, {
                    type: 'INTERNAL_SERVER_ERROR',
                    message: 'there is internal server error, please contact support.'
                });
        });
    });
});