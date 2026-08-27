import { IsNumber, IsEnum, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TransactionTypeDto {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @ApiProperty({ example: 42.5 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ enum: TransactionTypeDto })
  @IsEnum(TransactionTypeDto)
  type!: TransactionTypeDto;

  @ApiPropertyOptional({ example: 'Weekly groceries' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;
}
