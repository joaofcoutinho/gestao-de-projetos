import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { nome, email, senha, cnpj } = await req.json();

    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return NextResponse.json(
        { erro: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaCriptografada, cnpj },
    });

    return NextResponse.json(
      { mensagem: "Conta criada com sucesso!", id: usuario.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { erro: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}
