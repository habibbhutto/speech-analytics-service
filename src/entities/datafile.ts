import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

@Entity({name: 'datafiles'})
export default class Datafile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'file_url'})
    @Index()
    file_url: string;

    @Column({ type: 'timestamptz' })
    @Index()
    @CreateDateColumn()
    created: Date;
  
    @Column({ type: 'timestamptz' })
    @Index()
    @UpdateDateColumn()
    updated: Date; 

    public static create(fileUrl: string): Datafile {
      const datafile = new Datafile();
      datafile.file_url = fileUrl;
      
      return datafile;
    }
}