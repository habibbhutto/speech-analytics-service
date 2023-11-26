import { Request, Response } from 'express';
import SpeechAnalytics from '../services/speech.analytics';

export class EvaluationController {
    private speechAnalytics: SpeechAnalytics;

    constructor(speechAnalytics: SpeechAnalytics = new SpeechAnalytics()) {
        this.speechAnalytics = speechAnalytics;
    }

    public async getSpeechEvaluation(req: Request, res: Response) {
        try {
            const { query } = req as any;
            console.log('query: ', query);

            const {url, year} = query;
            
            await this.speechAnalytics.processDatafiles(url);
            const evaluation = await this.speechAnalytics.getSpeechEvaluation(year);

            res.status(200).send(evaluation);
            // expected response model
            // {
            //     mostSpeeches: '',
            //     mostSecurity: '',
            //     leastWordy: ''
            // }
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new EvaluationController();