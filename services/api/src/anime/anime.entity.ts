import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('anime')
export class Anime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  genres: string[];

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  episodeCount: number;

  @Column({ default: 'ongoing' })
  status: string;

  @Column({ nullable: true })
  releaseYear: number;

  @Column({ nullable: true })
  studio: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
