import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const nfses = await prisma.nfse.findMany({
    where: { usuarioId: session.user.id },
    include: { cliente: true },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(nfses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const { numero, servico, valor, emissao, status, xmlUrl, clienteId } = await req.json();

  const nfse = await prisma.nfse.create({
    data: {
      numero,
      servico,
      valor: parseFloat(valor),
      emissao: new Date(emissao),
      status,
      xmlUrl,
      clienteId: clienteId || null,
      usuarioId: session.user.id,
    },
  });

  return NextResponse.json(nfse, { status: 201 });
}
