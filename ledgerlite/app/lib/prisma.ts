import { Pool } from "pg";
import { parse } from "pg-connection-string";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

// Determine if connecting to localhost or remote
const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
const ssl = isLocal ? false : { rejectUnauthorized: false };

if (process.env.NODE_ENV === "production") {
  const pool = new Pool({
    connectionString,
    ssl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({
    adapter,
    log: ["error"],
  });
} else {
  if (!globalForPrisma.prisma) {
    const pool = new Pool({
      connectionString,
      ssl,
    });
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

