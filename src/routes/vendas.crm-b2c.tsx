import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { KanbanBoard } from "@/components/passofirme/Kanban";

const estagios = ["Atendimento", "Orçamento", "Negociação", "Venda", "Perdido"];

export const Route = createFileRoute("/vendas/crm-b2c")({
  head: () => ({ meta: [{ title: "CRM B2C — PassoFirme" }] }),
  component: CrmB2CPage,
});

function CrmB2CPage() {
  const { clientesB2C } = useData();
  const items = clientesB2C.map((c) => ({
    id: c.id, title: c.nome, subtitle: `${c.cidade} · ${c.telefone}`,
    valor: c.valor, stage: c.estagio, meta: `Último contato: ${c.ultimoContato}`,
  }));
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CRM B2C</h1>
        <p className="text-sm text-muted-foreground">Funil de atendimento ao consumidor final.</p>
      </div>
      <KanbanBoard stages={estagios} items={items} />
    </div>
  );
}
