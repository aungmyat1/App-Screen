import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateScreenshotDto } from './dto/create-screenshot.dto';

@Controller('screenshots')
@UseGuards(JwtAuthGuard)
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @Post()
  async requestScreenshots(
    @Request() req,
    @Body() createScreenshotDto: CreateScreenshotDto,
  ) {
    // Extract app ID from URL
    let appId = '';
    if (createScreenshotDto.store === 'google') {
      const match = createScreenshotDto.url.match(/id=([a-zA-Z0-9._-]+)/);
      if (match && match[1]) {
        appId = match[1];
      }
    } else {
      // For Apple App Store
      const match = createScreenshotDto.url.match(/id(\d+)/);
      if (match && match[1]) {
        appId = match[1];
      }
    }

    if (!appId) {
      throw new Error('Invalid app URL');
    }

    const job = await this.screenshotService.createJob(
      appId,
      createScreenshotDto.url,
      createScreenshotDto.store,
      req.user.id,
    );

    // In a real implementation, you would queue this job for processing
    // For now, we'll simulate the processing

    return {
      id: job.id,
      appId,
      appUrl: createScreenshotDto.url,
      store: createScreenshotDto.store,
      status: job.status,
      message: 'Screenshot job created successfully. Processing will begin shortly.',
    };
  }

  @Get(':id')
  async getJobStatus(@Request() req, @Param('id') id: string) {
    const job = await this.screenshotService.getJobById(id);
    
    if (!job || job.userId !== req.user.id) {
      throw new Error('Screenshot job not found');
    }
    
    return job;
  }

  @Get()
  async getUserJobs(@Request() req) {
    return this.screenshotService.getJobsByUser(req.user.id);
  }
}