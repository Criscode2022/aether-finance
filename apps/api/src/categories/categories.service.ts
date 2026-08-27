import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: { ...dto, userId },
    });
  }

  findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const cat = await this.prisma.category.findFirst({ where: { id, userId } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.category.delete({ where: { id } });
  }
}
