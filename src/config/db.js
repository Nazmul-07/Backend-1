import { MongoClient } from 'mongodb';
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.DB_URI);
const dbName = process.env.DB_NAME;

let db;

export async function connectToMongoDB() {
  try {
    await client.connect();
    db= client.db(dbName);
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}

export const getDB = ()=>{
    if(!db){
        throw new Error("Data base not found")
    }
    return db;
}