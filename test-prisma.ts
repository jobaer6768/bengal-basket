import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { error } from "console";

async function main() {
  const userCount = await prisma.user.count();
  console.log("user count: ", userCount);

  await prisma.$disconnect();
}

main().catch((e) => {
  error(e);
  process.exit(1);
});
