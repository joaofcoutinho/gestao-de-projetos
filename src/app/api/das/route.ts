import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const das = await prisma.das.findMany({
    where: { usuarioId: session.user.id },
    orderBy: { vencimento: "desc" },
  });

  return NextResponse.json(das);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const { competencia, vencimento, valor, pagamento, status } = await req.json();

  const das = await prisma.das.create({
    data: {
      competencia,
      vencimento: new Date(vencimento),
      valor: parseFloat(valor),
      pagamento: pagamento ? new Date(pagamento) : null,
      status,
      usuarioId: session.user.id,
    },
  });

  return NextResponse.json(das, { status: 201 });
}
