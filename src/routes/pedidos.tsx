import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { StatusPill, brl } from "@/components/passofirme/ui-bits";
import { useData } from "@/lib/passofirme/store";
import type { ClassificacaoPedido, PedidoCompra } from "@/lib/passofirme/data";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos de Compra — PassoFirme" }] }),
  component: PedidosPage,
});

function PedidosPage() {
  const { pedidos, fornecedores, addPedido, updatePedido, receberPedido } = useData();
  const [filtro, setFiltro] = useState<"Todos" | ClassificacaoPedido>("Todos");
  const fMap = useMemo(() => Object.fromEntries(fornecedores.map((f) => [f.id, f.nome])), [fornecedores]);

  const filtered = useMemo(
    () => (filtro === "Todos" ? pedidos : pedidos.filter((p) => p.classificacao === filtro)),
    [pedidos, filtro],
  );

  const counts = useMemo(
    () => ({
      Todos: pedidos.length,
      MP: pedidos.filter((p) => p.classificacao === "MP").length,
      Operacional: pedidos.filter((p) => p.classificacao === "Operacional").length,
    }),
    [pedidos],
  );

  const cols: Column<PedidoCompra>[] = [
    { key: "numero", label: "Número OC" },
    { key: "classificacao", label: "Classificação", render: (r) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${r.classificacao === "MP" ? "bg-primary/10 text-primary" : "bg-info/15 text-info"}`}>{r.classificacao}</span>
    ) },
    { key: "fornecedor", label: "Fornecedor", accessor: (r) => fMap[r.fornecedorId] ?? "", render: (r) => fMap[r.fornecedorId] ?? "—" },
    { key: "categoria", label: "Categoria" },
    { key: "valor", label: "Valor", accessor: (r) => r.valor, render: (r) => brl(r.valor) },
    { key: "emissao", label: "Emissão", render: (r) => new Date(r.emissao).toLocaleDateString("pt-BR") },
    { key: "entregaPrevista", label: "Entrega Prevista", render: (r) => new Date(r.entregaPrevista).toLocaleDateString("pt-BR") },
    { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
  ];

  const tabs = (
    <Tabs value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
      <TabsList>
        <TabsTrigger value="Todos">Todos ({counts.Todos})</TabsTrigger>
        <TabsTrigger value="MP">Matéria-Prima ({counts.MP})</TabsTrigger>
        <TabsTrigger value="Operacional">Operacional ({counts.Operacional})</TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return (
    <DataTable
      title="Pedidos de Compra"
      columns={cols}
      rows={filtered}
      filters={tabs}
      onNew={() => {
        const f = fornecedores[0];
        addPedido({
          numero: `OC-${String(8500 + pedidos.length).padStart(5, "0")}`,
          fornecedorId: f?.id ?? "",
          categoria: f?.categoria ?? "Couro",
          classificacao: filtro === "Operacional" ? "Operacional" : "MP",
          valor: 12500,
          emissao: new Date().toISOString().slice(0, 10),
          entregaPrevista: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
          status: "Emitido",
          completo: true,
          quantidade: 200,
          precoAnterior: 70,
          precoAtual: 62.5,
        });
        toast.success("Pedido de compra criado");
      }}
      onRowClick={(r) => {
        if (r.status === "Em Transporte") {
          receberPedido(r.id);
          toast.success(`Pedido ${r.numero} recebido — estoque atualizado automaticamente`);
          return;
        }
        const next: Record<PedidoCompra["status"], PedidoCompra["status"]> = {
          Emitido: "Confirmado", Confirmado: "Em Transporte", "Em Transporte": "Recebido",
          Recebido: "Atrasado", Atrasado: "Emitido",
        };
        const ns = next[r.status];
        updatePedido(r.id, { status: ns });
        toast.info(`Pedido ${r.numero}: ${ns}`);
      }}
    />
  );
}
