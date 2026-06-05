import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useData } from "@/lib/passofirme/store";
import { Handshake, AlertTriangle } from "lucide-react";
import { brl } from "@/components/passofirme/ui-bits";

export const Route = createFileRoute("/compras/acordos")({
  head: () => ({ meta: [{ title: "Acordos de Fornecimento — PassoFirme" }] }),
  component: AcordosPage,
});

function AcordosPage() {
  const { fornecedores } = useData();
  const acordos = useMemo(() => fornecedores.map((f, i) => {
    const inicio = new Date(2026, 0, 1 + i * 7);
    const fim = new Date(2026, 11, 31);
    const diasParaFim = Math.ceil((fim.getTime() - Date.now()) / 86400000);
    return {
      id: f.id, fornecedor: f.nome, categoria: f.categoria,
      volumeContratado: 1500 + i * 400,
      volumeEntregue: Math.round((1500 + i * 400) * (0.4 + (i % 4) * 0.15)),
      precoFixo: 22 + i * 3.4,
      inicio: inicio.toISOString().slice(0, 10),
      fim: fim.toISOString().slice(0, 10),
      diasParaFim,
      otif: f.otif,
    };
  }), [fornecedores]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Handshake className="h-6 w-6 text-primary" /> Acordos de Fornecimento
        </h1>
        <p className="text-sm text-muted-foreground">Contratos vigentes com volumes, preços fixos e SLA. Renovação automática 30 dias antes do vencimento.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {acordos.map((a) => {
          const pct = Math.round((a.volumeEntregue / a.volumeContratado) * 100);
          return (
            <div key={a.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">{a.fornecedor}</h3>
                  <p className="text-xs text-muted-foreground">{a.categoria}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${a.otif >= 90 ? "bg-success/15 text-success" : "bg-warning/25 text-warning-foreground"}`}>
                  OTIF {a.otif}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-[10px] uppercase text-muted-foreground">Preço fixo</p>
                  <p className="font-semibold">{brl(a.precoFixo)}/un</p>
                </div>
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-[10px] uppercase text-muted-foreground">Vigência</p>
                  <p className="font-semibold">até {new Date(a.fim).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{a.volumeEntregue.toLocaleString("pt-BR")} / {a.volumeContratado.toLocaleString("pt-BR")} un</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${pct >= 75 ? "bg-success" : pct >= 50 ? "bg-primary" : "bg-warning"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>

              {a.diasParaFim < 60 && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-warning-foreground">
                  <AlertTriangle className="h-3.5 w-3.5" /> Renovação em {a.diasParaFim} dias
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
