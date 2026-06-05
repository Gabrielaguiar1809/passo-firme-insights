import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";

export const Route = createFileRoute("/logistica/transportadoras")({
  head: () => ({ meta: [{ title: "Transportadoras — PassoFirme" }] }),
  component: TransportadorasPage,
});

const TRANSPS = [
  { id: "t1", nome: "LogExpress", regiao: "Sudeste", entregaPrazo: 96, avarias: 1.2, custoMedio: 480, atendimento: 9.0 },
  { id: "t2", nome: "RotaSul Cargo", regiao: "Sul", entregaPrazo: 91, avarias: 2.1, custoMedio: 420, atendimento: 8.4 },
  { id: "t3", nome: "Nordeste Frete", regiao: "Nordeste", entregaPrazo: 78, avarias: 3.5, custoMedio: 620, atendimento: 7.6 },
  { id: "t4", nome: "TransBrasil", regiao: "Nacional", entregaPrazo: 88, avarias: 1.8, custoMedio: 560, atendimento: 8.2 },
];

function iqf(t: typeof TRANSPS[number]) {
  return +(t.entregaPrazo * 0.045 + (10 - t.avarias) * 0.3 + t.atendimento * 0.25).toFixed(2);
}

function TransportadorasPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" /> Transportadoras
        </h1>
        <p className="text-sm text-muted-foreground">Performance e IQF Logístico baseado em prazo, avarias, custo e atendimento.</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Transportadora</th>
              <th className="px-4 py-3 text-left">Região</th>
              <th className="px-4 py-3 text-right">Entrega no prazo</th>
              <th className="px-4 py-3 text-right">Avarias</th>
              <th className="px-4 py-3 text-right">Custo médio</th>
              <th className="px-4 py-3 text-right">Atendimento</th>
              <th className="px-4 py-3 text-right">IQF</th>
            </tr>
          </thead>
          <tbody>
            {TRANSPS.map((t) => {
              const i = iqf(t);
              return (
                <tr key={t.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{t.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.regiao}</td>
                  <td className={`px-4 py-3 text-right tabular-nums ${t.entregaPrazo >= 90 ? "text-success" : t.entregaPrazo >= 80 ? "text-warning-foreground" : "text-destructive"}`}>{t.entregaPrazo}%</td>
                  <td className={`px-4 py-3 text-right tabular-nums ${t.avarias > 3 ? "text-destructive" : t.avarias > 2 ? "text-warning-foreground" : "text-success"}`}>{t.avarias}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">R$ {t.custoMedio}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{t.atendimento}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${i >= 8 ? "bg-success/15 text-success" : i >= 6 ? "bg-warning/25 text-warning-foreground" : "bg-destructive/15 text-destructive"}`}>{i}</span>
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
