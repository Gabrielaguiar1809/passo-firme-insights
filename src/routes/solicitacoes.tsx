import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { StatusPill } from "@/components/passofirme/ui-bits";
import { useData } from "@/lib/passofirme/store";
import type { Solicitacao } from "@/lib/passofirme/data";
import { toast } from "sonner";

export const Route = createFileRoute("/solicitacoes")({
  head: () => ({ meta: [{ title: "Solicitações — PassoFirme" }] }),
  component: SolicitacoesPage,
});

function SolicitacoesPage() {
  const { solicitacoes, addSolicitacao, updateSolicitacao } = useData();

  const cols: Column<Solicitacao>[] = [
    { key: "numero", label: "Número" },
    { key: "solicitante", label: "Solicitante" },
    { key: "item", label: "Item" },
    { key: "quantidade", label: "Qtd", render: (r) => r.quantidade.toLocaleString("pt-BR") },
    { key: "data", label: "Data", render: (r) => new Date(r.data).toLocaleDateString("pt-BR") },
    { key: "centroCusto", label: "Centro de Custo" },
    { key: "urgencia", label: "Urgência", render: (r) => <StatusPill status={r.urgencia} /> },
    { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <DataTable
      title="Solicitações de Compra"
      columns={cols}
      rows={solicitacoes}
      onNew={() => {
        const n = solicitacoes.length + 1;
        addSolicitacao({
          numero: `SOL-${String(2500 + n).padStart(5, "0")}`,
          solicitante: "Novo Solicitante",
          item: "Couro Preto Premium",
          quantidade: 100,
          data: new Date().toISOString().slice(0, 10),
          centroCusto: "Produção A",
          urgencia: "Média",
          status: "Aberta",
        });
        toast.success("Nova solicitação criada");
      }}
      onRowClick={(r) => {
        const next: Record<Solicitacao["status"], Solicitacao["status"]> = {
          Aberta: "Em Aprovação", "Em Aprovação": "Cotando", Cotando: "Aprovada", Aprovada: "Cancelada", Cancelada: "Aberta",
        };
        updateSolicitacao(r.id, { status: next[r.status] });
        toast.info(`Status atualizado para ${next[r.status]}`);
      }}
    />
  );
}
