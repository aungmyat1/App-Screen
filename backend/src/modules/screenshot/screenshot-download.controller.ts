import { Controller, Get, Param, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ScreenshotService } from './screenshot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('download')
@UseGuards(JwtAuthGuard)
export class ScreenshotDownloadController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @Get('screenshots/:jobId')
  async downloadScreenshots(
    @Param('jobId') jobId: string,
    @Res() res: Response,
  ) {
    try {
      // Get job details
      const job = await this.screenshotService.getJobById(jobId);
      
      if (!job) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Job not found',
        });
      }
      
      // Check if job is completed
      if (job.status !== 'completed') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Job is not completed yet',
        });
      }
      
      // Check if result file exists
      const filePath = job.resultUrl;
      if (!filePath || !fs.existsSync(filePath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Screenshot file not found',
        });
      }
      
      // Send the file
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="screenshots-${job.appId}.zip"`);
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error downloading screenshots',
        error: error.message,
      });
    }
  }
}