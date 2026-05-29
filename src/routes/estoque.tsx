import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { useData } from "@/lib/passofirme/store";
import type { MateriaPrima } from "@/lib/passofirme/data";
import { toast } from "sonner";

export const Route = createFileRoute("/estoque")({
  head: () => ({ meta: [{ title: "Estoque de Matéria-Prima — PassoFirme" }] }),
  component: EstoquePage,
});

function statusEstoque(m: MateriaPrima) {
  if (m.estoqueAtual < m.estoqueMinimo) return { label: "Ruptura", cls: "bg-destructive/15 text-destructive" };
  const ponto = m.consumoMedioDiario * m.leadTime + m.estoqueSeguranca;
  if (m.estoqueAtual <= ponto) return { label: "Ponto de Pedido", cls: "bg-warning/25 text-warning-foreground" };
  return { label: "OK", cls: "bg-success/15 text-success" };
}

function EstoquePage() {
  const { materias, addMateria, updateMateria } = useData();

  const cols: Column<MateriaPrima>[] = [
    { key: "sku", label: "SKU" },
    { key: "nome", label: "Matéria-Prima" },
    { key: "categoria", label: "Categoria" },
    { key: "estoqueAtual", label: "Estoque Atual", render: (r) => r.estoqueAtual.toLocaleString("pt-BR") },
    { key: "consumoMedioDiario", label: "Consumo/dia" },
    { key: "estoqueMinimo", label: "Mín" },
    { key: "estoqueMaximo", label: "Máx" },
    { key: "cobertura", label: "Cobertura (dias)", accessor: (r) => r.consumoMedioDiario ? r.estoqueAtual / r.consumoMedioDiario : 0,
      render: (r) => {
        const c = r.consumoMedioDiario ? Math.floor(r.estoqueAtual / r.consumoMedioDiario) : 0;
        return <span className={c < 7 ? "text-destructive font-semibold" : c < 15 ? "text-warning-foreground" : ""}>{c}d</span>;
      } },
    { key: "ponto", label: "Ponto de Pedido", accessor: (r) => r.consumoMedioDiario * r.leadTime + r.estoqueSeguranca,
      render: (r) => (r.consumoMedioDiario * r.leadTime + r.estoqueSeguranca).toLocaleString("pt-BR") },
    { key: "status", label: "Status", accessor: (r) => statusEstoque(r).label, render: (r) => {
      const s = statusEstoque(r);
      return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>{s.label}</span>;
    } },
  ];

  return (
    <DataTable
      title="Estoque de Matéria-Prima"
      columns={cols}
      rows={materias}
      onNew={() => {
        addMateria({
          sku: `MP-${String(materias.length + 1).padStart(3, "0")}`,
          nome: "Nova Matéria-Prima",
          categoria: "Couro",
          estoqueAtual: 100,
          consumoMedioDiario: 10,
          estoqueMinimo: 50,
          estoqueMaximo: 500,
          leadTime: 7,
          estoqueSeguranca: 30,
          custoUnitario: 20,
          ultimaMovimentacao: new Date().toISOString().slice(0, 10),
        });
        toast.success("Item de estoque criado");
      }}
      onRowClick={(r) => {
        updateMateria(r.id, { estoqueAtual: Math.max(0, r.estoqueAtual - r.consumoMedioDiario) });
        toast.info(`Consumo registrado em ${r.nome}`);
      }}
    />
  );
}
