// Tipos e dados fictícios PassoFirme

export type CategoriaMP =
  | "Couro"
  | "Solados"
  | "Linhas e Cadarços"
  | "Colas e Químicos"
  | "Palmilhas"
  | "Embalagens"
  | "Aviamentos";

// Compat: o nome antigo "Categoria" continua existindo
export type Categoria = CategoriaMP;

export const CATEGORIAS_MP: { nome: CategoriaMP; icon: string }[] = [
  { nome: "Couro", icon: "🟫" },
  { nome: "Solados", icon: "🦶" },
  { nome: "Linhas e Cadarços", icon: "🧵" },
  { nome: "Colas e Químicos", icon: "🧪" },
  { nome: "Palmilhas", icon: "👣" },
  { nome: "Embalagens", icon: "📦" },
  { nome: "Aviamentos", icon: "🔩" },
];

export const CATEGORIAS: CategoriaMP[] = CATEGORIAS_MP.map((c) => c.nome);

export type CategoriaOP =
  | "Limpeza"
  | "Escritório"
  | "EPI"
  | "Manutenção"
  | "Copa e Cozinha"
  | "Tecnologia";

export const CATEGORIAS_OP: { nome: CategoriaOP; icon: string }[] = [
  { nome: "Limpeza", icon: "🧹" },
  { nome: "Escritório", icon: "🖥️" },
  { nome: "EPI", icon: "🦺" },
  { nome: "Manutenção", icon: "🔧" },
  { nome: "Copa e Cozinha", icon: "☕" },
  { nome: "Tecnologia", icon: "💻" },
];

export type Setor =
  | "Produção A"
  | "Produção B"
  | "PCP"
  | "Manutenção"
  | "Modelagem"
  | "Administrativo"
  | "Almoxarifado"
  | "Qualidade";

export const SETORES: Setor[] = [
  "Produção A", "Produção B", "PCP", "Manutenção", "Modelagem", "Administrativo", "Almoxarifado", "Qualidade",
];

export interface Fornecedor {
  id: string;
  nome: string;
  categoria: CategoriaMP;
  cidade: string;
  estado: string;
  qualidade: number;
  entrega: number;
  preco: number;
  atendimento: number;
  leadTime: number;
  otif: number;
  observacoes?: string;
}

export type StatusRequisicao = "Aberta" | "Em Separação" | "Pronta para Retirada" | "Entregue";
export type Prioridade = "Baixa" | "Média" | "Alta" | "Crítica";

export interface Requisicao {
  id: string;
  numero: string;
  setor: Setor;
  itemTipo: "MP" | "OP";
  itemId: string;
  item: string;
  quantidade: number;
  data: string;
  observacao?: string;
  prioridade: Prioridade;
  status: StatusRequisicao;
}

export interface Cotacao {
  id: string;
  numero: string;
  categoria: CategoriaMP;
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
  categoria: CategoriaMP;
  itemId?: string;
  valor: number;
  emissao: string;
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
  categoria: CategoriaMP;
  estoqueAtual: number;
  consumoMedioDiario: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  leadTime: number;
  estoqueSeguranca: number;
  custoUnitario: number;
  ultimaMovimentacao: string;
}

export interface ItemOperacional {
  id: string;
  sku: string;
  nome: string;
  categoria: CategoriaOP;
  estoqueAtual: number;
  consumoMedioDiario: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  leadTime: number;
  estoqueSeguranca: number;
  custoUnitario: number;
  ultimaMovimentacao: string;
}

export type TipoMovimentacao = "Entrada" | "Saída" | "Devolução" | "Ajuste";

export interface Movimentacao {
  id: string;
  data: string;
  itemTipo: "MP" | "OP";
  itemId: string;
  itemNome: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  origem: string; // ex: "Recebimento OC-08412", "Requisição REQ-00012", "Ajuste manual"
  responsavel: string;
  observacao?: string;
}

