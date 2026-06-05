import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useData } from "@/lib/passofirme/store";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/estoque/inventario")({
  head: () => ({ meta: [{ title: "Inventário Cíclico — PassoFirme" }] }),
  component: InventarioPage,
});

type Contagem = { id: string; data: string; divergencia: number; sistema: number; fisico: number; ajustado: boolean };

function InventarioPage() {
  const { materias } = useData();
  const [contagens, setContagens] = useState<Record<string, Contagem>>(() => {
    const seeds: Record<string, Contagem> = {};
    materias.slice(0, 6).forEach((m, i) => {
      const fisico = Math.max(0, m.estoqueAtual + (i % 2 === 0 ? -3 - i : 2 + i));
      seeds[m.id] = {
        id: m.id, data: "2026-05-20", sistema: m.estoqueAtual, fisico,
        divergencia: fisico - m.estoqueAtual, ajustado: i < 2,
      };
    });
    return seeds;
  });

  const stats = useMemo(() => {
    const arr = Object.values(contagens);
    const comDiv = arr.filter((c) => c.divergencia !== 0).length;
    const acuracia = arr.length ? +(((arr.length - comDiv) / arr.length) * 100).toFixed(1) : 100;
    return { total: arr.length, comDiv, acuracia };
  }, [contagens]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-primary" /> Inventário Cíclico
        </h1>
        <p className="text-sm text-muted-foreground">Contagens rotativas por categoria. Divergências geram ajuste auditável no estoque.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase">Itens contados</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase">Divergências</p>
          <p className="text-2xl font-semibold text-warning-foreground">{stats.comDiv}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase">Acuracidade</p>
          <p className={`text-2xl font-semibold ${stats.acuracia >= 95 ? "text-success" : "text-destructive"}`}>{stats.acuracia}%</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-right">Sistema</th>
              <th className="px-4 py-3 text-right">Físico</th>
              <th className="px-4 py-3 text-right">Divergência</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {materias.slice(0, 6).map((m) => {
              const c = contagens[m.id];
              if (!c) return null;
              return (
                <tr key={m.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{m.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.data}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.sistema}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.fisico}</td>
                  <td className={`px-4 py-3 text-right tabular-nums font-medium ${c.divergencia < 0 ? "text-destructive" : c.divergencia > 0 ? "text-warning-foreground" : "text-success"}`}>
                    {c.divergencia > 0 ? "+" : ""}{c.divergencia}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.ajustado ? (
                      <span className="inline-flex items-center gap-1 text-success text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Ajustado</span>
                    ) : c.divergencia !== 0 ? (
                      <span className="inline-flex items-center gap-1 text-warning-foreground text-xs"><AlertTriangle className="h-3.5 w-3.5" /> Pendente</span>
                    ) : (
                      <span className="text-success text-xs">OK</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!c.ajustado && c.divergencia !== 0 && (
                      <Button size="sm" variant="outline" onClick={() => {
                        setContagens((s) => ({ ...s, [m.id]: { ...c, ajustado: true } }));
                        toast.success(`Estoque de ${m.nome} ajustado`);
                      }}>Ajustar</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
