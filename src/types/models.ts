export type Cliente = {
  id: string;
  nome: string;
  documento: string | null;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
  criadoEm: string;
  usuarioId: string;
};

export type Transacao = {
  id: string;
  descricao: string;
  valor: number;
  tipo: string;
  status: string;
  vencimento: string;
  criadoEm: string;
  usuarioId: string;
  clienteId: string | null;
  cliente?: Cliente | null;
};

export type Material = {
  id: string;
  nome: string;
  categoria: string | null;
  quantidade: number;
  minimo: number;
  custo: number | null;
  criadoEm: string;
  usuarioId: string;
};

export type Nfse = {
  id: string;
  numero: string;
  servico: string;
  valor: number;
  emissao: string;
  status: string;
  xmlUrl: string | null;
  criadoEm: string;
  usuarioId: string;
  clienteId: string | null;
  cliente?: Cliente | null;
};

export type Das = {
  id: string;
  competencia: string;
  vencimento: string;
  valor: number;
  pagamento: string | null;
  status: string;
  criadoEm: string;
  usuarioId: string;
};
