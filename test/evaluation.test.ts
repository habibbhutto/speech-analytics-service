import request from 'supertest';
import createApp from '../src/app';

describe('/api/evaluation', () => {
    it('returns expected results for single url', async () => {
        const app = createApp();
        request(app)
            .get('/evaluation')
            .query({ url: '' })
            .expect(200, {
                mostSpeeches: '',
                mostSecurity: '',
                leastWordy: '',
            });
    });

    it('returns expected results for multiple urls', async () => {
        const app = createApp();
        request(app)
            .get('/evaluation')
            .query({ url: ['', ''] })
            .expect(200, {
                mostSpeeches: '',
                mostSecurity: '',
                leastWordy: '',
            });
    });

    it('returns null when there is no answer', async () => {
        const app = createApp();
        request(app)
            .get('/evaluation')
            .query({ url: '' })
            .expect(200, {
                mostSpeeches: '',
                mostSecurity: '',
                leastWordy: '',
            });
    });

    it('returns null when there is ambiguity', async () => {
        const app = createApp();
        request(app)
            .get('/evaluation')
            .query({ url: '' })
            .expect(200, {
                mostSpeeches: '',
                mostSecurity: '',
                leastWordy: '',
            });
    });

    it('returns 500 error when failed to download csv', async () => {
        const app = createApp();
        request(app)
            .get('/evaluation')
            .query({ url: '' })
            .expect(500, {});
    });

    it('returns 500 error when failed to save data to database', async () => {
        const app = createApp();
        request(app)
            .get('/evaluation')
            .query({ url: '' })
            .expect(500, {});
    });
});