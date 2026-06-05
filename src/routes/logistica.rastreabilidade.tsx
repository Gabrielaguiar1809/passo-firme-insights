import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowDown, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/logistica/rastreabilidade")({
  head: () => ({ meta: [{ title: "Rastreabilidade de Lote — PassoFirme" }] }),
  component: RastreabilidadePage,
});

function RastreabilidadePage() {
  const [lote, setLote] = useState("LOT-2026-05-0142");
  const [busca, setBusca] = useState(lote);

  const trace = {
    lote: busca,
    mp: ["Couro Preto Premium (LOT-2026-05-0100)", "Solado EVA Branco (LOT-2026-05-0078)", "Cola PU (LOT-2026-05-0042)"],
    op: "OP-00518",
    produto: "Tênis Esportivo Preto 41",
    quantidade: 240,
    cliente: "Distribuidora Andar Bem",
    pedido: "PV-00891",
    expedicao: "2026-05-22",
    transportadora: "LogExpress",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Rastreabilidade de Lote</h1>
        <p className="text-sm text-muted-foreground">Busca bidirecional: do lote de MP até o cliente final, ou do pedido de volta às MPs consumidas.</p>
      </div>

      <div className="flex gap-2">
        <Input value={lote} onChange={(e) => setLote(e.target.value)} placeholder="Número do lote (ex: LOT-2026-05-0142)" className="max-w-md" />
        <Button onClick={() => setBusca(lote)}><Search className="h-4 w-4" /> Rastrear</Button>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="text-center">
          <p className="text-[10px] uppercase text-muted-foreground">Lote rastreado</p>
          <p className="text-lg font-mono font-semibold">{trace.lote}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><ArrowUp className="h-4 w-4 text-primary" /> Origem (Matérias-Primas)</h3>
            <div className="space-y-2">
              {trace.mp.map((m, i) => (
                <div key={i} className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">{m}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><ArrowDown className="h-4 w-4 text-primary" /> Destino (Produção → Cliente)</h3>
            <div className="space-y-2 text-sm">
              <div className="rounded-lg border bg-muted/30 px-3 py-2"><span className="text-muted-foreground">OP:</span> <span className="font-medium">{trace.op}</span></div>
              <div className="rounded-lg border bg-muted/30 px-3 py-2"><span className="text-muted-foreground">Produto:</span> <span className="font-medium">{trace.produto}</span> · {trace.quantidade} pares</div>
              <div className="rounded-lg border bg-muted/30 px-3 py-2"><span className="text-muted-foreground">Pedido:</span> <span className="font-medium">{trace.pedido}</span> · {trace.cliente}</div>
              <div className="rounded-lg border bg-muted/30 px-3 py-2"><span className="text-muted-foreground">Expedição:</span> {new Date(trace.expedicao).toLocaleDateString("pt-BR")} via {trace.transportadora}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
