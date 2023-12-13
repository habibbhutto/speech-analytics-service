import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'speeches' })
export default class Speech {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_url' })
  @Index()
  file_url: string;

  @Column()
  @Index()
  speaker: string;

  @Column()
  @Index()
  topic: string;

  @Column({ type: 'timestamptz' })
  @Index()
  speech_date: Date;

  @Column()
  words: number;

  @Column({ type: 'timestamptz' })
  @Index()
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamptz' })
  @Index()
  @UpdateDateColumn()
  updated: Date;

  public static create(fileUrl: string, speech: any): Speech {
    const speechEntity = new Speech();
    speechEntity.file_url = fileUrl;
    speechEntity.speaker = speech.Speaker;
    speechEntity.topic = speech.Topic;
    speechEntity.speech_date = speech.Date;
    speechEntity.words = speech.Words;

    return speechEntity;
  }
}
