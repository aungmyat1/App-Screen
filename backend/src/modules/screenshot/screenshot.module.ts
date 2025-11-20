import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreenshotJob } from '../../entities/screenshot-job.entity';
import { ScreenshotController } from './screenshot.controller';
import { ScreenshotService } from './screenshot.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScreenshotJob]),
    UserModule,
  ],
  controllers: [ScreenshotController],
  providers: [ScreenshotService],
  exports: [ScreenshotService],
})
export class ScreenshotModule {}