// Tipos e dados fictícios PassoFirme

export type Categoria =
  | "Couro"
  | "Solados"
  | "Palmilhas"
  | "Cola"
  | "Linhas"
  | "Aviamentos"
  | "Embalagens";

export const CATEGORIAS: Categoria[] = [
  "Couro",
  "Solados",
  "Palmilhas",
  "Cola",
  "Linhas",
  "Aviamentos",
  "Embalagens",
];

export interface Fornecedor {
  id: string;
  nome: string;
  categoria: Categoria;
  cidade: string;
  estado: string;
  qualidade: number; // 0-10
  entrega: number;
  preco: number;
  atendimento: number;
  leadTime: number; // dias
  otif: number; // %
}

export interface Solicitacao {
  id: string;
  numero: string;
  solicitante: string;
  item: string;
  quantidade: number;
  data: string;
  centroCusto: string;
  urgencia: "Baixa" | "Média" | "Alta" | "Crítica";
  status: "Aberta" | "Em Aprovação" | "Cotando" | "Aprovada" | "Cancelada";
}

export interface Cotacao {
  id: string;
  numero: string;
  item: string;
  quantidade: number;
  fornecedorId: string;
  precoUnitario: number;
  frete: number;
  prazo: number;
  condicao: string;
}

export interface PedidoCompra {
  id: string;
  numero: string;
  fornecedorId: string;
  categoria: Categoria;
  valor: number;
  emissao: string; // YYYY-MM-DD
  entregaPrevista: string;
  entregaRealizada?: string;
  status: "Emitido" | "Confirmado" | "Em Transporte" | "Recebido" | "Atrasado";
  completo: boolean;
  precoAnterior?: number;
  precoAtual?: number;
  quantidade?: number;
}

export interface MateriaPrima {
  id: string;
  sku: string;
  nome: string;
  categoria: Categoria;
  estoqueAtual: number;
  consumoMedioDiario: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  leadTime: number;
  estoqueSeguranca: number;
  custoUnitario: number;
  ultimaMovimentacao: string;
}

export interface ProdutoAcabado {
  id: string;
  codigo: string;
  produto: string;
  cor: string;
  numeracao: string;
  quantidade: number;
}

// ---- Seeds ----

export const fornecedoresSeed: Fornecedor[] = [
  { id: "f1", nome: "CouroMax", categoria: "Couro", cidade: "Franca", estado: "SP", qualidade: 9.2, entrega: 8.8, preco: 7.5, atendimento: 9.0, leadTime: 7, otif: 92 },
  { id: "f2", nome: "Solados Brasil", categoria: "Solados", cidade: "Novo Hamburgo", estado: "RS", qualidade: 8.5, entrega: 7.2, preco: 8.0, atendimento: 8.5, leadTime: 10, otif: 78 },
  { id: "f3", nome: "ColaFlex", categoria: "Cola", cidade: "Joinville", estado: "SC", qualidade: 8.8, entrega: 9.0, preco: 8.2, atendimento: 8.7, leadTime: 5, otif: 95 },
  { id: "f4", nome: "Palmilhas Prime", categoria: "Palmilhas", cidade: "Birigui", estado: "SP", qualidade: 9.0, entrega: 8.5, preco: 7.8, atendimento: 9.2, leadTime: 6, otif: 90 },
  { id: "f5", nome: "NylonTech", categoria: "Linhas", cidade: "Blumenau", estado: "SC", qualidade: 9.4, entrega: 9.1, preco: 8.6, atendimento: 9.0, leadTime: 4, otif: 96 },
  { id: "f6", nome: "Componentes Nova Era", categoria: "Aviamentos", cidade: "São Paulo", estado: "SP", qualidade: 8.0, entrega: 8.2, preco: 8.8, atendimento: 8.0, leadTime: 8, otif: 85 },
];

export function calcIQF(f: Pick<Fornecedor, "qualidade" | "entrega" | "preco" | "atendimento">) {
  return +(f.qualidade * 0.4 + f.entrega * 0.3 + f.preco * 0.2 + f.atendimento * 0.1).toFixed(2);
}

const solicitantes = ["Ana Souza", "Carlos Lima", "Marina Reis", "Pedro Alves", "Juliana Castro", "Rafael Mendes"];
const centros = ["Produção A", "Produção B", "PCP", "Manutenção", "Modelagem"];
const itensMP = ["Couro Preto Premium", "Solado EVA Branco", "Linha Nylon 0.8", "Cola PU Industrial", "Palmilha Comfort", "Ilhós Metálico", "Caixa Padrão 30cm"];
const statusSol: Solicitacao["status"][] = ["Aberta", "Em Aprovação", "Cotando", "Aprovada", "Cancelada"];
const urgencias: Solicitacao["urgencia"][] = ["Baixa", "Média", "Alta", "Crítica"];

export const solicitacoesSeed: Solicitacao[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * 45));
  return {
    id: `s${i + 1}`,
    numero: `SOL-${String(2400 + i).padStart(5, "0")}`,
    solicitante: solicitantes[i % solicitantes.length],
    item: itensMP[i % itensMP.length],
    quantidade: 50 + Math.floor(Math.random() * 500),
    data: d.toISOString().slice(0, 10),
    centroCusto: centros[i % centros.length],
    urgencia: urgencias[i % urgencias.length],
    status: statusSol[i % statusSol.length],
  };
});

