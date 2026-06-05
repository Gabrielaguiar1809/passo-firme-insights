import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useData } from "@/lib/passofirme/store";
import { AlertTriangle, Calendar } from "lucide-react";

export const Route = createFileRoute("/estoque/vencimentos")({
  head: () => ({ meta: [{ title: "Vencimentos de Químicos — PassoFirme" }] }),
  component: VencimentosPage,
});

function VencimentosPage() {
  const { materias } = useData();
  const itens = useMemo(() => {
    const quimicos = materias.filter((m) => m.categoria === "Colas e Químicos");
    return quimicos.map((m, i) => {
      const diasParaVencer = [12, 45, 90, 180, 7][i % 5];
      const venc = new Date();
      venc.setDate(venc.getDate() + diasParaVencer);
      return { ...m, diasParaVencer, vencimento: venc.toISOString().slice(0, 10), lote: `LOT-2026-05-${String(100 + i).padStart(4, "0")}` };
    });
  }, [materias]);

  const criticos = itens.filter((i) => i.diasParaVencer <= 30);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" /> Controle de Vencimento de Químicos
        </h1>
        <p className="text-sm text-muted-foreground">Rastreamento por lote. Itens com menos de 30 dias para vencer entram em alerta.</p>
      </div>

      {criticos.length > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
          <div>
            <p className="text-sm font-medium">{criticos.length} {criticos.length === 1 ? "lote vencendo em breve" : "lotes vencendo em breve"}</p>
            <p className="text-xs text-muted-foreground">Consuma esses lotes prioritariamente ou solicite descarte.</p>
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {itens.map((i) => {
          const status = i.diasParaVencer <= 15 ? "destructive" : i.diasParaVencer <= 30 ? "warning" : "success";
          const cls = status === "destructive" ? "border-destructive/40 bg-destructive/5" : status === "warning" ? "border-warning/40 bg-warning/5" : "border-success/30 bg-success/5";
          return (
            <div key={i.id} className={`rounded-xl border p-4 ${cls}`}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{i.lote}</p>
              <h3 className="text-sm font-semibold mt-1">{i.nome}</h3>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase">Vencimento</p>
                  <p className="font-semibold">{new Date(i.vencimento).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase">Faltam</p>
                  <p className={`font-semibold ${status === "destructive" ? "text-destructive" : status === "warning" ? "text-warning-foreground" : "text-success"}`}>{i.diasParaVencer}d</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-[10px] uppercase">Estoque atual</p>
                  <p className="font-semibold">{i.estoqueAtual} un</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
