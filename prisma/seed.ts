import { PrismaClient, TransactionType, BudgetPeriod } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_DEMO_USER_EMAIL || 'demo@aether.finance';
  const password = process.env.SEED_DEMO_USER_PASSWORD || 'Demo123!';

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: 'Demo User',
    },
  });

  const groceries = await prisma.category.upsert({
    where: { userId_name: { userId: user.id, name: 'Groceries' } },
    update: {},
    create: { name: 'Groceries', color: '#22c55e', userId: user.id },
  });

  const salary = await prisma.category.upsert({
    where: { userId_name: { userId: user.id, name: 'Salary' } },
    update: {},
    create: { name: 'Salary', color: '#3b82f6', userId: user.id },
  });

  await prisma.transaction.createMany({
    data: [
      {
        amount: 3500,
        type: TransactionType.INCOME,
        description: 'Monthly salary',
        userId: user.id,
        categoryId: salary.id,
      },
      {
        amount: 87.4,
        type: TransactionType.EXPENSE,
        description: 'Weekly groceries',
        userId: user.id,
        categoryId: groceries.id,
      },
    ],
  });

  await prisma.budget.create({
    data: {
      amount: 400,
      period: BudgetPeriod.MONTHLY,
      startDate: new Date(),
      userId: user.id,
      categoryId: groceries.id,
    },
  });

  console.log('Seed complete. Demo user:', email, '/', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
