// Tipos e dados fictícios PassoFirme
// IMPORTANTE: seeds determinísticos (PRNG + data fixa) para evitar hydration mismatch SSR.

const TODAY = new Date("2026-05-31T12:00:00Z");
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260531);
const rint = (min: number, max: number) => Math.floor(rnd() * (max - min + 1)) + min;
const rfloat = (min: number, max: number) => +(rnd() * (max - min) + min).toFixed(2);
const daysAgo = (n: number) => {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

export type CategoriaMP =
  | "Couro" | "Solados" | "Linhas e Cadarços" | "Colas e Químicos"
  | "Palmilhas" | "Embalagens" | "Aviamentos";
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
  | "Limpeza" | "Escritório" | "EPI" | "Manutenção" | "Copa e Cozinha" | "Tecnologia";
export const CATEGORIAS_OP: { nome: CategoriaOP; icon: string }[] = [
  { nome: "Limpeza", icon: "🧹" },
  { nome: "Escritório", icon: "🖥️" },
  { nome: "EPI", icon: "🦺" },
  { nome: "Manutenção", icon: "🔧" },
  { nome: "Copa e Cozinha", icon: "☕" },
  { nome: "Tecnologia", icon: "💻" },
];

export type Setor =
  | "Produção A" | "Produção B" | "PCP" | "Manutenção"
  | "Modelagem" | "Administrativo" | "Almoxarifado" | "Qualidade";
export const SETORES: Setor[] = [
  "Produção A", "Produção B", "PCP", "Manutenção", "Modelagem", "Administrativo", "Almoxarifado", "Qualidade",
];

export interface Fornecedor {
  id: string; nome: string; categoria: CategoriaMP; cidade: string; estado: string;
  qualidade: number; entrega: number; preco: number; atendimento: number;
  leadTime: number; otif: number; observacoes?: string;
}

export type StatusRequisicao = "Aberta" | "Em Separação" | "Pronta para Retirada" | "Entregue";
export type Prioridade = "Baixa" | "Média" | "Alta" | "Crítica";

export interface Requisicao {
  id: string; numero: string; setor: Setor;
  itemTipo: "MP" | "OP"; itemId: string; item: string;
  quantidade: number; data: string; observacao?: string;
  prioridade: Prioridade; status: StatusRequisicao;
}

export interface Cotacao {
  id: string; numero: string; categoria: CategoriaMP; item: string;
  quantidade: number; fornecedorId: string; precoUnitario: number;
  frete: number; prazo: number; condicao: string;
}

export type ClassificacaoPedido = "MP" | "Operacional";
export type StatusConferencia = "Conferido" | "Pendente" | "Com divergência";

export interface PedidoCompra {
  id: string; numero: string; fornecedorId: string; categoria: string;
  classificacao: ClassificacaoPedido;
  itemId?: string; itemNome?: string;
  valor: number; emissao: string; entregaPrevista: string;
  entregaRealizada?: string;
  status: "Emitido" | "Confirmado" | "Em Transporte" | "Recebido" | "Atrasado";
  completo: boolean; precoAnterior?: number; precoAtual?: number; quantidade?: number;
  statusConferencia?: StatusConferencia;
}

export type SituacaoDevolucao = "Aguardando crédito" | "Em análise" | "Concluída";
export interface DevolucaoFornecedor {
  id: string; data: string;
  itemNome: string; categoria: CategoriaMP; fornecedorId: string;
  motivo: string; quantidade: number; valor: number;
  situacao: SituacaoDevolucao;
}

export interface MateriaPrima {
  id: string; sku: string; nome: string; categoria: CategoriaMP;
  estoqueAtual: number; consumoMedioDiario: number; estoqueMinimo: number; estoqueMaximo: number;
  leadTime: number; estoqueSeguranca: number; custoUnitario: number; ultimaMovimentacao: string;
}

export interface ItemOperacional {
  id: string; sku: string; nome: string; categoria: CategoriaOP;
  estoqueAtual: number; consumoMedioDiario: number; estoqueMinimo: number; estoqueMaximo: number;
  leadTime: number; estoqueSeguranca: number; custoUnitario: number; ultimaMovimentacao: string;
}

export type TipoMovimentacao = "Entrada" | "Saída" | "Devolução" | "Ajuste";

export interface Movimentacao {
  id: string; data: string; itemTipo: "MP" | "OP"; itemId: string; itemNome: string;
  tipo: TipoMovimentacao; quantidade: number; origem: string; responsavel: string; observacao?: string;
}

export interface Planejamento {
  id: string; produto: string; quantidadePlanejada: number; periodoMeses: number;
  inicio: string; producaoRealizada: number;
  bom: { materiaId: string; consumoPorUnidade: number }[];
}

export interface ProdutoAcabado {
  id: string; codigo: string; produto: string; cor: string; numeracao: string; quantidade: number;
}

// ====== NOVOS TIPOS ======

export type EstagioB2B = "Lead" | "Primeiro Contato" | "Negociação" | "Proposta" | "Pedido Fechado" | "Perdido";
export type EstagioB2C = "Atendimento" | "Orçamento" | "Negociação" | "Venda" | "Perdido";

export interface ClienteB2B {
  id: string; empresa: string; contato: string; cidade: string; estado: string;
  valor: number; estagio: EstagioB2B; ultimoContato: string;
}
export interface ClienteB2C {
  id: string; nome: string; cidade: string; telefone: string;
  valor: number; estagio: EstagioB2C; ultimoContato: string;
}

export type StatusPedidoVenda = "Negociação" | "Reservado" | "Produção" | "Pronto para envio" | "Finalizado";
export interface PedidoVenda {
  id: string; numero: string; cliente: string; canal: "B2B" | "B2C";
  produtoId: string; produto: string; quantidade: number; valor: number;
  emissao: string; previsaoEntrega: string; status: StatusPedidoVenda;
}

export type StatusOP = "Planejada" | "Em Produção" | "Concluída" | "Atrasada";
export interface OrdemProducao {
  id: string; numero: string; produto: string; produtoId?: string;
  quantidadePlanejada: number; quantidadeProduzida: number;
  dataInicio: string; dataFim: string; status: StatusOP;
  retrabalho: number; operadores: number;
}

export type EtapaProducao = "Corte" | "Pesponto" | "Montagem" | "Acabamento";
export type StatusGargalo = "Normal" | "Atenção" | "Atrasado";
export interface Gargalo {
  id: string; etapa: EtapaProducao; status: StatusGargalo; observacao: string; capacidadeUso: number;
}

export interface Observacao {
  id: string; data: string; titulo: string; categoria: "Estoque" | "Compras" | "Produção" | "Vendas" | "Qualidade";
  texto: string; impacto: "Baixo" | "Médio" | "Alto";
}

export type StatusPlano = "Aberto" | "Em andamento" | "Concluído" | "Atrasado";
export interface PlanoAcao {
  id: string; problema: string; responsavel: string; prazo: string; status: StatusPlano;
}

export interface Sugestao {
  id: string; titulo: string; descricao: string;
  categoria: "Eficiência" | "Custo" | "Qualidade" | "Processo";
  potencialEconomia?: number;
}

export interface MelhoriaHistorico {
  id: string; titulo: string; data: string; ganho: string;
}

// ====== SEEDS ======

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
    quantidade: 5 + rint(0, 79),
    data: daysAgo(rint(0, 29)),
    observacao: i % 4 === 0 ? "Urgente para produção do lote semanal" : undefined,
    prioridade: prioridades[i % prioridades.length],
    status: statusReq[i % statusReq.length],
  };
});



