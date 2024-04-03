import nock from 'nock';
import dataSource from '../datasource';
import Speech from '../entities/speech';
import SpeechRepository from '../repositories/speech.repository';
import SpeechAnalytics from './speech.analytics';

jest.mock('../utils/logger');

describe('SpeechAnalytics', () => {
  const speechAnalytics: SpeechAnalytics = new SpeechAnalytics();

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('getSpeechEvaluation()', () => {
    it('returns evaluation for default year 2013', async () => {
      const fileUrl = 'https://some/file/url/to/speeches1.csv';
      const speechData = [
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2012-10-30',
          Words: 5310,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Coal Subsidies',
          Date: '2012-11-05',
          Words: 1210,
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

      await SpeechRepository.delete({ file_url: fileUrl });
      for (const s of speechData) {
        const speech = Speech.create(fileUrl, s);
        await SpeechRepository.save(speech);
      }

      const result = await speechAnalytics.getSpeechEvaluation(fileUrl);
      expect(result).toEqual({
        leastWordy: 'Caesare Collins',
        mostSecurity: 'Alexander Abel',
        mostSpeeches: null,
      });

      await SpeechRepository.delete({ file_url: fileUrl });
    });
    it('returns evaluation for custom year value', async () => {
      const fileUrl = 'https://some/file/url/to/speeches1.csv';
      const speechData = [
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2012-10-30',
          Words: 5310,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Coal Subsidies',
          Date: '2012-11-05',
          Words: 1210,
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

      await SpeechRepository.delete({ file_url: fileUrl });
      for (const s of speechData) {
        const speech = Speech.create(fileUrl, s);
        await SpeechRepository.save(speech);
      }

      const result = await speechAnalytics.getSpeechEvaluation(fileUrl, 2012);
      expect(result).toEqual({
        leastWordy: 'Caesare Collins',
        mostSecurity: 'Alexander Abel',
        mostSpeeches: 'Alexander Abel',
      });

      await SpeechRepository.delete({ file_url: fileUrl });
    });
    it('returns evaluation for array of urls', async () => {
      const fileUrl = 'https://some/file/url/to/speeches1.csv';
      const speechData = [
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2012-10-30',
          Words: 5310,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Coal Subsidies',
          Date: '2012-11-05',
          Words: 1210,
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

      await SpeechRepository.delete({ file_url: fileUrl });
      for (const s of speechData) {
        const speech = Speech.create(fileUrl, s);
        await SpeechRepository.save(speech);
      }

      const result = await speechAnalytics.getSpeechEvaluation([fileUrl], 2012);
      expect(result).toEqual({
        leastWordy: 'Caesare Collins',
        mostSecurity: 'Alexander Abel',
        mostSpeeches: 'Alexander Abel',
      });

      await SpeechRepository.delete({ file_url: fileUrl });
    });

    it('returns evaluation for the default year when year is undefined', async () => {
      const fileUrl = 'https://some/file/url/to/speeches1.csv';
      const speechData = [
        {
          Speaker: 'Alexander Abel',
          Topic: 'Education Policy',
          Date: '2012-10-30',
          Words: 5310,
        },
        {
          Speaker: 'Bernhard Belling',
          Topic: 'Coal Subsidies',
          Date: '2012-11-05',
          Words: 1210,
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

      await SpeechRepository.delete({ file_url: fileUrl });
      for (const s of speechData) {
        const speech = Speech.create(fileUrl, s);
        await SpeechRepository.save(speech);
      }

      const year = undefined;
      const result = await speechAnalytics.getSpeechEvaluation([fileUrl], year);

      expect(result).toEqual({
        leastWordy: 'Caesare Collins',
        mostSecurity: 'Alexander Abel',
        mostSpeeches: null,
      });

      await SpeechRepository.delete({ file_url: fileUrl });
    });
  });

  describe('processDatafiles()', () => {
    const baseUrl: string = 'https://fid-recruiting.s3-eu-west-1.amazonaws.com';

    it('processes data files for an array of urls', async () => {
      const fileUrl = `${baseUrl}/politics_en.csv`;

      nock('https://fid-recruiting.s3-eu-west-1.amazonaws.com')
        .get('/politics_en.csv')
        .replyWithFile(200, __dirname + '/../../test/data/politics_en.csv', {
          'Content-Type': 'text/csv',
        });

      await SpeechRepository.delete({ file_url: fileUrl });

      await speechAnalytics.processDatafiles([fileUrl]);

      const records = await SpeechRepository.find({
        where: { file_url: fileUrl },
      });
      expect(records.length).toBe(4);

      await SpeechRepository.delete({ file_url: fileUrl });
    });
    it('processes data files for a single url', async () => {
      const fileUrl = `${baseUrl}/politics_en.csv`;

      nock(baseUrl)
        .get('/politics_en.csv')
        .replyWithFile(200, __dirname + '/../../test/data/politics_en.csv', {
          'Content-Type': 'text/csv',
        });

      await SpeechRepository.delete({ file_url: fileUrl });

      await speechAnalytics.processDatafiles(fileUrl);

      const records = await SpeechRepository.find({
        where: { file_url: fileUrl },
      });
      expect(records.length).toBe(4);

      await SpeechRepository.delete({ file_url: fileUrl });
    });
    it('does nothing if the url has been processed before', async () => {
      const fileUrl = `${baseUrl}/politics_en.csv`;

      nock(baseUrl)
        .get('/politics_en.csv')
        .replyWithFile(200, __dirname + '/../../test/data/politics_en.csv', {
          'Content-Type': 'text/csv',
        });

      await SpeechRepository.delete({ file_url: fileUrl });

      await speechAnalytics.processDatafiles(fileUrl);

      let records = await SpeechRepository.find({
        where: { file_url: fileUrl },
      });
      expect(records.length).toBe(4);

      records = await SpeechRepository.find({ where: { file_url: fileUrl } });
      expect(records.length).toBe(4);

      await SpeechRepository.delete({ file_url: fileUrl });
    });

    it('throws error', async () => {
      const fileUrl = `${baseUrl}/politics_en.csv`;

      nock(baseUrl)
        .get('/politics_en.csv')
        .reply(400, {
          message: 'really bad request, did not like it.',
        });

      let error: any;
      try {
        await speechAnalytics.processDatafiles(fileUrl);
      } catch (e) {
        error = e;
      }
      expect(error.toString()).toBe(
        'AxiosError: Request failed with status code 400'
      );
    });
  });
});
