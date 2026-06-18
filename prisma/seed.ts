import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

// Recreate the adapter for the seed script (outside of lib)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data (order matters due to FK constraints)
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.productInventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  console.log("Old data cleaned.");

  // Create sample products
  const babyFood1 = await prisma.product.create({
    data: {
      name: "Cerelac Baby Cereal (Wheat & Milk)",
      slug: "cerelac-baby-cereal-wheat-milk",
      description: "Nutritious wheat and milk cereal for babies 6+ months.",
      type: "BABY_FOOD",
      base_price: 320.0,
      wholesale_pricing: [{ minQty: 5, price: 290.0 }],
      sku: "BF-CER-001",
      availability_type: "STOCK",
      extra_attributes: {
        brand: "Nestle",
        weight: "400g",
        age_suitability: "6-12 months",
        expiration_date: "2025-12-31",
        nutritional_info: { protein: "12g", carbs: "70g", fat: "8g" },
      },
      images: {
        create: [
          {
            url: "https://placehold.co/400x400?text=Cerelac+1",
            alt_text: "Cerelac front",
            sort_order: 0,
          },
          {
            url: "https://placehold.co/400x400?text=Cerelac+2",
            alt_text: "Cerelac back",
            sort_order: 1,
          },
        ],
      },
      inventory: {
        create: { quantity_available: 100 },
      },
    },
  });

  const babyFood2 = await prisma.product.create({
    data: {
      name: "Happy Baby Organic Puffs",
      slug: "happy-baby-organic-puffs",
      description: "Organic whole grain puffs for toddlers.",
      type: "BABY_FOOD",
      base_price: 450.0,
      wholesale_pricing: [{ minQty: 10, price: 410.0 }],
      sku: "BF-HAP-002",
      availability_type: "STOCK",
      extra_attributes: {
        brand: "Happy Baby",
        weight: "60g",
        age_suitability: "8+ months",
        expiration_date: "2025-08-15",
        nutritional_info: { protein: "2g", carbs: "20g", fat: "1g" },
      },
      images: {
        create: [
          {
            url: "https://placehold.co/400x400?text=HappyBaby+1",
            alt_text: "Puffs jar",
            sort_order: 0,
          },
        ],
      },
      inventory: {
        create: { quantity_available: 50 },
      },
    },
  });

  const mango1 = await prisma.product.create({
    data: {
      name: "Himsagar Mango (Rajshahi)",
      slug: "himsagar-mango-rajshahi",
      description:
        "Sweetest Himsagar mangoes sourced directly from Rajshahi orchards.",
      type: "FRUIT",
      base_price: 120.0, // per kg
      wholesale_pricing: [{ minQty: 20, price: 100.0 }],
      sku: "FR-MAN-001",
      availability_type: "PRE_ORDER",
      max_order_quantity: 500, // total kg available for pre-order
      estimated_delivery_days: 3,
      extra_attributes: {
        origin: "Rajshahi",
        variety: "Himsagar",
        harvest_date: "2025-06-01",
        weight_unit: "kg",
      },
      images: {
        create: [
          {
            url: "https://placehold.co/400x400?text=Himsagar+Mango",
            alt_text: "Fresh Himsagar mango",
            sort_order: 0,
          },
        ],
      },
      // No inventory for PRE_ORDER
    },
  });

  const mango2 = await prisma.product.create({
    data: {
      name: "Langra Mango (Chapai)",
      slug: "langra-mango-chapai",
      description: "Famous Langra mangoes from Chapai Nawabganj.",
      type: "FRUIT",
      base_price: 100.0,
      sku: "FR-MAN-002",
      availability_type: "PRE_ORDER",
      max_order_quantity: 300,
      estimated_delivery_days: 4,
      extra_attributes: {
        origin: "Chapai Nawabganj",
        variety: "Langra",
        harvest_date: "2025-06-10",
        weight_unit: "kg",
      },
      images: {
        create: [
          {
            url: "https://placehold.co/400x400?text=Langra+Mango",
            alt_text: "Langra mango",
            sort_order: 0,
          },
        ],
      },
    },
  });

  console.log("Seed data created:", {
    babyFood1: babyFood1.name,
    babyFood2: babyFood2.name,
    mango1: mango1.name,
    mango2: mango2.name,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
