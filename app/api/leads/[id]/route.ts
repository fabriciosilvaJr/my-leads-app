import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// GET /api/leads/:id
export async function GET(req: Request, context: any) {
  const { id } = context.params;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const lead = await db.collection("leads").findOne({ _id: new ObjectId(id) });

    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar lead" }, { status: 500 });
  }
}

// PATCH /api/leads/:id
export async function PATCH(req: Request, context: any) {
  const { id } = context.params;

  try {
    const data = await req.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("leads").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar lead" }, { status: 500 });
  }
}

// DELETE /api/leads/:id
export async function DELETE(req: Request, context: any) {
  const { id } = context.params;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("leads").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead deletado com sucesso" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao deletar lead" }, { status: 500 });
  }
}
