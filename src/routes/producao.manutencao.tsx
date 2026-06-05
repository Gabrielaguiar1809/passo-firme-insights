import { createFileRoute } from "@tanstack/react-router";
import { Wrench, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/producao/manutencao")({
  head: () => ({ meta: [{ title: "Manutenção Preventiva — PassoFirme" }] }),
  component: ManutencaoPage,
});

const EQUIPAMENTOS = [
  { id: "e1", nome: "Prensa Hidráulica P1", setor: "Montagem", ultima: "2026-04-15", proxima: "2026-06-15", status: "OK" as const, criticidade: "Alta" },
  { id: "e2", nome: "Máquina de Pesponto MP-3", setor: "Pesponto", ultima: "2026-03-20", proxima: "2026-06-05", status: "Próxima" as const, criticidade: "Alta" },
  { id: "e3", nome: "Cortadeira Automática C2", setor: "Corte", ultima: "2026-05-01", proxima: "2026-07-01", status: "OK" as const, criticidade: "Média" },
  { id: "e4", nome: "Cabine de Colagem", setor: "Montagem", ultima: "2026-02-10", proxima: "2026-05-20", status: "Vencida" as const, criticidade: "Alta" },
  { id: "e5", nome: "Esteira Acabamento", setor: "Acabamento", ultima: "2026-04-28", proxima: "2026-07-28", status: "OK" as const, criticidade: "Baixa" },
];

const cls: Record<string, string> = {
  OK: "bg-success/15 text-success border-success/30",
  Próxima: "bg-warning/25 text-warning-foreground border-warning/30",
  Vencida: "bg-destructive/15 text-destructive border-destructive/30",
};

function ManutencaoPage() {
  const vencidas = EQUIPAMENTOS.filter((e) => e.status === "Vencida").length;
  const proximas = EQUIPAMENTOS.filter((e) => e.status === "Próxima").length;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Wrench className="h-6 w-6 text-primary" /> Manutenção Preventiva
        </h1>
        <p className="text-sm text-muted-foreground">Plano de manutenção de equipamentos com calendário, criticidade e histórico.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase">Equipamentos</p>
          <p className="text-2xl font-semibold">{EQUIPAMENTOS.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase">Vencidas</p>
          <p className="text-2xl font-semibold text-destructive">{vencidas}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase">Próximas (30d)</p>
          <p className="text-2xl font-semibold text-warning-foreground">{proximas}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {EQUIPAMENTOS.map((e) => (
          <div key={e.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold">{e.nome}</h3>
                <p className="text-xs text-muted-foreground">{e.setor} · Criticidade {e.criticidade}</p>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls[e.status]}`}>
                {e.status === "Vencida" ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />} {e.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Última</p>
                <p className="font-medium">{new Date(e.ultima).toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Próxima</p>
                <p className="font-medium">{new Date(e.proxima).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
