import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScreenshotJob, JobStatus } from '../../entities/screenshot-job.entity';
import { ScreenshotProcessor } from './screenshot.processor';

@Injectable()
export class ScreenshotService {
  private readonly logger = new Logger(ScreenshotService.name);

  constructor(
    @InjectRepository(ScreenshotJob)
    private screenshotJobRepository: Repository<ScreenshotJob>,
    private readonly screenshotProcessor: ScreenshotProcessor,
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
    
    const savedJob = await this.screenshotJobRepository.save(job);
    
    // Process the job asynchronously
    this.processJobAsync(savedJob);
    
    return savedJob;
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

  private async processJobAsync(job: ScreenshotJob): Promise<void> {
    // Process job asynchronously without blocking the response
    setImmediate(async () => {
      try {
        await this.screenshotProcessor.processJob(job);
      } catch (error) {
        this.logger.error(`Error processing job ${job.id}: ${error.message}`);
        await this.updateJobStatus(job.id, JobStatus.FAILED);
      }
    });
  }
}