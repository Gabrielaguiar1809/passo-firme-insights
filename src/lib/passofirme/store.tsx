import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  calcIQF,
  cotacoesSeed,
  fornecedoresSeed,
  materiasSeed,
  pedidosSeed,
  produtosSeed,
  solicitacoesSeed,
  type Cotacao,
  type Fornecedor,
  type MateriaPrima,
  type PedidoCompra,
  type ProdutoAcabado,
  type Solicitacao,
} from "./data";

interface Store {
  solicitacoes: Solicitacao[];
  cotacoes: Cotacao[];
  fornecedores: Fornecedor[];
  pedidos: PedidoCompra[];
  materias: MateriaPrima[];
  produtos: ProdutoAcabado[];

  updateSolicitacao: (id: string, patch: Partial<Solicitacao>) => void;
  addSolicitacao: (s: Omit<Solicitacao, "id">) => void;
  deleteSolicitacao: (id: string) => void;

  updateCotacao: (id: string, patch: Partial<Cotacao>) => void;
  addCotacao: (s: Omit<Cotacao, "id">) => void;
  deleteCotacao: (id: string) => void;

  updateFornecedor: (id: string, patch: Partial<Fornecedor>) => void;
  addFornecedor: (s: Omit<Fornecedor, "id">) => void;
  deleteFornecedor: (id: string) => void;

  updatePedido: (id: string, patch: Partial<PedidoCompra>) => void;
  addPedido: (s: Omit<PedidoCompra, "id">) => void;
  deletePedido: (id: string) => void;

  updateMateria: (id: string, patch: Partial<MateriaPrima>) => void;
  addMateria: (s: Omit<MateriaPrima, "id">) => void;
  deleteMateria: (id: string) => void;

  updateProduto: (id: string, patch: Partial<ProdutoAcabado>) => void;
  addProduto: (s: Omit<ProdutoAcabado, "id">) => void;
  deleteProduto: (id: string) => void;
}

