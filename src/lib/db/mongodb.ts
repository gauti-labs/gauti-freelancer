import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "gautam_goyal";

if (!uri) {
  // Do NOT throw at import time — build should succeed without env in preview.
  // Callers must handle absence.
  // eslint-disable-next-line no-console
  console.warn("[db] MONGODB_URI is not set. Database features will be unavailable.");
}

const options = {};

let mongoClient: MongoClient | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

function getMongoClientInstance(): MongoClient | null {
  if (!uri) return null;
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri, options);
    }
    return global._mongoClient;
  }
  if (!mongoClient) {
    mongoClient = new MongoClient(uri, options);
  }
  return mongoClient;
}

export async function getDb(): Promise<Db> {
  const client = getMongoClientInstance();
  if (!client) throw new Error("MongoDB is not configured. Set MONGODB_URI.");
  await client.connect();
  return client.db(dbName);
}

export function getMongoClient(): MongoClient | null {
  return getMongoClientInstance();
}