export const cotacoesSeed: Cotacao[] = Array.from({ length: 28 }, (_, i) => {
  // ancorar cotação no item (matéria-prima): a categoria da cotação é SEMPRE a do item
  const mp = materiasSeed[i % materiasSeed.length];
  // fornecedores podem cobrir várias categorias; preferimos um da mesma categoria, mas
  // permitimos múltiplos fornecedores por item para gerar comparativos.
  const fornsCat = fornecedoresSeed.filter((f) => f.categoria === mp.categoria);
  const f = (fornsCat.length ? fornsCat : fornecedoresSeed)[i % (fornsCat.length || fornecedoresSeed.length)];
  return {
    id: `c${i + 1}`,
    numero: `COT-${String(1200 + i).padStart(5, "0")}`,
    categoria: mp.categoria,
    item: mp.nome,
    quantidade: 100 + rint(0, 399),
    fornecedorId: f.id,
    precoUnitario: +(mp.custoUnitario * (0.9 + rnd() * 0.3)).toFixed(2),
    frete: rfloat(50, 349),
    prazo: 3 + rint(0, 13),
    condicao: ["30 dias", "28/56 dias", "À vista", "45 dias"][i % 4],
  };
});

const statusPC: PedidoCompra["status"][] = ["Emitido", "Confirmado", "Em Transporte", "Recebido", "Atrasado"];
const statusConf: StatusConferencia[] = ["Conferido", "Pendente", "Com divergência"];
const opItems = [
  { nome: "Luva de Vaqueta", cat: "EPI" as const },
  { nome: "Detergente Industrial 5L", cat: "Limpeza" as const },
  { nome: "Papel A4 (resma)", cat: "Escritório" as const },
  { nome: "Óleo Lubrificante 1L", cat: "Manutenção" as const },
  { nome: "Cartucho Toner", cat: "Escritório" as const },
];
export const pedidosSeed: PedidoCompra[] = Array.from({ length: 28 }, (_, i) => {
  const monthsAgo = rint(0, 11);
  const dayInMonth = 1 + rint(0, 26);
  const emiss = new Date(TODAY);
  emiss.setUTCMonth(emiss.getUTCMonth() - monthsAgo);
  emiss.setUTCDate(dayInMonth);
  const prev = new Date(emiss);
  prev.setUTCDate(prev.getUTCDate() + 7 + rint(0, 13));
  const status = statusPC[i % statusPC.length];
  const recebido = status === "Recebido";
  const realiz = recebido ? new Date(prev) : undefined;
  if (realiz) realiz.setUTCDate(realiz.getUTCDate() + (rnd() < 0.7 ? 0 : rint(0, 5)));
  const isOp = i % 5 === 0;
  const qtd = 100 + rint(0, 599);
  const precoAtual = rfloat(15, 104);
  const precoAnterior = +(precoAtual * (1 + (rnd() * 0.2 - 0.02))).toFixed(2);
  if (isOp) {
    const it = opItems[i % opItems.length];
    const f = fornecedoresSeed[i % fornecedoresSeed.length];
    return {
      id: `p${i + 1}`,
      numero: `OC-${String(8400 + i).padStart(5, "0")}`,
      fornecedorId: f.id,
      categoria: it.cat,
      classificacao: "Operacional",
      itemNome: it.nome,
      valor: +(qtd * precoAtual).toFixed(2),
      emissao: emiss.toISOString().slice(0, 10),
      entregaPrevista: prev.toISOString().slice(0, 10),
      entregaRealizada: realiz?.toISOString().slice(0, 10),
      status,
      completo: rnd() > 0.15,
      precoAnterior,
      precoAtual,
      quantidade: qtd,
      statusConferencia: recebido ? statusConf[i % statusConf.length] : undefined,
    } as PedidoCompra;
  }
  const f = fornecedoresSeed[i % fornecedoresSeed.length];
  const mp = materiasSeed.find((m) => m.categoria === f.categoria) ?? materiasSeed[i % materiasSeed.length];
  return {
    id: `p${i + 1}`,
    numero: `OC-${String(8400 + i).padStart(5, "0")}`,
    fornecedorId: f.id,
    categoria: mp.categoria,
    classificacao: "MP",
    itemId: mp.id,
    itemNome: mp.nome,
    valor: +(qtd * precoAtual).toFixed(2),
    emissao: emiss.toISOString().slice(0, 10),
    entregaPrevista: prev.toISOString().slice(0, 10),
    entregaRealizada: realiz?.toISOString().slice(0, 10),
    status,
    completo: rnd() > 0.15,
    precoAnterior,
    precoAtual,
    quantidade: qtd,
    statusConferencia: recebido ? statusConf[i % statusConf.length] : undefined,
  };
});

