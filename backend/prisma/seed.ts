import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default plans
  const freePlan = await prisma.plan.create({
    data: {
      name: 'Free',
      description: 'Basic plan for individuals',
      price: 0,
      interval: 'MONTH',
      maxJobs: 10,
      maxUsers: 1,
      features: ['Up to 10 screenshot jobs/month', 'Basic support'],
      status: 'ACTIVE',
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: 'Pro',
      description: 'Professional plan for teams',
      price: 29.99,
      interval: 'MONTH',
      maxJobs: 100,
      maxUsers: 10,
      features: [
        'Up to 100 screenshot jobs/month',
        'Team collaboration',
        'Priority support',
        'Advanced analytics'
      ],
      status: 'ACTIVE',
    },
  });

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: 'Enterprise',
      description: 'Enterprise plan for large organizations',
      price: 99.99,
      interval: 'MONTH',
      maxJobs: -1, // Unlimited
      maxUsers: -1, // Unlimited
      features: [
        'Unlimited screenshot jobs',
        'Team collaboration',
        '24/7 dedicated support',
        'Advanced analytics',
        'Custom integrations',
        'SLA guarantee'
      ],
      status: 'ACTIVE',
    },
  });

  console.log('Seed data created successfully:');
  console.log('- Plans:', [freePlan.name, proPlan.name, enterprisePlan.name]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });