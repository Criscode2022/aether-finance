import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        amount: new Prisma.Decimal(dto.amount),
        period: dto.period,
        startDate: new Date(dto.startDate),
        userId,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });
  }

  findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!budget) throw new NotFoundException('Budget not found');
    return budget;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.budget.delete({ where: { id } });
  }
}
