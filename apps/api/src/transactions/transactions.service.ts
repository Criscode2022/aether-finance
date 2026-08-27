import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        amount: new Prisma.Decimal(dto.amount),
        type: dto.type,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
        userId,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });
  }

  findAll(userId: string, opts?: { type?: string; from?: string; to?: string }) {
    const where: Prisma.TransactionWhereInput = { userId };
    if (opts?.type) where.type = opts.type as any;
    if (opts?.from || opts?.to) {
      where.date = {};
      if (opts.from) (where.date as any).gte = new Date(opts.from);
      if (opts.to) (where.date as any).lte = new Date(opts.to);
    }
    return this.prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.transaction.delete({ where: { id } });
  }

  async summary(userId: string) {
    const [income, expense] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { userId, type: 'INCOME' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
    ]);
    const totalIncome = Number(income._sum.amount ?? 0);
    const totalExpense = Number(expense._sum.amount ?? 0);
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}
