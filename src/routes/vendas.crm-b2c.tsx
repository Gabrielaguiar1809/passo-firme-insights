import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { KanbanBoard } from "@/components/passofirme/Kanban";
import { AlertCircle } from "lucide-react";

const estagios = ["Atendimento", "Orçamento", "Negociação", "Venda", "Perdido"];
const labels: Record<string, string> = { "Venda": "Venda — Concluída", "Perdido": "Cancelado" };

export const Route = createFileRoute("/vendas/crm-b2c")({
  head: () => ({ meta: [{ title: "CRM B2C — PassoFirme" }] }),
  component: CrmB2CPage,
});

function CrmB2CPage() {
  const { clientesB2C } = useData();
  const items = clientesB2C.map((c) => ({
    id: c.id, title: c.nome, subtitle: `${c.cidade} · ${c.telefone}`,
    valor: c.valor, stage: c.estagio,
    badge: c.origem ? { label: c.origem, tone: "neutro" as const } : undefined,
    meta: `Últ. contato: ${c.ultimoContato}`,
  }));
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-semibold tracking-tight">CRM B2C</h1>
          <span className="text-[10px] rounded-full bg-warning/25 text-warning-foreground px-2 py-0.5 font-medium">Lançamento: Mês 5</span>
        </div>
        <p className="text-sm text-muted-foreground">Funil direto ao consumidor (Site · Mercado Livre · Instagram).</p>
      </div>
      <div className="rounded-lg border bg-warning/10 p-3 text-xs flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
        <p>Canal B2C em preparação. Operação inicia no <strong>Mês 5</strong>, após estruturação do canal B2B e construção do banco de dados de leads.</p>
      </div>
      <KanbanBoard stages={estagios} items={items} stageLabels={labels} />
    </div>
  );
}
