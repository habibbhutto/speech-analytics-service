import axios from 'axios';
import axiosRetry from 'axios-retry';
import logger from '../utils/logger';
import Speech from '../entities/speech';
import SpeechRepository from '../repositories/speech.repository';
import csv from 'csvtojson';

export class SpeechAnalytics {
  public SpeechAnalytics() {}

  public async getSpeechEvaluation(fileUrl: any, year: number = 2013) {
    const context = {
      fileName: __filename,
      operationName: 'SpeechAnalytics.getSpeechEvaluation',
    };

    logger.info(`evaluating speaker data for ${{ fileUrl, year }}`, context);
    const fileUrls: string[] = Array.isArray(fileUrl) ? fileUrl : [fileUrl];
    const mostSpeeches = await SpeechRepository.getSpeakerWithMostSpeeches(
      fileUrls,
      year
    );
    const mostSecurity =
      await SpeechRepository.getSpeakerWithMostSecuritySpeeches(fileUrls);
    const leastWordy = await SpeechRepository.getLeastWordySpeaker(fileUrls);

    logger.info('evaluated successfully', context);
    return {
      mostSpeeches,
      mostSecurity,
      leastWordy,
    };
  }

  public async processDatafiles(fileUrl: any) {
    if (Array.isArray(fileUrl)) {
      const urls: string[] = fileUrl;
      for (const url of urls) {
        await this.processDatafile(url);
      }
    } else {
      await this.processDatafile(fileUrl);
    }
  }

  private async processDatafile(fileUrl: string): Promise<void> {
    const context = {
      fileName: __filename,
      operationName: 'SpeechAnalytics.processDatafile',
    };
    logger.info(`process data file ${fileUrl}`, context);
    // if file has been processed before then do nothing
    const speech = await SpeechRepository.findOneBy({ file_url: fileUrl });
    if (speech) {
      logger.info(`data file ${fileUrl} has already been processed`, context);
      return;
    }

    logger.info(`processing data file ${fileUrl}`, context);
    // otherwise download file stream and store it in database
    const client = axios.create();
    axiosRetry(client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      onRetry(retryCount, error, requestConfig) {
        logger.info(JSON.stringify(error), context);
        logger.info(`${retryCount} retring GET ${fileUrl}`, context);
      },
    });

    const response = await client({ url: fileUrl, responseType: 'stream' });
    await csv()
      .fromStream(response.data)
      .subscribe((speechJson) => {
        return new Promise(async (resolve, reject) => {
          try {
            const speech = Speech.create(fileUrl, speechJson);
            await SpeechRepository.save(speech);
            resolve();
          } catch (error) {
            logger.error(JSON.stringify(error), context);
            reject(error);
          }
        });
      });

    logger.info(`data file ${fileUrl} processed successfully`, context);
  }
}

export default SpeechAnalytics;
