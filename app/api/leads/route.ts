import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const leads = await db.collection("leads").find({}).toArray();
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection("leads").insertOne({
      ...data,
      createdAt: new Date(),
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar lead" }, { status: 500 });
  }
}
