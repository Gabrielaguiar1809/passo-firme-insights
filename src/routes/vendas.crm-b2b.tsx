import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { KanbanBoard } from "@/components/passofirme/Kanban";

const estagios = ["Lead", "Primeiro Contato", "Negociação", "Proposta", "Pedido Fechado", "Perdido"];

export const Route = createFileRoute("/vendas/crm-b2b")({
  head: () => ({ meta: [{ title: "CRM B2B — PassoFirme" }] }),
  component: CrmB2BPage,
});

function CrmB2BPage() {
  const { clientesB2B } = useData();
  const items = clientesB2B.map((c) => ({
    id: c.id, title: c.empresa, subtitle: `${c.contato} · ${c.cidade}/${c.estado}`,
    valor: c.valor, stage: c.estagio, meta: `Último contato: ${c.ultimoContato}`,
  }));
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CRM B2B</h1>
        <p className="text-sm text-muted-foreground">Funil comercial de clientes corporativos.</p>
      </div>
      <KanbanBoard stages={estagios} items={items} />
    </div>
  );
}