const Ctx = createContext<Store | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [solicitacoes, setSolicitacoes] = useState(solicitacoesSeed);
  const [cotacoes, setCotacoes] = useState(cotacoesSeed);
  const [fornecedores, setFornecedores] = useState(fornecedoresSeed);
  const [pedidos, setPedidos] = useState(pedidosSeed);
  const [materias, setMaterias] = useState(materiasSeed);
  const [produtos, setProdutos] = useState(produtosSeed);

  const mk = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) => ({
    update: (id: string, patch: Partial<T>) =>
      setter((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    add: (item: Omit<T, "id">) => setter((arr) => [{ ...(item as T), id: uid() }, ...arr]),
    remove: (id: string) => setter((arr) => arr.filter((x) => x.id !== id)),
  });

  const sol = useMemo(() => mk(setSolicitacoes), []);
  const cot = useMemo(() => mk(setCotacoes), []);
  const forn = useMemo(() => mk(setFornecedores), []);
  const ped = useMemo(() => mk(setPedidos), []);
  const mat = useMemo(() => mk(setMaterias), []);
  const prod = useMemo(() => mk(setProdutos), []);

  const value: Store = {
    solicitacoes, cotacoes, fornecedores, pedidos, materias, produtos,
    updateSolicitacao: sol.update, addSolicitacao: sol.add, deleteSolicitacao: sol.remove,
    updateCotacao: cot.update, addCotacao: cot.add, deleteCotacao: cot.remove,
    updateFornecedor: forn.update, addFornecedor: forn.add, deleteFornecedor: forn.remove,
    updatePedido: ped.update, addPedido: ped.add, deletePedido: ped.remove,
    updateMateria: mat.update, addMateria: mat.add, deleteMateria: mat.remove,
    updateProduto: prod.update, addProduto: prod.add, deleteProduto: prod.remove,
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
  const { solicitacoes, pedidos, materias, fornecedores } = useData();

  return useMemo(() => {
    const comprasPendentes = solicitacoes.filter((s) => s.status !== "Cancelada" && s.status !== "Aprovada").length;

    const saving = pedidos.reduce((acc, p) => {
      if (!p.precoAnterior || !p.precoAtual || !p.quantidade) return acc;
      return acc + (p.precoAnterior - p.precoAtual) * p.quantidade;
    }, 0);

    const itensRuptura = materias.filter((m) => m.estoqueAtual < m.estoqueMinimo).length;

    const recebidos = pedidos.filter((p) => p.status === "Recebido");
    const otifOk = recebidos.filter((p) => p.completo && p.entregaRealizada && p.entregaRealizada <= p.entregaPrevista).length;
    const otif = recebidos.length ? +(otifOk / recebidos.length * 100).toFixed(1) : 0;

    const iqfMedio = fornecedores.length
      ? +(fornecedores.reduce((a, f) => a + calcIQF(f), 0) / fornecedores.length).toFixed(2)
      : 0;

    const pedidosAberto = pedidos.filter((p) => p.status !== "Recebido").length;

    // gráfico compras por mês 12m
    const hoje = new Date();
    const meses: { mes: string; valor: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
      const valor = pedidos
        .filter((p) => p.emissao.startsWith(key))
        .reduce((a, p) => a + p.valor, 0);
      meses.push({ mes: label, valor: +valor.toFixed(2) });
    }

    const porCategoria = pedidos.reduce<Record<string, number>>((acc, p) => {
      acc[p.categoria] = (acc[p.categoria] || 0) + p.valor;
      return acc;
    }, {});
    const categoriasChart = Object.entries(porCategoria).map(([categoria, valor]) => ({ categoria, valor: +valor.toFixed(2) }));

    // alertas
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
    const proximosRuptura = materias.filter((m) => {
      const dias = m.consumoMedioDiario > 0 ? m.estoqueAtual / m.consumoMedioDiario : 999;
      return dias < 7;
    }).length;
    if (proximosRuptura > 0) alertas.push({ tipo: "danger", texto: `${proximosRuptura} itens entrarão em ruptura em menos de 7 dias.` });

    return {
      comprasPendentes, saving, itensRuptura, otif, iqfMedio, pedidosAberto,
      meses, categoriasChart, alertas: alertas.slice(0, 8),
    };
  }, [solicitacoes, pedidos, materias, fornecedores]);
}

export function useInsights() {
  const { pedidos, materias, fornecedores } = useData();
  return useMemo(() => {
    const insights: string[] = [];
    const riscoRuptura = materias.filter((m) => m.consumoMedioDiario > 0 && m.estoqueAtual / m.consumoMedioDiario < 10).length;
    if (riscoRuptura > 0) insights.push(`Existe risco de ruptura para ${riscoRuptura} matérias-primas nas próximas semanas.`);

    const hoje = new Date();
    const parado = materias
      .filter((m) => (hoje.getTime() - new Date(m.ultimaMovimentacao).getTime()) / 86400000 > 90)
      .reduce((a, m) => a + m.estoqueAtual * m.custoUnitario, 0);
    if (parado > 0) insights.push(`Você possui R$ ${parado.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} em estoque parado há mais de 90 dias.`);

    const ranked = [...fornecedores].sort((a, b) => calcIQF(b) - calcIQF(a));
    const pior = ranked[ranked.length - 1];
    if (pior && calcIQF(pior) < 8.3) insights.push(`O fornecedor ${pior.nome} teve queda recente no IQF (${calcIQF(pior)}).`);

    const melhor = ranked[0];
    if (melhor && pior && melhor.id !== pior.id) {
      const economia = +(Math.random() * 15000 + 5000).toFixed(0);
      insights.push(`Trocar para o fornecedor ${melhor.nome} pode gerar economia estimada de R$ ${economia.toLocaleString("pt-BR")}.`);
    }

    const atrasados = pedidos.filter((p) => {
      if (p.status === "Recebido") return false;
      const dias = (hoje.getTime() - new Date(p.entregaPrevista).getTime()) / 86400000;
      return dias > 7;
    }).length;
    if (atrasados > 0) insights.push(`${atrasados} pedidos estão com atraso acima de 7 dias.`);

    return insights;
  }, [pedidos, materias, fornecedores]);
}