export interface Planejamento {
  id: string;
  produto: string;
  quantidadePlanejada: number;
  periodoMeses: number;
  inicio: string;
  producaoRealizada: number;
  // demanda agregada por matéria-prima por par produzido
  bom: { materiaId: string; consumoPorUnidade: number }[];
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
  { id: "f1", nome: "CouroMax", categoria: "Couro", cidade: "Franca", estado: "SP", qualidade: 9.2, entrega: 8.8, preco: 7.5, atendimento: 9.0, leadTime: 7, otif: 92, observacoes: "Produto aprovado pela equipe de modelagem. Excelente uniformidade de couro." },
  { id: "f2", nome: "Solados Brasil", categoria: "Solados", cidade: "Novo Hamburgo", estado: "RS", qualidade: 8.5, entrega: 7.2, preco: 8.0, atendimento: 8.5, leadTime: 10, otif: 78, observacoes: "Houve devolução de lote em 03/2026 por divergência de espessura." },
  { id: "f3", nome: "ColaFlex", categoria: "Colas e Químicos", cidade: "Joinville", estado: "SC", qualidade: 8.8, entrega: 9.0, preco: 8.2, atendimento: 8.7, leadTime: 5, otif: 95, observacoes: "Excelente prazo de entrega e suporte técnico." },
  { id: "f4", nome: "Palmilhas Prime", categoria: "Palmilhas", cidade: "Birigui", estado: "SP", qualidade: 9.0, entrega: 8.5, preco: 7.8, atendimento: 9.2, leadTime: 6, otif: 90, observacoes: "Parceria estratégica desde 2022." },
  { id: "f5", nome: "NylonTech", categoria: "Linhas e Cadarços", cidade: "Blumenau", estado: "SC", qualidade: 9.4, entrega: 9.1, preco: 8.6, atendimento: 9.0, leadTime: 4, otif: 96, observacoes: "Recomendado para substituir fornecedores com IQF baixo." },
  { id: "f6", nome: "Componentes Nova Era", categoria: "Aviamentos", cidade: "São Paulo", estado: "SP", qualidade: 8.0, entrega: 8.2, preco: 8.8, atendimento: 8.0, leadTime: 8, otif: 85, observacoes: "Problemas recorrentes de qualidade em ilhós metálicos." },
];

export function calcIQF(f: Pick<Fornecedor, "qualidade" | "entrega" | "preco" | "atendimento">) {
  return +(f.qualidade * 0.4 + f.entrega * 0.3 + f.preco * 0.2 + f.atendimento * 0.1).toFixed(2);
}

