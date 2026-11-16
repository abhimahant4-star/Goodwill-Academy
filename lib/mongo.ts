import { MongoClient, type Db } from "mongodb";

/**
 * One shared MongoClient per server process. In development Next.js reloads modules,
 * so the client is cached on globalThis to avoid opening a new pool on every change.
 */
const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");
  globalForMongo._mongoClient ??= new MongoClient(uri, { maxPoolSize: 10 }).connect().catch((err) => {
    globalForMongo._mongoClient = undefined; // allow a retry on the next request
    throw err;
  });
  return globalForMongo._mongoClient;
}

export async function getDb(): Promise<Db> {
  return (await getClient()).db(process.env.MONGODB_DB || "goodwill_skills_academy");
}
