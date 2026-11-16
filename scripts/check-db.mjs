// Checks that the app can reach MongoDB with the settings in .env.local.
// Run with: npm run check-db
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "goodwill_skills_academy";

if (!uri) {
  console.log("NOT connected: MONGODB_URI is missing from .env.local");
  process.exit(1);
}

const host = uri.replace(/^mongodb(\+srv)?:\/\/([^@]*@)?/, "").split(/[/?]/)[0];
console.log(`Connecting to ${host} (database "${dbName}")...`);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
try {
  await client.connect();
  const db = client.db(dbName);
  await db.command({ ping: 1 });
  const names = (await db.listCollections().toArray()).map((c) => c.name).sort();
  console.log("Connected!");
  for (const name of names) console.log(`  ${name.padEnd(14)} ${await db.collection(name).countDocuments()} documents`);
  if (!names.length) console.log("  (database is empty — open the website once and it will be filled automatically)");
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.log("NOT connected:", msg.replace(/\/\/[^@\s]*@/g, "//***@"));
  if (/auth/i.test(msg)) console.log("Hint: wrong username or password — check Atlas → Database Access.");
  else if (/timed out|ETIMEDOUT|Server selection/i.test(msg)) console.log("Hint: your IP may be blocked — add it in Atlas → Network Access.");
  else if (/ENOTFOUND|querySrv/i.test(msg)) console.log("Hint: check your internet connection and the cluster address in MONGODB_URI.");
  process.exitCode = 1;
} finally {
  await client.close();
}
