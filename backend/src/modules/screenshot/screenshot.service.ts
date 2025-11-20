import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScreenshotJob, JobStatus } from '../../entities/screenshot-job.entity';

@Injectable()
export class ScreenshotService {
  constructor(
    @InjectRepository(ScreenshotJob)
    private screenshotJobRepository: Repository<ScreenshotJob>,
  ) {}

  async createJob(
    appId: string,
    appUrl: string,
    store: string,
    userId: string,
  ): Promise<ScreenshotJob> {
    const job = this.screenshotJobRepository.create({
      appId,
      appUrl,
      store,
      userId,
    });
    return this.screenshotJobRepository.save(job);
  }

  async getJobById(id: string): Promise<ScreenshotJob | null> {
    return this.screenshotJobRepository.findOne({ where: { id } });
  }

  async getJobsByUser(userId: string): Promise<ScreenshotJob[]> {
    return this.screenshotJobRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateJobStatus(
    id: string,
    status: JobStatus,
    resultUrl?: string,
  ): Promise<ScreenshotJob | null> {
    const job = await this.getJobById(id);
    if (!job) {
      return null;
    }

    job.status = status;
    if (resultUrl) {
      job.resultUrl = resultUrl;
    }

    return this.screenshotJobRepository.save(job);
  }
}