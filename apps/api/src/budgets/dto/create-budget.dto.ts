import { IsNumber, IsEnum, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BudgetPeriodDto {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export class CreateBudgetDto {
  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ enum: BudgetPeriodDto, default: 'MONTHLY' })
  @IsEnum(BudgetPeriodDto)
  period!: BudgetPeriodDto;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;
}
