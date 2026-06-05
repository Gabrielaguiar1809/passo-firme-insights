import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/producao/sop")({
  head: () => ({ meta: [{ title: "SOP de Colagem — PassoFirme" }] }),
  component: SopPage,
});

const ETAPAS = [
  { id: 1, nome: "Lixamento", desc: "Lixar superfície do cabedal e solado para ativar aderência.", tempo: "2 min/par" },
  { id: 2, nome: "Limpeza com solvente", desc: "Remover poeira e gordura com pano embebido em solvente.", tempo: "1 min/par" },
  { id: 3, nome: "Aplicação de adesivo", desc: "Aplicar cola PU em camada uniforme nas duas superfícies.", tempo: "3 min/par" },
  { id: 4, nome: "Tempo de evaporação", desc: "Aguardar 10 minutos antes de unir as peças (tempo aberto).", tempo: "10 min" },
  { id: 5, nome: "Prensagem", desc: "Prensar a 4 bar por 8 segundos. Conferir alinhamento.", tempo: "8 seg/par" },
];

function SopPage() {
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const total = ETAPAS.length;
  const concluidas = Object.values(checks).filter(Boolean).length;
  const pct = Math.round((concluidas / total) * 100);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-primary" /> SOP — Processo de Colagem
        </h1>
        <p className="text-sm text-muted-foreground">Procedimento operacional padrão em 5 etapas com checklist obrigatório por turno.</p>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Progresso do checklist</span>
          <span className="text-muted-foreground">{concluidas}/{total} ({pct}%)</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {ETAPAS.map((e) => {
          const done = checks[e.id];
          return (
            <button
              key={e.id}
              onClick={() => {
                setChecks((s) => ({ ...s, [e.id]: !s[e.id] }));
                if (!done) toast.success(`Etapa ${e.id} marcada: ${e.nome}`);
              }}
              className={`w-full text-left rounded-xl border p-4 transition ${done ? "bg-success/5 border-success/30" : "bg-card hover:border-primary/40"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                  {done ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-semibold text-sm">{e.id}</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{e.nome}</h3>
                    <span className="text-xs text-muted-foreground">{e.tempo}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{e.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
