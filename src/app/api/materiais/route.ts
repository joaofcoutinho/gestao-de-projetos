import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const materiais = await prisma.material.findMany({
    where: { usuarioId: session.user.id },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(materiais);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const { nome, categoria, quantidade, minimo, custo } = await req.json();

  const material = await prisma.material.create({
    data: {
      nome,
      categoria: categoria || null,
      quantidade: parseFloat(quantidade),
      minimo: parseFloat(minimo),
      custo: custo ? parseFloat(custo) : null,
      usuarioId: session.user.id,
    },
  });

  return NextResponse.json(material, { status: 201 });
}
