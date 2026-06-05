import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Clock } from "lucide-react";

export const Route = createFileRoute("/logistica/reversa")({
  head: () => ({ meta: [{ title: "Logística Reversa — PassoFirme" }] }),
  component: ReversaPage,
});

const DEVS = [
  { id: "d1", pedido: "PV-00721", cliente: "Calçados Belo Sul", motivo: "Defeito de costura", abertura: "2026-05-22", etapa: 3, sla: 5 },
  { id: "d2", pedido: "PV-00688", cliente: "Loja Passo Certo", motivo: "Numeração trocada", abertura: "2026-05-28", etapa: 1, sla: 5 },
  { id: "d3", pedido: "PV-00702", cliente: "Distribuidora Andar Bem", motivo: "Cor divergente", abertura: "2026-05-19", etapa: 5, sla: 5 },
  { id: "d4", pedido: "PV-00755", cliente: "Sapataria União", motivo: "Avaria no transporte", abertura: "2026-05-30", etapa: 2, sla: 5 },
];

const ETAPAS = ["Solicitação", "Aprovação", "Coleta", "Recebimento", "Crédito/Reposição"];

function ReversaPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <RotateCcw className="h-6 w-6 text-primary" /> Logística Reversa
        </h1>
        <p className="text-sm text-muted-foreground">Devoluções de clientes em 5 etapas com SLA de 5 dias úteis.</p>
      </div>

      <div className="space-y-3">
        {DEVS.map((d) => {
          const diasAberta = Math.ceil((Date.now() - new Date(d.abertura).getTime()) / 86400000);
          const slaEstourado = diasAberta > d.sla && d.etapa < 5;
          return (
            <div key={d.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold">{d.pedido} · {d.cliente}</p>
                  <p className="text-xs text-muted-foreground">{d.motivo}</p>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${slaEstourado ? "text-destructive" : "text-muted-foreground"}`}>
                  <Clock className="h-3.5 w-3.5" /> {diasAberta}d {slaEstourado ? "(SLA estourado)" : `(SLA ${d.sla}d)`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {ETAPAS.map((e, i) => {
                  const num = i + 1;
                  const done = num <= d.etapa;
                  const current = num === d.etapa && d.etapa < 5;
                  return (
                    <div key={i} className="flex-1 flex items-center gap-1">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${current ? "ring-2 ring-primary/30" : ""}`}>{num}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] truncate ${done ? "font-medium" : "text-muted-foreground"}`}>{e}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
