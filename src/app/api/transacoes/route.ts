import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const transacoes = await prisma.transacao.findMany({
    where: { usuarioId: session.user.id },
    include: { cliente: true },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(transacoes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const { descricao, valor, tipo, status, vencimento, clienteId } = await req.json();

  const transacao = await prisma.transacao.create({
    data: {
      descricao,
      valor: parseFloat(valor),
      tipo,
      status,
      vencimento: new Date(vencimento),
      clienteId: clienteId || null,
      usuarioId: session.user.id,
    },
  });

  return NextResponse.json(transacao, { status: 201 });
}
