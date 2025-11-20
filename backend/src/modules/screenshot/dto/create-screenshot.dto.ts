import { IsUrl, IsIn, IsNotEmpty } from 'class-validator';

export class CreateScreenshotDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsIn(['google', 'apple'])
  @IsNotEmpty()
  store: string;
}