import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Groceries' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: '#22c55e' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'shopping-cart' })
  @IsOptional()
  @IsString()
  icon?: string;
}
