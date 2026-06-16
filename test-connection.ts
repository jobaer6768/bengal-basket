import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or DIRECT_URL, try both
});

async function test() {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT current_database(), version()");
    console.log("✅ Connected:", res.rows[0]);
    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  }
}

test();