export const materiasSeed: MateriaPrima[] = [
  { id: "m1", sku: "MP-001", nome: "Couro Preto Premium", categoria: "Couro", estoqueAtual: 120, consumoMedioDiario: 18, estoqueMinimo: 200, estoqueMaximo: 1200, leadTime: 7, estoqueSeguranca: 80, custoUnitario: 45.5, ultimaMovimentacao: "2026-05-26" },
  { id: "m7", sku: "MP-007", nome: "Couro Marrom Soft", categoria: "Couro", estoqueAtual: 540, consumoMedioDiario: 14, estoqueMinimo: 200, estoqueMaximo: 1200, leadTime: 7, estoqueSeguranca: 70, custoUnitario: 42.0, ultimaMovimentacao: "2026-05-28" },
  { id: "m2", sku: "MP-002", nome: "Solado EVA Branco", categoria: "Solados", estoqueAtual: 850, consumoMedioDiario: 60, estoqueMinimo: 400, estoqueMaximo: 2000, leadTime: 10, estoqueSeguranca: 200, custoUnitario: 12.3, ultimaMovimentacao: "2026-05-28" },
  { id: "m8", sku: "MP-008", nome: "Solado TR Esportivo", categoria: "Solados", estoqueAtual: 320, consumoMedioDiario: 45, estoqueMinimo: 500, estoqueMaximo: 2000, leadTime: 10, estoqueSeguranca: 200, custoUnitario: 15.6, ultimaMovimentacao: "2026-05-25" },
  { id: "m3", sku: "MP-003", nome: "Linha Nylon 0.8", categoria: "Linhas e Cadarços", estoqueAtual: 320, consumoMedioDiario: 8, estoqueMinimo: 150, estoqueMaximo: 800, leadTime: 4, estoqueSeguranca: 50, custoUnitario: 6.2, ultimaMovimentacao: "2026-05-29" },
  { id: "m9", sku: "MP-009", nome: "Cadarço Plano 120cm", categoria: "Linhas e Cadarços", estoqueAtual: 1800, consumoMedioDiario: 25, estoqueMinimo: 600, estoqueMaximo: 3000, leadTime: 5, estoqueSeguranca: 100, custoUnitario: 1.8, ultimaMovimentacao: "2026-05-27" },
  { id: "m4", sku: "MP-004", nome: "Cola PU Industrial", categoria: "Colas e Químicos", estoqueAtual: 40, consumoMedioDiario: 12, estoqueMinimo: 80, estoqueMaximo: 400, leadTime: 5, estoqueSeguranca: 30, custoUnitario: 22.0, ultimaMovimentacao: "2026-05-20" },
  { id: "m5", sku: "MP-005", nome: "Palmilha Comfort", categoria: "Palmilhas", estoqueAtual: 1200, consumoMedioDiario: 35, estoqueMinimo: 500, estoqueMaximo: 2500, leadTime: 6, estoqueSeguranca: 150, custoUnitario: 9.8, ultimaMovimentacao: "2026-02-10" },
  { id: "m10", sku: "MP-010", nome: "Caixa Padrão 30cm", categoria: "Embalagens", estoqueAtual: 4200, consumoMedioDiario: 80, estoqueMinimo: 1500, estoqueMaximo: 6000, leadTime: 6, estoqueSeguranca: 300, custoUnitario: 1.2, ultimaMovimentacao: "2026-05-29" },
  { id: "m11", sku: "MP-011", nome: "Ilhós Metálico Nº4", categoria: "Aviamentos", estoqueAtual: 9500, consumoMedioDiario: 220, estoqueMinimo: 4000, estoqueMaximo: 20000, leadTime: 8, estoqueSeguranca: 500, custoUnitario: 0.15, ultimaMovimentacao: "2026-05-28" },
];

