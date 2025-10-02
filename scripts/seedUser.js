import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Por favor, defina a variável MONGODB_URI no .env.local");

async function main() {
  const client = new MongoClient(uri, {});
  try {
    await client.connect();
    const db = client.db(); 
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email: "admin@teste.com" });
    if (existingUser) {
      console.log("Usuário já existe!");
      return;
    }

    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await usersCollection.insertOne({
      email: "admin@teste.com",
      password: hashedPassword,
      createdAt: new Date(),
      role: "admin",
    });

    console.log("Usuário criado com sucesso!", result.insertedId);
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

main();
