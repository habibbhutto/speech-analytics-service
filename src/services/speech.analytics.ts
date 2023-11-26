import axios from 'axios';
// import Datafile from '../entities/datafile';
// import DatafileRepository from "../repositories/datafile.repository";
import Speech from '../entities/speech';
import SpeechRepository from "../repositories/speech.repository";
import csv from 'csvtojson';

export class SpeechAnalytics {
    public SpeechAnalytics() { }

    public async getSpeechEvaluation(fileUrl: any, year: number) {
        const _year = year ? year : 2013;
        const fileUrls: string[] = Array.isArray(fileUrl) ? fileUrl : [fileUrl];
        const mostSpeeches = await SpeechRepository.getSpeakersWithMostSpeeches(fileUrls, _year);
        const mostSecurity = await SpeechRepository.getSpeakersWithMostSecuritySpeechesOfAllTime(fileUrls);
        const leastWordy = await SpeechRepository.getLeastWordySpeakerOfAllTime(fileUrls);

        return {
            mostSpeeches,
            mostSecurity,
            leastWordy
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
        // if file has been processed before then do nothing
        const speech = await SpeechRepository.findOneBy({ file_url: fileUrl });
        if (speech) {
            return;
        }

        // otherwise download file stream and store it in database
        const response = await axios({ url: fileUrl, responseType: 'stream' });
        await csv().fromStream(response.data).subscribe((speechJson) => {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log(speechJson);
                    const speech = Speech.create(fileUrl, speechJson);
                    await SpeechRepository.save(speech);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}

export default SpeechAnalytics;