export const itensOperacionalSeed: ItemOperacional[] = [
  { id: "o1", sku: "OP-001", nome: "Detergente Industrial 5L", categoria: "Limpeza", estoqueAtual: 18, consumoMedioDiario: 0.4, estoqueMinimo: 10, estoqueMaximo: 60, leadTime: 5, estoqueSeguranca: 4, custoUnitario: 28, ultimaMovimentacao: "2026-05-22" },
  { id: "o2", sku: "OP-002", nome: "Pano Multiuso (pct 50)", categoria: "Limpeza", estoqueAtual: 4, consumoMedioDiario: 0.6, estoqueMinimo: 8, estoqueMaximo: 40, leadTime: 4, estoqueSeguranca: 2, custoUnitario: 22, ultimaMovimentacao: "2026-05-26" },
  { id: "o3", sku: "OP-010", nome: "Papel A4 (resma)", categoria: "Escritório", estoqueAtual: 65, consumoMedioDiario: 1.2, estoqueMinimo: 20, estoqueMaximo: 120, leadTime: 3, estoqueSeguranca: 6, custoUnitario: 32, ultimaMovimentacao: "2026-05-24" },
  { id: "o4", sku: "OP-011", nome: "Cartucho Toner", categoria: "Escritório", estoqueAtual: 3, consumoMedioDiario: 0.05, estoqueMinimo: 4, estoqueMaximo: 12, leadTime: 7, estoqueSeguranca: 1, custoUnitario: 280, ultimaMovimentacao: "2026-05-18" },
  { id: "o5", sku: "OP-020", nome: "Luva de Vaqueta", categoria: "EPI", estoqueAtual: 84, consumoMedioDiario: 1.8, estoqueMinimo: 50, estoqueMaximo: 250, leadTime: 5, estoqueSeguranca: 15, custoUnitario: 14, ultimaMovimentacao: "2026-05-28" },
  { id: "o6", sku: "OP-021", nome: "Óculos de Proteção", categoria: "EPI", estoqueAtual: 22, consumoMedioDiario: 0.3, estoqueMinimo: 20, estoqueMaximo: 80, leadTime: 6, estoqueSeguranca: 6, custoUnitario: 18, ultimaMovimentacao: "2026-05-15" },
  { id: "o7", sku: "OP-030", nome: "Óleo Lubrificante 1L", categoria: "Manutenção", estoqueAtual: 12, consumoMedioDiario: 0.5, estoqueMinimo: 10, estoqueMaximo: 50, leadTime: 5, estoqueSeguranca: 3, custoUnitario: 36, ultimaMovimentacao: "2026-05-19" },
  { id: "o8", sku: "OP-031", nome: "Correia Industrial", categoria: "Manutenção", estoqueAtual: 5, consumoMedioDiario: 0.1, estoqueMinimo: 4, estoqueMaximo: 15, leadTime: 10, estoqueSeguranca: 2, custoUnitario: 145, ultimaMovimentacao: "2026-04-30" },
  { id: "o9", sku: "OP-040", nome: "Café Tradicional 500g", categoria: "Copa e Cozinha", estoqueAtual: 30, consumoMedioDiario: 1.5, estoqueMinimo: 15, estoqueMaximo: 80, leadTime: 3, estoqueSeguranca: 5, custoUnitario: 18, ultimaMovimentacao: "2026-05-29" },
  { id: "o10", sku: "OP-041", nome: "Açúcar 1kg", categoria: "Copa e Cozinha", estoqueAtual: 8, consumoMedioDiario: 0.6, estoqueMinimo: 10, estoqueMaximo: 40, leadTime: 3, estoqueSeguranca: 3, custoUnitario: 6, ultimaMovimentacao: "2026-05-27" },
  { id: "o11", sku: "OP-050", nome: "Cabo HDMI 2m", categoria: "Tecnologia", estoqueAtual: 14, consumoMedioDiario: 0.1, estoqueMinimo: 5, estoqueMaximo: 25, leadTime: 5, estoqueSeguranca: 2, custoUnitario: 28, ultimaMovimentacao: "2026-05-10" },
  { id: "o12", sku: "OP-051", nome: "Mouse USB", categoria: "Tecnologia", estoqueAtual: 6, consumoMedioDiario: 0.08, estoqueMinimo: 6, estoqueMaximo: 20, leadTime: 5, estoqueSeguranca: 2, custoUnitario: 45, ultimaMovimentacao: "2026-05-12" },
];

const prioridades: Prioridade[] = ["Baixa", "Média", "Alta", "Crítica"];
const statusReq: StatusRequisicao[] = ["Aberta", "Em Separação", "Pronta para Retirada", "Entregue"];

export const requisicoesSeed: Requisicao[] = Array.from({ length: 18 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * 30));
  const useMp = i % 3 !== 0;
  const fonte = useMp ? materiasSeed : itensOperacionalSeed;
  const item = fonte[i % fonte.length];
  return {
    id: `r${i + 1}`,
    numero: `REQ-${String(1000 + i).padStart(5, "0")}`,
    setor: SETORES[i % SETORES.length],
    itemTipo: useMp ? "MP" : "OP",
    itemId: item.id,
    item: item.nome,
    quantidade: 5 + Math.floor(Math.random() * 80),
    data: d.toISOString().slice(0, 10),
    observacao: i % 4 === 0 ? "Urgente para produção do lote semanal" : undefined,
    prioridade: prioridades[i % prioridades.length],
    status: statusReq[i % statusReq.length],
  };
});

const itensMP = ["Couro Preto Premium", "Solado EVA Branco", "Linha Nylon 0.8", "Cola PU Industrial", "Palmilha Comfort", "Ilhós Metálico Nº4", "Caixa Padrão 30cm"];

