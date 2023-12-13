import { Request, Response } from 'express';
import logger from '../utils/logger';
import SpeechAnalytics from '../services/speech.analytics';

export class EvaluationController {
  private speechAnalytics: SpeechAnalytics;

  constructor(speechAnalytics: SpeechAnalytics = new SpeechAnalytics()) {
    this.speechAnalytics = speechAnalytics;
  }

  public async getSpeechEvaluation(req: Request, res: Response) {
    const context = {
      fileName: __filename,
      operationName: 'EvaluationController.getSpeechEvaluation',
    };
    try {
      const {
        query: { url, year },
      } = req as any;
      logger.info(
        `request received, query: ${JSON.stringify({ url, year })}`,
        context
      );

      if (!url) {
        res.status(400).send({
          type: 'BAD_REQUEST',
          message: 'url query parameter is required.',
        });
        logger.info('bad request', context);
        return;
      }

      await this.speechAnalytics.processDatafiles(url);
      const evaluation = await this.speechAnalytics.getSpeechEvaluation(
        url,
        year
      );

      res.status(200).send(evaluation).end();
    } catch (error) {
      logger.error(JSON.stringify(error), context);
      res.status(500).send({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'there is internal server error, please contact support.',
      });
    }
  }
}

export default new EvaluationController();
