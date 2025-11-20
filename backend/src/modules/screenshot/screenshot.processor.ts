import { Injectable, Logger } from '@nestjs/common';
import { ScreenshotJob, JobStatus } from '../../entities/screenshot-job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class ScreenshotProcessor {
  private readonly logger = new Logger(ScreenshotProcessor.name);

  constructor(
    @InjectRepository(ScreenshotJob)
    private screenshotJobRepository: Repository<ScreenshotJob>,
  ) {}

  async processJob(job: ScreenshotJob): Promise<void> {
    this.logger.log(`Processing screenshot job ${job.id} for app ${job.appId}`);

    try {
      // Update job status to processing
      await this.updateJobStatus(job.id, JobStatus.PROCESSING);

      // Create directory for this job
      const jobDir = path.join('/tmp', 'screenshots', job.id);
      if (!fs.existsSync(jobDir)) {
        fs.mkdirSync(jobDir, { recursive: true });
      }

      // Process based on store
      if (job.store === 'google') {
        await this.processGooglePlayApp(job, jobDir);
      } else if (job.store === 'apple') {
        await this.processAppStoreApp(job, jobDir);
      } else {
        throw new Error(`Unsupported store: ${job.store}`);
      }

      // Create zip file
      const zipPath = await this.createZipFile(jobDir, job);
      
      // Update job with result
      await this.updateJobStatus(job.id, JobStatus.COMPLETED, zipPath);
      
      this.logger.log(`Successfully processed screenshot job ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to process screenshot job ${job.id}: ${error.message}`);
      await this.updateJobStatus(job.id, JobStatus.FAILED);
    }
  }

  private async processGooglePlayApp(job: ScreenshotJob, jobDir: string): Promise<void> {
    // In a real implementation, we would:
    // 1. Scrape the Google Play Store page for the app
    // 2. Extract screenshot URLs
    // 3. Download each screenshot
    // 4. Save them to the jobDir
    
    // For demonstration, we'll simulate this process
    this.logger.log(`Processing Google Play app: ${job.appId}`);
    
    // Simulate downloading screenshots
    await this.simulateScreenshotDownload(jobDir, 5);
  }

  private async processAppStoreApp(job: ScreenshotJob, jobDir: string): Promise<void> {
    // In a real implementation, we would:
    // 1. Scrape the Apple App Store page for the app
    // 2. Extract screenshot URLs
    // 3. Download each screenshot
    // 4. Save them to the jobDir
    
    // For demonstration, we'll simulate this process
    this.logger.log(`Processing App Store app: ${job.appId}`);
    
    // Simulate downloading screenshots
    await this.simulateScreenshotDownload(jobDir, 5);
  }

  private async simulateScreenshotDownload(jobDir: string, count: number): Promise<void> {
    // Create placeholder images for demonstration
    for (let i = 1; i <= count; i++) {
      const imagePath = path.join(jobDir, `screenshot_${i}.png`);
      // Create a simple placeholder image
      const placeholder = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="500" viewBox="0 0 300 500">
  <rect width="300" height="500" fill="#f0f0f0"/>
  <text x="150" y="250" font-family="Arial" font-size="20" text-anchor="middle" fill="#333">
    Screenshot ${i}
  </text>
</svg>`;
      fs.writeFileSync(imagePath, placeholder);
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async createZipFile(jobDir: string, job: ScreenshotJob): Promise<string> {
    const zip = new AdmZip();
    const files = fs.readdirSync(jobDir);
    
    // Add all files to zip
    for (const file of files) {
      const filePath = path.join(jobDir, file);
      zip.addLocalFile(filePath);
    }
    
    // Create zip file
    const zipPath = path.join('/tmp', 'screenshots', `${job.id}.zip`);
    zip.writeZip(zipPath);
    
    return zipPath;
  }

  private async updateJobStatus(
    jobId: string,
    status: JobStatus,
    resultUrl?: string,
  ): Promise<void> {
    const job = await this.screenshotJobRepository.findOne({ where: { id: jobId } });
    if (job) {
      job.status = status;
      if (resultUrl) {
        job.resultUrl = resultUrl;
      }
      await this.screenshotJobRepository.save(job);
    }
  }
}