export const devolucoesFornecedorSeed: DevolucaoFornecedor[] = [
  { id: "dv1", data: daysAgo(4), itemNome: "Solado EVA Branco", categoria: "Solados", fornecedorId: "f2", motivo: "Qualidade fora do padrão (espessura)", quantidade: 80, valor: 80 * 12.3, situacao: "Aguardando crédito" },
  { id: "dv2", data: daysAgo(12), itemNome: "Ilhós Metálico Nº4", categoria: "Aviamentos", fornecedorId: "f6", motivo: "Defeito de acabamento em ilhós", quantidade: 1500, valor: 1500 * 0.15, situacao: "Em análise" },
  { id: "dv3", data: daysAgo(22), itemNome: "Couro Preto Premium", categoria: "Couro", fornecedorId: "f1", motivo: "Quantidade incorreta no recebimento", quantidade: 15, valor: 15 * 45.5, situacao: "Concluída" },
];

export const movimentacoesSeed: Movimentacao[] = [
  { id: "mv1", data: "2026-05-28", itemTipo: "MP", itemId: "m2", itemNome: "Solado EVA Branco", tipo: "Entrada", quantidade: 400, origem: "Recebimento OC-08405", responsavel: "Almoxarifado" },
  { id: "mv2", data: "2026-05-28", itemTipo: "MP", itemId: "m1", itemNome: "Couro Preto Premium", tipo: "Saída", quantidade: 60, origem: "Requisição REQ-01003", responsavel: "Almoxarifado" },
  { id: "mv3", data: "2026-05-27", itemTipo: "OP", itemId: "o5", itemNome: "Luva de Vaqueta", tipo: "Saída", quantidade: 12, origem: "Requisição REQ-01005", responsavel: "Almoxarifado" },
  { id: "mv4", data: "2026-05-26", itemTipo: "MP", itemId: "m4", itemNome: "Cola PU Industrial", tipo: "Devolução", quantidade: 8, origem: "Sobra produção", responsavel: "PCP" },
  { id: "mv5", data: "2026-05-25", itemTipo: "MP", itemId: "m11", itemNome: "Ilhós Metálico Nº4", tipo: "Ajuste", quantidade: -150, origem: "Inventário cíclico", responsavel: "Qualidade", observacao: "Diferença identificada em contagem" },
];

