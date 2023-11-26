import Speech from "../entities/speech";
import dataSource from "../datasource";

const SpeechRepository = dataSource.getRepository(Speech).extend({
    async getSpeakersWithMostSpeeches(year: number): Promise<string> {
        const results = await SpeechRepository.createQueryBuilder('speech')
            .select('speaker')
            .addSelect('count(speaker) as most_speeches')
            .where(`DATE_PART('Year', speech_date) = :year`, { year })
            .groupBy('speaker')
            .orderBy('most_speeches', 'DESC')
            .take(2)
            .execute();
        return this._getUnambigousAnswer(results, 'most_speeches');
    },
    async getSpeakersWithMostSecuritySpeechesOfAllTime(): Promise<string> {
        const results = await SpeechRepository.createQueryBuilder('speech')
            .select('speaker')
            .addSelect(`count(speaker) filter (where topic ~ 'Security') as most_security`)
            .groupBy('speaker')
            .orderBy('most_security', 'DESC')
            .take(2)
            .execute();
        return this._getUnambigousAnswer(results, 'most_security');
    },
    async getLeastWordySpeakerOfAllTime(): Promise<string> {
        const results = await SpeechRepository.createQueryBuilder('speech')
            .select('speaker')
            .addSelect('sum(words) as wordiness')
            .groupBy('speaker')
            .orderBy('wordiness', 'ASC')
            .take(2)
            .execute();
        return this._getUnambigousAnswer(results, 'wordiness');

    },
    _getUnambigousAnswer(results: any, field: string) {
        // there are results
        if (results.length > 0 &&
            (
                // if results have one row that's the unambigous answer
                results.length === 1 ||
                // if the top two in results have different counts 
                // that means the top 1 is unambigous answer
                results[0][field] !== results[1][field]
            )
        ) {
            return results[0].speaker;
        }

        // otherwise it's ambigous or has no answer
        return null;
    }
});

export default SpeechRepository;