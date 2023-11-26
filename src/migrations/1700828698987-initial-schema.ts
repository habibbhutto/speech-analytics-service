import { MigrationInterface, QueryRunner } from "typeorm"
import fs from 'node:fs';

export class InitialSchema1700828698987 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const buffer = fs.readFileSync(__dirname + '/1700828698987-initial-schema.up.sql');
        await queryRunner.query(buffer.toString());
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
    
}
