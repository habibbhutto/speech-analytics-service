import axios from 'axios';
import Datafile from '../entities/datafile';
import Speech from '../entities/speech';
import SpeechRepository from "../repositories/speech.repository";
import DatafileRepository from "../repositories/datafile.repository";
import csv from 'csvtojson';

export class SpeechAnalytics {
    public SpeechAnalytics() { }

    public async getSpeechEvaluation(year: number) {
        const _year = year ? year : 2013;
        const mostSpeeches = await SpeechRepository.getSpeakersWithMostSpeeches(_year);
        const mostSecurity = await SpeechRepository.getSpeakersWithMostSecuritySpeechesOfAllTime();
        const leastWordy = await SpeechRepository.getLeastWordySpeakerOfAllTime();

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
        const dataFile = await DatafileRepository.findOneBy({ file_url: fileUrl });
        if (dataFile) {
            return;
        }

        const response = await axios({ url: fileUrl, responseType: 'stream' });
        await csv().fromStream(response.data).subscribe((speechJson) => {
            return new Promise(async (resolve, reject) => {
                console.log(speechJson);
                const speech = Speech.create(speechJson);
                await SpeechRepository.save(speech);
                resolve();
            });
        });

        const dataFileProcessed = Datafile.create(fileUrl);
        DatafileRepository.save(dataFileProcessed);
    }
}

export default SpeechAnalytics;