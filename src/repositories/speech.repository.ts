import Speech from "../entities/speech";
import dataSource from "../datasource";

const SpeechRepository = dataSource.getRepository(Speech).extend({
    async getSpeakerWithMostSpeeches(fileUrls: string[], year: number): Promise<string> {
        const results = await SpeechRepository.createQueryBuilder('speech')
            .select('speaker')
            .addSelect('count(speaker) as most_speeches')
            .where(`DATE_PART('Year', speech_date) = :year`, { year })
            .andWhere(`file_url in(:...fileUrls)`, { fileUrls })
            .groupBy('speaker')
            .orderBy('most_speeches', 'DESC')
            .take(2)
            .execute();
        return this._getUnambigousAnswer(results, 'most_speeches');
    },
    async getSpeakerWithMostSecuritySpeeches(fileUrls: string[]): Promise<string> {
        const results = await SpeechRepository.createQueryBuilder('speech')
            .select('speaker')
            .addSelect(`count(speaker) filter (where topic ~ 'Security') as most_security`)
            .where('file_url IN (:...fileUrls)', { fileUrls })
            .groupBy('speaker')
            .orderBy('most_security', 'DESC')
            .take(2)
            .execute();
        return this._getUnambigousAnswer(results, 'most_security');
    },
    async getLeastWordySpeaker(fileUrls: string[]): Promise<string> {
        const results = await SpeechRepository.createQueryBuilder('speech')
            .select('speaker')
            .addSelect('sum(words) as wordiness')
            .where('file_url IN (:...fileUrls)', { fileUrls })
            .groupBy('speaker')
            .orderBy('wordiness', 'ASC')
            .take(2)
            .execute();
        return this._getUnambigousAnswer(results, 'wordiness');

    },
    _getUnambigousAnswer(results: Array<any>, field: string) {
        // there are results
        const one = results.at(0);
        const two = results.at(1);

        // if one is undefined there is no answer 
        // if the top records have same field coult answer is ambigous
        if (!one || (one && two && two[field] == one[field])) {
            return null;
        }

        // otherwise it has a unambigous answer
        return one.speaker;
    }
});

export default SpeechRepository;