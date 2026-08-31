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
let mongoClientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
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

function resetCachedClient() {
  if (process.env.NODE_ENV === "development") {
    global._mongoClient = undefined;
    global._mongoClientPromise = undefined;
  } else {
    mongoClient = null;
    mongoClientPromise = null;
  }
}

function createClientPromise(client: MongoClient): Promise<MongoClient> {
  return client.connect().then(() => client).catch((err) => {
    resetCachedClient();
    throw err;
  });
}

export function getMongoClientPromise(): Promise<MongoClient> | null {
  const client = getMongoClientInstance();
  if (!client) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createClientPromise(client);
    }
    return global._mongoClientPromise;
  }

  if (!mongoClientPromise) {
    mongoClientPromise = createClientPromise(client);
  }
  return mongoClientPromise;
}

export async function getConnectedMongoClient(): Promise<MongoClient> {
  const promise = getMongoClientPromise();
  if (!promise) throw new Error("MongoDB is not configured. Set MONGODB_URI.");
  return await promise;
}

export async function getDb(): Promise<Db> {
  const client = await getConnectedMongoClient();
  return client.db(dbName);
}

export function getMongoClient(): MongoClient | null {
  return getMongoClientInstance();
}
