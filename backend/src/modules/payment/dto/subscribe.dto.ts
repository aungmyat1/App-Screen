import { IsString, IsNotEmpty } from 'class-validator';

export class SubscribeDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodNonce: string;

  @IsString()
  @IsNotEmpty()
  planId: string;
}