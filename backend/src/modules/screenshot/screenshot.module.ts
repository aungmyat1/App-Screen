import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreenshotJob } from '../../entities/screenshot-job.entity';
import { ScreenshotController } from './screenshot.controller';
import { ScreenshotService } from './screenshot.service';
import { ScreenshotProcessor } from './screenshot.processor';
import { ScreenshotDownloadController } from './screenshot-download.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScreenshotJob]),
    UserModule,
  ],
  controllers: [ScreenshotController, ScreenshotDownloadController],
  providers: [ScreenshotService, ScreenshotProcessor],
  exports: [ScreenshotService, ScreenshotProcessor],
})
export class ScreenshotModule {}