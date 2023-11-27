import { Request, Response } from 'express';
import SpeechAnalytics from '../services/speech.analytics';

export class EvaluationController {
    private speechAnalytics: SpeechAnalytics;

    constructor(speechAnalytics: SpeechAnalytics = new SpeechAnalytics()) {
        this.speechAnalytics = speechAnalytics;
    }

    public async getSpeechEvaluation(req: Request, res: Response) {
        try {
            const { query: { url, year } } = req as any;
            console.log('query: ', { url, year });

            if(!url) {
                res.status(400).send({type: 'BAD_REQUEST', message: 'url query parameter is required.'});
                return;
            }

            await this.speechAnalytics.processDatafiles(url);
            const evaluation = await this.speechAnalytics.getSpeechEvaluation(url, year);

            res.status(200).send(evaluation).end();
        } catch (error) {
            //log.error(error)'
            res.status(500).send({type: 'INTERNAL_SERVER_ERROR', message: 'there is internal server error, please contact support.'});
        }
    }
}

export default new EvaluationController();