export const cotacoesSeed: Cotacao[] = Array.from({ length: 18 }, (_, i) => {
  const f = fornecedoresSeed[i % fornecedoresSeed.length];
  return {
    id: `c${i + 1}`,
    numero: `COT-${String(1200 + i).padStart(5, "0")}`,
    categoria: f.categoria,
    item: itensMP[i % itensMP.length],
    quantidade: 100 + Math.floor(Math.random() * 400),
    fornecedorId: f.id,
    precoUnitario: +(10 + Math.random() * 90).toFixed(2),
    frete: +(50 + Math.random() * 300).toFixed(2),
    prazo: 3 + Math.floor(Math.random() * 14),
    condicao: ["30 dias", "28/56 dias", "À vista", "45 dias"][i % 4],
  };
});

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
  const mp = materiasSeed.find((m) => m.categoria === f.categoria) ?? materiasSeed[i % materiasSeed.length];
  const qtd = 100 + Math.floor(Math.random() * 600);
  const precoAtual = +(15 + Math.random() * 90).toFixed(2);
  const precoAnterior = +(precoAtual * (1 + (Math.random() * 0.2 - 0.02))).toFixed(2);
  return {
    id: `p${i + 1}`,
    numero: `OC-${String(8400 + i).padStart(5, "0")}`,
    fornecedorId: f.id,
    categoria: f.categoria,
    itemId: mp.id,
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

export const movimentacoesSeed: Movimentacao[] = [
  { id: "mv1", data: "2026-05-28", itemTipo: "MP", itemId: "m2", itemNome: "Solado EVA Branco", tipo: "Entrada", quantidade: 400, origem: "Recebimento OC-08405", responsavel: "Almoxarifado" },
  { id: "mv2", data: "2026-05-28", itemTipo: "MP", itemId: "m1", itemNome: "Couro Preto Premium", tipo: "Saída", quantidade: 60, origem: "Requisição REQ-01003", responsavel: "Almoxarifado" },
  { id: "mv3", data: "2026-05-27", itemTipo: "OP", itemId: "o5", itemNome: "Luva de Vaqueta", tipo: "Saída", quantidade: 12, origem: "Requisição REQ-01005", responsavel: "Almoxarifado" },
  { id: "mv4", data: "2026-05-26", itemTipo: "MP", itemId: "m4", itemNome: "Cola PU Industrial", tipo: "Devolução", quantidade: 8, origem: "Sobra produção", responsavel: "PCP" },
  { id: "mv5", data: "2026-05-25", itemTipo: "MP", itemId: "m11", itemNome: "Ilhós Metálico Nº4", tipo: "Ajuste", quantidade: -150, origem: "Inventário cíclico", responsavel: "Qualidade", observacao: "Diferença identificada em contagem" },
];

export const planejamentosSeed: Planejamento[] = [
  {
    id: "pl1", produto: "Tênis Runner", quantidadePlanejada: 500, periodoMeses: 3,
    inicio: "2026-05-01", producaoRealizada: 180,
    bom: [
      { materiaId: "m1", consumoPorUnidade: 0.4 },
      { materiaId: "m2", consumoPorUnidade: 1 },
      { materiaId: "m3", consumoPorUnidade: 0.05 },
      { materiaId: "m5", consumoPorUnidade: 1 },
      { materiaId: "m10", consumoPorUnidade: 1 },
    ],
  },
  {
    id: "pl2", produto: "Tênis Urban", quantidadePlanejada: 350, periodoMeses: 2,
    inicio: "2026-05-10", producaoRealizada: 95,
    bom: [
      { materiaId: "m7", consumoPorUnidade: 0.35 },
      { materiaId: "m8", consumoPorUnidade: 1 },
      { materiaId: "m9", consumoPorUnidade: 2 },
      { materiaId: "m11", consumoPorUnidade: 8 },
      { materiaId: "m10", consumoPorUnidade: 1 },
    ],
  },
  {
    id: "pl3", produto: "Sapato Executivo", quantidadePlanejada: 200, periodoMeses: 3,
    inicio: "2026-04-15", producaoRealizada: 140,
    bom: [
      { materiaId: "m1", consumoPorUnidade: 0.45 },
      { materiaId: "m4", consumoPorUnidade: 0.08 },
      { materiaId: "m5", consumoPorUnidade: 1 },
      { materiaId: "m10", consumoPorUnidade: 1 },
    ],
  },
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
