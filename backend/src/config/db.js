const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected successfully via Prisma 7 PG Adapter');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Export the prisma instance as a property on connectDB
connectDB.prisma = prisma;

module.exports = connectDB;