export const cotacoesSeed: Cotacao[] = Array.from({ length: 18 }, (_, i) => ({
  id: `c${i + 1}`,
  numero: `COT-${String(1200 + i).padStart(5, "0")}`,
  item: itensMP[i % itensMP.length],
  quantidade: 100 + Math.floor(Math.random() * 400),
  fornecedorId: fornecedoresSeed[i % fornecedoresSeed.length].id,
  precoUnitario: +(10 + Math.random() * 90).toFixed(2),
  frete: +(50 + Math.random() * 300).toFixed(2),
  prazo: 3 + Math.floor(Math.random() * 14),
  condicao: ["30 dias", "28/56 dias", "À vista", "45 dias"][i % 4],
}));

const statusPC: PedidoCompra["status"][] = ["Emitido", "Confirmado", "Em Transporte", "Recebido", "Atrasado"];
export const pedidosSeed: PedidoCompra[] = Array.from({ length: 24 }, (_, i) => {
  const emiss = new Date();
  emiss.setMonth(emiss.getMonth() - Math.floor(Math.random() * 12));
  emiss.setDate(1 + Math.floor(Math.random() * 27));
  const prev = new Date(emiss);
  prev.setDate(prev.getDate() + 7 + Math.floor(Math.random() * 14));
  const status = statusPC[i % statusPC.length];
  const recebido = status === "Recebido";
  const realiz = recebido ? new Date(prev) : undefined;
  if (realiz) realiz.setDate(realiz.getDate() + (Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 6)));
  const f = fornecedoresSeed[i % fornecedoresSeed.length];
  const qtd = 100 + Math.floor(Math.random() * 600);
  const precoAtual = +(15 + Math.random() * 90).toFixed(2);
  const precoAnterior = +(precoAtual * (1 + (Math.random() * 0.2 - 0.02))).toFixed(2);
  return {
    id: `p${i + 1}`,
    numero: `OC-${String(8400 + i).padStart(5, "0")}`,
    fornecedorId: f.id,
    categoria: f.categoria,
    valor: +(qtd * precoAtual).toFixed(2),
    emissao: emiss.toISOString().slice(0, 10),
    entregaPrevista: prev.toISOString().slice(0, 10),
    entregaRealizada: realiz?.toISOString().slice(0, 10),
    status,
    completo: Math.random() > 0.15,
    precoAnterior,
    precoAtual,
    quantidade: qtd,
  };
});

export const materiasSeed: MateriaPrima[] = [
  { id: "m1", sku: "MP-001", nome: "Couro Preto Premium", categoria: "Couro", estoqueAtual: 120, consumoMedioDiario: 18, estoqueMinimo: 200, estoqueMaximo: 1200, leadTime: 7, estoqueSeguranca: 80, custoUnitario: 45.5, ultimaMovimentacao: "2026-05-26" },
  { id: "m2", sku: "MP-002", nome: "Solado EVA Branco", categoria: "Solados", estoqueAtual: 850, consumoMedioDiario: 60, estoqueMinimo: 400, estoqueMaximo: 2000, leadTime: 10, estoqueSeguranca: 200, custoUnitario: 12.3, ultimaMovimentacao: "2026-05-28" },
  { id: "m3", sku: "MP-003", nome: "Linha Nylon 0.8", categoria: "Linhas", estoqueAtual: 320, consumoMedioDiario: 8, estoqueMinimo: 150, estoqueMaximo: 800, leadTime: 4, estoqueSeguranca: 50, custoUnitario: 6.2, ultimaMovimentacao: "2026-05-29" },
  { id: "m4", sku: "MP-004", nome: "Cola PU Industrial", categoria: "Cola", estoqueAtual: 40, consumoMedioDiario: 12, estoqueMinimo: 80, estoqueMaximo: 400, leadTime: 5, estoqueSeguranca: 30, custoUnitario: 22.0, ultimaMovimentacao: "2026-05-20" },
  { id: "m5", sku: "MP-005", nome: "Palmilha Comfort", categoria: "Palmilhas", estoqueAtual: 1200, consumoMedioDiario: 35, estoqueMinimo: 500, estoqueMaximo: 2500, leadTime: 6, estoqueSeguranca: 150, custoUnitario: 9.8, ultimaMovimentacao: "2026-02-10" },
];

export const produtosSeed: ProdutoAcabado[] = [
  { id: "pa1", codigo: "TR-001", produto: "Tênis Runner", cor: "Preto", numeracao: "40", quantidade: 320 },
  { id: "pa2", codigo: "TR-002", produto: "Tênis Runner", cor: "Branco", numeracao: "41", quantidade: 210 },
  { id: "pa3", codigo: "TU-001", produto: "Tênis Urban", cor: "Cinza", numeracao: "39", quantidade: 180 },
  { id: "pa4", codigo: "TU-002", produto: "Tênis Urban", cor: "Azul", numeracao: "42", quantidade: 145 },
  { id: "pa5", codigo: "SE-001", produto: "Sapato Executivo", cor: "Preto", numeracao: "41", quantidade: 95 },
  { id: "pa6", codigo: "SE-002", produto: "Sapato Executivo", cor: "Marrom", numeracao: "42", quantidade: 78 },
  { id: "pa7", codigo: "SC-001", produto: "Sandália Comfort", cor: "Bege", numeracao: "37", quantidade: 240 },
  { id: "pa8", codigo: "SC-002", produto: "Sandália Comfort", cor: "Preto", numeracao: "38", quantidade: 188 },
];