export const planejamentosSeed: Planejamento[] = [
  { id: "pl1", produto: "Tênis Runner", quantidadePlanejada: 500, periodoMeses: 3, inicio: "2026-05-01", producaoRealizada: 180,
    bom: [{ materiaId: "m1", consumoPorUnidade: 0.4 }, { materiaId: "m2", consumoPorUnidade: 1 }, { materiaId: "m3", consumoPorUnidade: 0.05 }, { materiaId: "m5", consumoPorUnidade: 1 }, { materiaId: "m10", consumoPorUnidade: 1 }] },
  { id: "pl2", produto: "Tênis Urban", quantidadePlanejada: 350, periodoMeses: 2, inicio: "2026-05-10", producaoRealizada: 95,
    bom: [{ materiaId: "m7", consumoPorUnidade: 0.35 }, { materiaId: "m8", consumoPorUnidade: 1 }, { materiaId: "m9", consumoPorUnidade: 2 }, { materiaId: "m11", consumoPorUnidade: 8 }, { materiaId: "m10", consumoPorUnidade: 1 }] },
  { id: "pl3", produto: "Sapato Executivo", quantidadePlanejada: 200, periodoMeses: 3, inicio: "2026-04-15", producaoRealizada: 140,
    bom: [{ materiaId: "m1", consumoPorUnidade: 0.45 }, { materiaId: "m4", consumoPorUnidade: 0.08 }, { materiaId: "m5", consumoPorUnidade: 1 }, { materiaId: "m10", consumoPorUnidade: 1 }] },
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

// ====== SEEDS NOVOS ======

const estagiosB2B: EstagioB2B[] = ["Lead", "Primeiro Contato", "Negociação", "Proposta", "Pedido Fechado", "Perdido"];
const estagiosB2C: EstagioB2C[] = ["Atendimento", "Orçamento", "Negociação", "Venda", "Perdido"];

export const clientesB2BSeed: ClienteB2B[] = [
  { id: "b1", empresa: "Calçados Líder LTDA", contato: "Maria Souza", cidade: "São Paulo", estado: "SP", valor: 48500, estagio: "Pedido Fechado", ultimoContato: daysAgo(2) },
  { id: "b2", empresa: "Rede Pisa Bem", contato: "João Almeida", cidade: "Belo Horizonte", estado: "MG", valor: 73200, estagio: "Negociação", ultimoContato: daysAgo(5) },
  { id: "b3", empresa: "Magazine Passos", contato: "Carla Lima", cidade: "Curitiba", estado: "PR", valor: 31000, estagio: "Proposta", ultimoContato: daysAgo(1) },
  { id: "b4", empresa: "Distribuidora Norte", contato: "Roberto Silva", cidade: "Manaus", estado: "AM", valor: 95400, estagio: "Lead", ultimoContato: daysAgo(7) },
  { id: "b5", empresa: "Sapataria Central", contato: "Ana Pereira", cidade: "Porto Alegre", estado: "RS", valor: 22800, estagio: "Primeiro Contato", ultimoContato: daysAgo(3) },
  { id: "b6", empresa: "Atacado Soletta", contato: "Pedro Rocha", cidade: "Goiânia", estado: "GO", valor: 58100, estagio: "Pedido Fechado", ultimoContato: daysAgo(10) },
  { id: "b7", empresa: "Loja Step Up", contato: "Fernanda Reis", cidade: "Recife", estado: "PE", valor: 18900, estagio: "Perdido", ultimoContato: daysAgo(20) },
  { id: "b8", empresa: "Comercial Andar", contato: "Lucas Mendes", cidade: "Salvador", estado: "BA", valor: 41200, estagio: "Negociação", ultimoContato: daysAgo(4) },
];

export const clientesB2CSeed: ClienteB2C[] = [
  { id: "c1", nome: "Mariana Castro", cidade: "Campinas", telefone: "(19) 99876-3322", valor: 380, estagio: "Venda", ultimoContato: daysAgo(1) },
  { id: "c2", nome: "Rafael Pinto", cidade: "Santos", telefone: "(13) 98212-1144", valor: 240, estagio: "Orçamento", ultimoContato: daysAgo(2) },
  { id: "c3", nome: "Beatriz Almeida", cidade: "São Paulo", telefone: "(11) 97333-5566", valor: 520, estagio: "Negociação", ultimoContato: daysAgo(3) },
  { id: "c4", nome: "Diego Ramos", cidade: "Sorocaba", telefone: "(15) 99811-2233", valor: 190, estagio: "Atendimento", ultimoContato: daysAgo(0) },
  { id: "c5", nome: "Patrícia Lima", cidade: "Ribeirão Preto", telefone: "(16) 99122-7788", valor: 670, estagio: "Venda", ultimoContato: daysAgo(5) },
  { id: "c6", nome: "Henrique Souza", cidade: "São José dos Campos", telefone: "(12) 98765-1414", valor: 150, estagio: "Perdido", ultimoContato: daysAgo(15) },
];

const statusPV: StatusPedidoVenda[] = ["Negociação", "Reservado", "Produção", "Pronto para envio", "Finalizado"];
export const pedidosVendaSeed: PedidoVenda[] = Array.from({ length: 14 }, (_, i) => {
  const prod = produtosSeed[i % produtosSeed.length];
  const qtd = 4 + rint(0, 49);
  const valor = qtd * (180 + rint(0, 220));
  const monthOffset = rint(0, 2);
  const emi = new Date(TODAY);
  emi.setUTCMonth(emi.getUTCMonth() - monthOffset);
  emi.setUTCDate(1 + rint(0, 27));
  const prev = new Date(emi);
  prev.setUTCDate(prev.getUTCDate() + 10 + rint(0, 20));
  const canal: "B2B" | "B2C" = i % 3 === 0 ? "B2C" : "B2B";
  const cliente = canal === "B2B"
    ? clientesB2BSeed[i % clientesB2BSeed.length].empresa
    : clientesB2CSeed[i % clientesB2CSeed.length].nome;
  return {
    id: `pv${i + 1}`,
    numero: `PV-${String(5200 + i).padStart(5, "0")}`,
    cliente,
    canal,
    produtoId: prod.id,
    produto: `${prod.produto} ${prod.cor} ${prod.numeracao}`,
    quantidade: qtd,
    valor,
    emissao: emi.toISOString().slice(0, 10),
    previsaoEntrega: prev.toISOString().slice(0, 10),
    status: statusPV[i % statusPV.length],
  };
});

const statusOP: StatusOP[] = ["Planejada", "Em Produção", "Concluída", "Atrasada"];
export const ordensProducaoSeed: OrdemProducao[] = planejamentosSeed.flatMap((pl, i) => {
  return Array.from({ length: 2 }, (_, j) => {
    const planejada = Math.floor(pl.quantidadePlanejada / 2) + rint(-10, 10);
    const produzida = j === 0 ? Math.min(planejada, pl.producaoRealizada) : Math.max(0, pl.producaoRealizada - planejada);
    const ini = new Date(pl.inicio);
    ini.setUTCDate(ini.getUTCDate() + j * 20);
    const fim = new Date(ini);
    fim.setUTCDate(fim.getUTCDate() + 18 + rint(0, 8));
    const st = produzida >= planejada ? "Concluída" : statusOP[(i + j) % statusOP.length];
    return {
      id: `op${i}-${j}`,
      numero: `OP-${String(7300 + i * 2 + j).padStart(5, "0")}`,
      produto: pl.produto,
      quantidadePlanejada: planejada,
      quantidadeProduzida: produzida,
      dataInicio: ini.toISOString().slice(0, 10),
      dataFim: fim.toISOString().slice(0, 10),
      status: st,
      retrabalho: rint(0, 12),
      operadores: 6 + rint(0, 8),
    } as OrdemProducao;
  });
});

export const gargalosSeed: Gargalo[] = [
  { id: "g1", etapa: "Corte", status: "Normal", observacao: "Operando dentro da capacidade.", capacidadeUso: 72 },
  { id: "g2", etapa: "Pesponto", status: "Atenção", observacao: "Fila de OPs aguardando há 2 dias.", capacidadeUso: 91 },
  { id: "g3", etapa: "Montagem", status: "Atrasado", observacao: "Quebra de máquina nº 04. Manutenção acionada.", capacidadeUso: 98 },
  { id: "g4", etapa: "Acabamento", status: "Normal", observacao: "Equipe reforçada esta semana.", capacidadeUso: 64 },
];

export const observacoesSeed: Observacao[] = [
  { id: "ob1", data: daysAgo(2), titulo: "Consumo de cola aumentou 20%", categoria: "Produção", texto: "Aumento detectado na linha de montagem do Tênis Urban. Recomenda-se revisar processo de aplicação.", impacto: "Médio" },
  { id: "ob2", data: daysAgo(4), titulo: "Estoque de couro abaixo da cobertura ideal", categoria: "Estoque", texto: "Couro Preto Premium com apenas 7 dias de cobertura. Pedido sugerido ao CouroMax.", impacto: "Alto" },
  { id: "ob3", data: daysAgo(6), titulo: "Solados Brasil com atraso recorrente", categoria: "Compras", texto: "3 dos últimos 5 pedidos chegaram fora do prazo. Considerar fornecedor alternativo.", impacto: "Alto" },
  { id: "ob4", data: daysAgo(8), titulo: "Retrabalho acima da média na Montagem", categoria: "Qualidade", texto: "Taxa de retrabalho subiu para 4,8%. Treinamento agendado para a próxima semana.", impacto: "Médio" },
  { id: "ob5", data: daysAgo(1), titulo: "Crescimento de pedidos B2B do Sudeste", categoria: "Vendas", texto: "Aumento de 18% em pedidos da região nas últimas 4 semanas.", impacto: "Baixo" },
];

export const planoAcaoSeed: PlanoAcao[] = [
  { id: "pa-1", problema: "Atrasos do fornecedor Solados Brasil", responsavel: "Compras / Renato", prazo: daysAgo(-14), status: "Em andamento" },
  { id: "pa-2", problema: "Reduzir retrabalho na Montagem", responsavel: "Produção / Camila", prazo: daysAgo(-21), status: "Aberto" },
  { id: "pa-3", problema: "Reposição urgente de Couro Preto", responsavel: "Compras / Renato", prazo: daysAgo(-3), status: "Em andamento" },
  { id: "pa-4", problema: "Padronizar aplicação de cola", responsavel: "Qualidade / Felipe", prazo: daysAgo(-30), status: "Aberto" },
  { id: "pa-5", problema: "Substituir Componentes Nova Era", responsavel: "Compras / Renato", prazo: daysAgo(-45), status: "Aberto" },
];

export const sugestoesSeed: Sugestao[] = [
  { id: "s1", titulo: "Substituir fornecedor de aviamentos", descricao: "Trocar Componentes Nova Era por NylonTech pode reduzir falhas de qualidade.", categoria: "Qualidade", potencialEconomia: 12300 },
  { id: "s2", titulo: "Negociar contrato anual de couro", descricao: "Volume atual permite negociação de preço fixo por 12 meses.", categoria: "Custo", potencialEconomia: 28500 },
  { id: "s3", titulo: "Antecipar compras de embalagens", descricao: "Cobertura ideal de 60 dias evita rupturas em pico sazonal.", categoria: "Processo" },
  { id: "s4", titulo: "Redistribuir operadores na Montagem", descricao: "Pesponto e Montagem operam em capacidade crítica. Balancear time.", categoria: "Eficiência" },
];

export const historicoMelhoriasSeed: MelhoriaHistorico[] = [
  { id: "h1", titulo: "Redução de saving em couro com novo fornecedor", data: "2026-03-12", ganho: "R$ 18.400" },
  { id: "h2", titulo: "Redução de 30% no retrabalho de Pesponto", data: "2026-02-20", ganho: "R$ 9.800" },
  { id: "h3", titulo: "Inventário cíclico semanal implantado", data: "2026-01-05", ganho: "Acuracidade 98,5%" },
];
