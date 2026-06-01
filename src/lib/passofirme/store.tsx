import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  calcIQF,
  clientesB2BSeed,
  clientesB2CSeed,
  cotacoesSeed,
  devolucoesFornecedorSeed,
  fornecedoresSeed,
  gargalosSeed,
  historicoMelhoriasSeed,
  itensOperacionalSeed,
  materiasSeed,
  movimentacoesSeed,
  observacoesSeed,
  ordensProducaoSeed,
  pedidosSeed,
  pedidosVendaSeed,
  planejamentosSeed,
  planoAcaoSeed,
  produtosSeed,
  requisicoesSeed,
  sugestoesSeed,
  type ClienteB2B,
  type ClienteB2C,
  type Cotacao,
  type DevolucaoFornecedor,
  type Fornecedor,
  type Gargalo,
  type ItemOperacional,
  type MateriaPrima,
  type MelhoriaHistorico,
  type Movimentacao,
  type Observacao,
  type OrdemProducao,
  type PedidoCompra,
  type PedidoVenda,
  type Planejamento,
  type PlanoAcao,
  type ProdutoAcabado,
  type Requisicao,
  type Sugestao,
  type TipoMovimentacao,
} from "./data";

interface Store {
  requisicoes: Requisicao[];
  cotacoes: Cotacao[];
  fornecedores: Fornecedor[];
  pedidos: PedidoCompra[];
  materias: MateriaPrima[];
  itensOperacional: ItemOperacional[];
  movimentacoes: Movimentacao[];
  planejamentos: Planejamento[];
  produtos: ProdutoAcabado[];
  clientesB2B: ClienteB2B[];
  clientesB2C: ClienteB2C[];
  pedidosVenda: PedidoVenda[];
  ordensProducao: OrdemProducao[];
  gargalos: Gargalo[];
  observacoes: Observacao[];
  planoAcao: PlanoAcao[];
  sugestoes: Sugestao[];
  historicoMelhorias: MelhoriaHistorico[];

  updateRequisicao: (id: string, patch: Partial<Requisicao>) => void;
  addRequisicao: (s: Omit<Requisicao, "id">) => void;
  avancarStatusRequisicao: (id: string) => void;
  updateCotacao: (id: string, patch: Partial<Cotacao>) => void;
  addCotacao: (s: Omit<Cotacao, "id">) => void;
  updateFornecedor: (id: string, patch: Partial<Fornecedor>) => void;
  addFornecedor: (s: Omit<Fornecedor, "id">) => void;
  updatePedido: (id: string, patch: Partial<PedidoCompra>) => void;
  addPedido: (s: Omit<PedidoCompra, "id">) => void;
  receberPedido: (id: string) => void;
  addMateria: (s: Omit<MateriaPrima, "id">) => void;
  updateMateria: (id: string, patch: Partial<MateriaPrima>) => void;
  addItemOperacional: (s: Omit<ItemOperacional, "id">) => void;
  updateItemOperacional: (id: string, patch: Partial<ItemOperacional>) => void;
  addPlanejamento: (s: Omit<Planejamento, "id">) => void;
  updatePlanejamento: (id: string, patch: Partial<Planejamento>) => void;
  registrarMovimentacao: (m: Omit<Movimentacao, "id">) => void;
  addProduto: (s: Omit<ProdutoAcabado, "id">) => void;
  updateProduto: (id: string, patch: Partial<ProdutoAcabado>) => void;

  updateClienteB2B: (id: string, patch: Partial<ClienteB2B>) => void;
  addClienteB2B: (c: Omit<ClienteB2B, "id">) => void;
  updateClienteB2C: (id: string, patch: Partial<ClienteB2C>) => void;
  addClienteB2C: (c: Omit<ClienteB2C, "id">) => void;
  addPedidoVenda: (p: Omit<PedidoVenda, "id">) => void;
  updatePedidoVenda: (id: string, patch: Partial<PedidoVenda>) => void;
  addOrdemProducao: (o: Omit<OrdemProducao, "id">) => void;
  updateOrdemProducao: (id: string, patch: Partial<OrdemProducao>) => void;
  updateGargalo: (id: string, patch: Partial<Gargalo>) => void;
  addObservacao: (o: Omit<Observacao, "id">) => void;
  addPlano: (p: Omit<PlanoAcao, "id">) => void;
  updatePlano: (id: string, patch: Partial<PlanoAcao>) => void;
  addSugestao: (s: Omit<Sugestao, "id">) => void;
}

const Ctx = createContext<Store | null>(null);
const uid = () => Math.random().toString(36).slice(2, 10);

