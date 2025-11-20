import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScreenshotModule } from './modules/screenshot/screenshot.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'appscreen',
      password: process.env.DB_PASSWORD || 'appscreen',
      database: process.env.DB_NAME || 'appscreen',
      autoLoadEntities: true,
      synchronize: true, // Should be false in production
    }),
    UserModule,
    AuthModule,
    ScreenshotModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}