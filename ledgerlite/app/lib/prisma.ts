import { Pool } from "pg";
import { parse } from "pg-connection-string";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

// Explicitly parse connection string to prevent hidden pg pool merges
const poolConfig = parse(connectionString) as any;

// Determine if connecting to localhost or remote
const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

// Explicitly override the parsed SSL settings
poolConfig.ssl = isLocal ? false : { rejectUnauthorized: false };

if (process.env.NODE_ENV === "production") {
  const pool = new Pool({...poolConfig, max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,});
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({
    adapter,
    log: ["error"],
  });
} else {
  if (!globalForPrisma.prisma) {
    const pool = new Pool(poolConfig);
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
export default prisma;

