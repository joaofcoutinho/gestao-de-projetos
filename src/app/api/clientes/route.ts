import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const clientes = await prisma.cliente.findMany({
    where: { usuarioId: session.user.id },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(clientes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const { nome, documento, email, telefone } = await req.json();

  const cliente = await prisma.cliente.create({
    data: { nome, documento, email, telefone, usuarioId: session.user.id },
  });

  return NextResponse.json(cliente, { status: 201 });
}
