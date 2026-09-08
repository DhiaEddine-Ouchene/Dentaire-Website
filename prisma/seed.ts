import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seed de base — sera enrichi aux PROMPTS 5 / 12 (cabinet, motifs, galerie).
async function main() {
  console.log('Seed : à compléter (cabinet, motifs, avis de démonstration).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
