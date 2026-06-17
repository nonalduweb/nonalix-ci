import { prisma } from '../src/lib/db';
import products from '../src/data/products.json';

async function main() {
  console.log('Début du peuplement de la base de données (Seeding)...');

  for (const p of products) {
    const details = p.details || [];
    const isDigital = (p as any).isDigital || false;
    const downloadUrl = (p as any).downloadUrl || null;

    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        category: p.category,
        imageUrl: p.imageUrl,
        inStock: p.inStock,
        featured: p.featured,
        isDigital,
        downloadUrl,
        details,
      },
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        category: p.category,
        imageUrl: p.imageUrl,
        inStock: p.inStock,
        featured: p.featured,
        isDigital,
        downloadUrl,
        details,
      },
    });

    console.log(`Upserted product: ${product.name} (${product.id})`);
  }

  console.log('Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