export function DataProvider({ children }: { children: ReactNode }) {
  const [requisicoes, setRequisicoes] = useState(requisicoesSeed);
  const [cotacoes, setCotacoes] = useState(cotacoesSeed);
  const [fornecedores, setFornecedores] = useState(fornecedoresSeed);
  const [pedidos, setPedidos] = useState(pedidosSeed);
  const [materias, setMaterias] = useState(materiasSeed);
  const [itensOperacional, setItensOperacional] = useState(itensOperacionalSeed);
  const [movimentacoes, setMovimentacoes] = useState(movimentacoesSeed);
  const [planejamentos, setPlanejamentos] = useState(planejamentosSeed);
  const [produtos, setProdutos] = useState(produtosSeed);
  const [clientesB2B, setClientesB2B] = useState(clientesB2BSeed);
  const [clientesB2C, setClientesB2C] = useState(clientesB2CSeed);
  const [pedidosVenda, setPedidosVenda] = useState(pedidosVendaSeed);
  const [ordensProducao, setOrdensProducao] = useState(ordensProducaoSeed);
  const [gargalos, setGargalos] = useState(gargalosSeed);
  const [observacoes, setObservacoes] = useState(observacoesSeed);
  const [planoAcao, setPlanoAcao] = useState(planoAcaoSeed);
  const [sugestoes, setSugestoes] = useState(sugestoesSeed);
  const [historicoMelhorias] = useState(historicoMelhoriasSeed);

  const aplicarEstoque = useCallback((itemTipo: "MP" | "OP", itemId: string, tipo: TipoMovimentacao, qtd: number) => {
    const delta = tipo === "Entrada" ? qtd : tipo === "Saída" ? -qtd : tipo === "Devolução" ? qtd : qtd;
    const hoje = new Date().toISOString().slice(0, 10);
    if (itemTipo === "MP") {
      setMaterias((arr) => arr.map((m) => m.id === itemId ? { ...m, estoqueAtual: Math.max(0, m.estoqueAtual + delta), ultimaMovimentacao: hoje } : m));
    } else {
      setItensOperacional((arr) => arr.map((m) => m.id === itemId ? { ...m, estoqueAtual: Math.max(0, m.estoqueAtual + delta), ultimaMovimentacao: hoje } : m));
    }
  }, []);

  const registrarMovimentacao = useCallback((m: Omit<Movimentacao, "id">) => {
    setMovimentacoes((arr) => [{ ...m, id: uid() }, ...arr]);
    aplicarEstoque(m.itemTipo, m.itemId, m.tipo, m.quantidade);
  }, [aplicarEstoque]);

  const avancarStatusRequisicao = useCallback((id: string) => {
    setRequisicoes((arr) => arr.map((r) => {
      if (r.id !== id) return r;
      const seq: Requisicao["status"][] = ["Aberta", "Em Separação", "Pronta para Retirada", "Entregue"];
      const idx = seq.indexOf(r.status);
      const next = seq[Math.min(idx + 1, seq.length - 1)];
      if (next === "Entregue" && r.status !== "Entregue") {
        const mov: Omit<Movimentacao, "id"> = {
          data: new Date().toISOString().slice(0, 10),
          itemTipo: r.itemTipo, itemId: r.itemId, itemNome: r.item,
          tipo: "Saída", quantidade: r.quantidade,
          origem: `Requisição ${r.numero}`, responsavel: "Almoxarifado",
        };
        setMovimentacoes((mv) => [{ ...mov, id: uid() }, ...mv]);
        aplicarEstoque(r.itemTipo, r.itemId, "Saída", r.quantidade);
      }
      return { ...r, status: next };
    }));
  }, [aplicarEstoque]);

  const receberPedido = useCallback((id: string) => {
    setPedidos((arr) => arr.map((p) => {
      if (p.id !== id || p.status === "Recebido") return p;
      const hoje = new Date().toISOString().slice(0, 10);
      if (p.itemId && p.quantidade) {
        const item = materiasSeed.find((m) => m.id === p.itemId);
        const mov: Omit<Movimentacao, "id"> = {
          data: hoje, itemTipo: "MP", itemId: p.itemId, itemNome: item?.nome ?? "Item",
          tipo: "Entrada", quantidade: p.quantidade,
          origem: `Recebimento ${p.numero}`, responsavel: "Almoxarifado",
        };
        setMovimentacoes((mv) => [{ ...mov, id: uid() }, ...mv]);
        aplicarEstoque("MP", p.itemId, "Entrada", p.quantidade);
      }
      return { ...p, status: "Recebido", entregaRealizada: hoje };
    }));
  }, [aplicarEstoque]);

  const mk = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) => ({
    update: (id: string, patch: Partial<T>) => setter((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    add: (item: Omit<T, "id">) => setter((arr) => [{ ...(item as T), id: uid() }, ...arr]),
  });

  const req = useMemo(() => mk(setRequisicoes), []);
  const cot = useMemo(() => mk(setCotacoes), []);
  const forn = useMemo(() => mk(setFornecedores), []);
  const ped = useMemo(() => mk(setPedidos), []);
  const mat = useMemo(() => mk(setMaterias), []);
  const op = useMemo(() => mk(setItensOperacional), []);
  const pl = useMemo(() => mk(setPlanejamentos), []);
  const prod = useMemo(() => mk(setProdutos), []);
  const cb2b = useMemo(() => mk(setClientesB2B), []);
  const cb2c = useMemo(() => mk(setClientesB2C), []);
  const pv = useMemo(() => mk(setPedidosVenda), []);
  const opr = useMemo(() => mk(setOrdensProducao), []);
  const garg = useMemo(() => mk(setGargalos), []);
  const obs = useMemo(() => mk(setObservacoes), []);
  const pla = useMemo(() => mk(setPlanoAcao), []);
  const sug = useMemo(() => mk(setSugestoes), []);

  const value: Store = {
    requisicoes, cotacoes, fornecedores, pedidos, materias, itensOperacional, movimentacoes, planejamentos, produtos,
    clientesB2B, clientesB2C, pedidosVenda, ordensProducao, gargalos, observacoes, planoAcao, sugestoes, historicoMelhorias,
    updateRequisicao: req.update, addRequisicao: req.add, avancarStatusRequisicao,
    updateCotacao: cot.update, addCotacao: cot.add,
    updateFornecedor: forn.update, addFornecedor: forn.add,
    updatePedido: ped.update, addPedido: ped.add, receberPedido,
    addMateria: mat.add, updateMateria: mat.update,
    addItemOperacional: op.add, updateItemOperacional: op.update,
    addPlanejamento: pl.add, updatePlanejamento: pl.update,
    registrarMovimentacao, addProduto: prod.add, updateProduto: prod.update,
    updateClienteB2B: cb2b.update, addClienteB2B: cb2b.add,
    updateClienteB2C: cb2c.update, addClienteB2C: cb2c.add,
    addPedidoVenda: pv.add, updatePedidoVenda: pv.update,
    addOrdemProducao: opr.add, updateOrdemProducao: opr.update,
    updateGargalo: garg.update,
    addObservacao: obs.add,
    addPlano: pla.add, updatePlano: pla.update,
    addSugestao: sug.add,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useData must be used inside DataProvider");
  return c;
}

// ---- Indicadores derivados ----
export function useIndicadores() {
  const { requisicoes, pedidos, materias, fornecedores, pedidosVenda, ordensProducao } = useData();

  return useMemo(() => {
    const comprasPendentes = requisicoes.filter((r) => r.status !== "Entregue").length;
    const saving = pedidos.reduce((acc, p) => {
      if (!p.precoAnterior || !p.precoAtual || !p.quantidade) return acc;
      return acc + (p.precoAnterior - p.precoAtual) * p.quantidade;
    }, 0);
    const itensRuptura = materias.filter((m) => m.estoqueAtual < m.estoqueMinimo).length;
    const recebidos = pedidos.filter((p) => p.status === "Recebido");
    const otifOk = recebidos.filter((p) => p.completo && p.entregaRealizada && p.entregaRealizada <= p.entregaPrevista).length;
    const otif = recebidos.length ? +(otifOk / recebidos.length * 100).toFixed(1) : 0;
    const iqfMedio = fornecedores.length ? +(fornecedores.reduce((a, f) => a + calcIQF(f), 0) / fornecedores.length).toFixed(2) : 0;
    const pedidosAberto = pedidos.filter((p) => p.status !== "Recebido").length;

    const hoje = new Date("2026-05-31");
    const mesAtualKey = hoje.toISOString().slice(0, 7);
    const vendasMes = pedidosVenda.filter((p) => p.emissao.startsWith(mesAtualKey)).reduce((a, p) => a + p.valor, 0);
    const producaoMes = ordensProducao.filter((o) => o.dataInicio.startsWith(mesAtualKey) || o.dataFim.startsWith(mesAtualKey))
      .reduce((a, o) => a + o.quantidadeProduzida, 0);

    const meses: { mes: string; valor: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
      const valor = pedidos.filter((p) => p.emissao.startsWith(key)).reduce((a, p) => a + p.valor, 0);
      meses.push({ mes: label, valor: +valor.toFixed(2) });
    }

    const porCategoria = pedidos.reduce<Record<string, number>>((acc, p) => {
      acc[p.categoria] = (acc[p.categoria] || 0) + p.valor;
      return acc;
    }, {});
    const categoriasChart = Object.entries(porCategoria).map(([categoria, valor]) => ({ categoria, valor: +valor.toFixed(2) }));

    const alertas: { tipo: "warning" | "danger" | "info"; texto: string }[] = [];
    materias.forEach((m) => {
      const pontoPedido = m.consumoMedioDiario * m.leadTime + m.estoqueSeguranca;
      if (m.estoqueAtual <= pontoPedido && m.estoqueAtual >= m.estoqueMinimo) {
        alertas.push({ tipo: "warning", texto: `${m.nome} atingiu o ponto de pedido.` });
      }
      const dias = m.consumoMedioDiario > 0 ? m.estoqueAtual / m.consumoMedioDiario : 999;
      if (dias < 7 && m.estoqueAtual < m.estoqueMinimo) {
        alertas.push({ tipo: "danger", texto: `${m.nome} entrará em ruptura em ${Math.floor(dias)} dias.` });
      }
    });
    fornecedores.forEach((f) => {
      if (calcIQF(f) < 8.0) alertas.push({ tipo: "warning", texto: `Fornecedor ${f.nome} apresentou queda no IQF (${calcIQF(f)}).` });
      if (f.otif < 80) alertas.push({ tipo: "danger", texto: `Fornecedor ${f.nome} está com OTIF abaixo do ideal (${f.otif}%).` });
    });

    return {
      comprasPendentes, saving, itensRuptura, otif, iqfMedio, pedidosAberto,
      vendasMes, producaoMes, meses, categoriasChart, alertas: alertas.slice(0, 8),
    };
  }, [requisicoes, pedidos, materias, fornecedores, pedidosVenda, ordensProducao]);
}

export function useIndicadoresVendas() {
  const { pedidosVenda, clientesB2B, clientesB2C, produtos } = useData();
  return useMemo(() => {
    const totalLeads = clientesB2B.length + clientesB2C.length;
    const fechados = clientesB2B.filter((c) => c.estagio === "Pedido Fechado").length
      + clientesB2C.filter((c) => c.estagio === "Venda").length;
    const conversao = totalLeads ? +(fechados / totalLeads * 100).toFixed(1) : 0;
    const ticketMedio = pedidosVenda.length ? +(pedidosVenda.reduce((a, p) => a + p.valor, 0) / pedidosVenda.length).toFixed(0) : 0;
    const novosClientes = clientesB2B.filter((c) => c.estagio === "Lead" || c.estagio === "Primeiro Contato").length;
    const porProduto = pedidosVenda.reduce<Record<string, number>>((acc, p) => {
      acc[p.produto] = (acc[p.produto] || 0) + p.quantidade; return acc;
    }, {});
    const ranking = Object.entries(porProduto).sort((a, b) => b[1] - a[1]);
    const maisVendido = ranking[0]?.[0] ?? "—";
    return { conversao, ticketMedio, novosClientes, pedidosFechados: fechados, maisVendido, ranking, produtosCount: produtos.length };
  }, [pedidosVenda, clientesB2B, clientesB2C, produtos]);
}

export function useIndicadoresProducao() {
  const { ordensProducao, planejamentos } = useData();
  return useMemo(() => {
    const planejado = planejamentos.reduce((a, p) => a + p.quantidadePlanejada, 0);
    const realizado = planejamentos.reduce((a, p) => a + p.producaoRealizada, 0);
    const atingimento = planejado ? +(realizado / planejado * 100).toFixed(1) : 0;
    const totOps = ordensProducao.reduce((a, o) => a + o.quantidadeProduzida, 0);
    const totOperadores = ordensProducao.reduce((a, o) => a + o.operadores, 0);
    const produtividade = totOperadores ? +(totOps / totOperadores).toFixed(1) : 0;
    const retrabalhoTot = ordensProducao.reduce((a, o) => a + o.retrabalho, 0);
    const retrabalho = totOps ? +(retrabalhoTot / totOps * 100).toFixed(1) : 0;
    const leadTimes = ordensProducao.map((o) => (new Date(o.dataFim).getTime() - new Date(o.dataInicio).getTime()) / 86400000);
    const leadTime = leadTimes.length ? +(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length).toFixed(1) : 0;
    return { atingimento, produtividade, retrabalho, leadTime, realizado, planejado };
  }, [ordensProducao, planejamentos]);
}

export function useIndicadoresEstoque() {
  const { materias } = useData();
  return useMemo(() => {
    const ruptura = materias.filter((m) => m.estoqueAtual < m.estoqueMinimo).length;
    const ok = materias.length - ruptura;
    const valorEstoque = materias.reduce((a, m) => a + m.estoqueAtual * m.custoUnitario, 0);
    const coberturaMedia = materias.length
      ? +(materias.reduce((a, m) => a + (m.consumoMedioDiario > 0 ? m.estoqueAtual / m.consumoMedioDiario : 0), 0) / materias.length).toFixed(1)
      : 0;
    return { ruptura, ok, valorEstoque, coberturaMedia };
  }, [materias]);
}

export function useDisponibilidade() {
  const { produtos, pedidosVenda, ordensProducao } = useData();
  return useMemo(() => {
    return produtos.map((p) => {
      const reservado = pedidosVenda
        .filter((pv) => pv.produtoId === p.id && pv.status !== "Finalizado")
        .reduce((a, pv) => a + pv.quantidade, 0);
      const emProducao = ordensProducao
        .filter((o) => o.produto === p.produto && o.status !== "Concluída")
        .reduce((a, o) => a + Math.max(0, o.quantidadePlanejada - o.quantidadeProduzida), 0);
      const disponivel = Math.max(0, p.quantidade - reservado);
      return { ...p, reservado, emProducao, disponivel, futuro: disponivel + emProducao };
    });
  }, [produtos, pedidosVenda, ordensProducao]);
}

export function useInsights() {
  const { pedidos, materias, fornecedores, requisicoes, planejamentos } = useData();
  return useMemo(() => {
    const insights: string[] = [];
    const riscoRuptura = materias.filter((m) => m.consumoMedioDiario > 0 && m.estoqueAtual / m.consumoMedioDiario < 10).length;
    if (riscoRuptura > 0) insights.push(`Existe risco de ruptura para ${riscoRuptura} matérias-primas nas próximas semanas.`);
    const hoje = new Date("2026-05-31");
    const parado = materias
      .filter((m) => (hoje.getTime() - new Date(m.ultimaMovimentacao).getTime()) / 86400000 > 90)
      .reduce((a, m) => a + m.estoqueAtual * m.custoUnitario, 0);
    if (parado > 0) insights.push(`Você possui R$ ${parado.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} em estoque parado há mais de 90 dias.`);
    const ranked = [...fornecedores].sort((a, b) => calcIQF(b) - calcIQF(a));
    const pior = ranked[ranked.length - 1];
    if (pior && calcIQF(pior) < 8.3) insights.push(`O fornecedor ${pior.nome} teve queda recente no IQF (${calcIQF(pior)}).`);
    const melhor = ranked[0];
    if (melhor && pior && melhor.id !== pior.id) {
      insights.push(`Trocar para o fornecedor ${melhor.nome} pode gerar economia estimada de R$ 12.300.`);
    }
    const atrasados = pedidos.filter((p) => {
      if (p.status === "Recebido") return false;
      const dias = (hoje.getTime() - new Date(p.entregaPrevista).getTime()) / 86400000;
      return dias > 7;
    }).length;
    if (atrasados > 0) insights.push(`${atrasados} pedidos estão com atraso acima de 7 dias.`);
    const reqAbertas = requisicoes.filter((r) => r.status === "Aberta").length;
    if (reqAbertas > 0) insights.push(`${reqAbertas} requisições aguardando separação no almoxarifado.`);
    const deficits: string[] = [];
    planejamentos.forEach((pl) => {
      const restante = Math.max(0, pl.quantidadePlanejada - pl.producaoRealizada);
      pl.bom.forEach((b) => {
        const mp = materias.find((m) => m.id === b.materiaId);
        if (!mp) return;
        const necessidade = restante * b.consumoPorUnidade;
        if (necessidade > mp.estoqueAtual) {
          deficits.push(`${mp.nome} (faltam ${Math.ceil(necessidade - mp.estoqueAtual)} un para ${pl.produto})`);
        }
      });
    });
    if (deficits.length > 0) insights.push(`Planejamento aponta déficit em: ${deficits.slice(0, 2).join("; ")}.`);
    return insights;
  }, [pedidos, materias, fornecedores, requisicoes, planejamentos]);
}
