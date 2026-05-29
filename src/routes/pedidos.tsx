import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { StatusPill, brl } from "@/components/passofirme/ui-bits";
import { useData } from "@/lib/passofirme/store";
import type { PedidoCompra } from "@/lib/passofirme/data";
import { useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos de Compra — PassoFirme" }] }),
  component: PedidosPage,
});

function PedidosPage() {
  const { pedidos, fornecedores, addPedido, updatePedido } = useData();
  const fMap = useMemo(() => Object.fromEntries(fornecedores.map((f) => [f.id, f.nome])), [fornecedores]);

  const cols: Column<PedidoCompra>[] = [
    { key: "numero", label: "Número OC" },
    { key: "fornecedor", label: "Fornecedor", accessor: (r) => fMap[r.fornecedorId] ?? "", render: (r) => fMap[r.fornecedorId] ?? "—" },
    { key: "categoria", label: "Categoria" },
    { key: "valor", label: "Valor", accessor: (r) => r.valor, render: (r) => brl(r.valor) },
    { key: "emissao", label: "Emissão", render: (r) => new Date(r.emissao).toLocaleDateString("pt-BR") },
    { key: "entregaPrevista", label: "Entrega Prevista", render: (r) => new Date(r.entregaPrevista).toLocaleDateString("pt-BR") },
    { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <DataTable
      title="Pedidos de Compra"
      columns={cols}
      rows={pedidos}
      onNew={() => {
        const f = fornecedores[0];
        addPedido({
          numero: `OC-${String(8500 + pedidos.length).padStart(5, "0")}`,
          fornecedorId: f?.id ?? "",
          categoria: f?.categoria ?? "Couro",
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
        const next: Record<PedidoCompra["status"], PedidoCompra["status"]> = {
          Emitido: "Confirmado", Confirmado: "Em Transporte", "Em Transporte": "Recebido",
          Recebido: "Atrasado", Atrasado: "Emitido",
        };
        const ns = next[r.status];
        updatePedido(r.id, {
          status: ns,
          entregaRealizada: ns === "Recebido" ? new Date().toISOString().slice(0, 10) : r.entregaRealizada,
        });
        toast.info(`Pedido ${r.numero}: ${ns}`);
      }}
    />
  );
}
