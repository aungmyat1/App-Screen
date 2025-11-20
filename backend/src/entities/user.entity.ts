import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ScreenshotJob } from './screenshot-job.entity';

export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'jsonb', default: {} })
  subscription: {
    plan: SubscriptionPlan;
    braintreeCustomerId?: string;
    expiresAt?: Date;
  };

  @Column({ default: 0 })
  downloadCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ScreenshotJob, (job) => job.user)
  screenshotJobs: ScreenshotJob[];
}