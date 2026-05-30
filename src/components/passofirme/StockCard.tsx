import { BarChart3, History, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface StockItem {
  id: string;
  sku: string;
  nome: string;
  estoqueAtual: number;
  consumoMedioDiario: number;
  estoqueMinimo: number;
  leadTime: number;
  estoqueSeguranca: number;
}

export function StockCard({ item, onSolicitar }: { item: StockItem; onSolicitar?: (i: StockItem) => void }) {
  const ponto = item.consumoMedioDiario * item.leadTime + item.estoqueSeguranca;
  const cobertura = item.consumoMedioDiario > 0 ? Math.floor(item.estoqueAtual / item.consumoMedioDiario) : 999;
  const isRuptura = item.estoqueAtual < item.estoqueMinimo;
  const isPontoPedido = !isRuptura && item.estoqueAtual <= ponto;
  const status = isRuptura
    ? { label: "Ruptura", cls: "bg-destructive/15 text-destructive border-destructive/30" }
    : isPontoPedido
      ? { label: "Ponto de Pedido", cls: "bg-warning/25 text-warning-foreground border-warning/30" }
      : { label: "OK", cls: "bg-success/15 text-success border-success/30" };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.sku}</p>
          <h4 className="text-sm font-semibold truncate" title={item.nome}>{item.nome}</h4>
        </div>
        <span className={`shrink-0 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${status.cls}`}>{status.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-muted/40 px-2.5 py-2">
          <p className="text-muted-foreground text-[10px] uppercase">Estoque</p>
          <p className="text-lg font-semibold leading-tight">{item.estoqueAtual.toLocaleString("pt-BR")}</p>
        </div>
        <div className="rounded-lg bg-muted/40 px-2.5 py-2">
          <p className="text-muted-foreground text-[10px] uppercase">Cobertura</p>
          <p className={`text-lg font-semibold leading-tight ${cobertura < 7 ? "text-destructive" : cobertura < 15 ? "text-warning-foreground" : ""}`}>{cobertura}d</p>
        </div>
        <div className="rounded-lg bg-muted/40 px-2.5 py-2">
          <p className="text-muted-foreground text-[10px] uppercase">Ponto Pedido</p>
          <p className="text-sm font-semibold leading-tight">{Math.ceil(ponto).toLocaleString("pt-BR")}</p>
        </div>
        <div className="rounded-lg bg-muted/40 px-2.5 py-2">
          <p className="text-muted-foreground text-[10px] uppercase">Mín / Lead</p>
          <p className="text-sm font-semibold leading-tight">{item.estoqueMinimo} / {item.leadTime}d</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <Button size="sm" variant="outline" className="text-[11px] h-8 px-2" onClick={() => toast.info(`Histórico de ${item.nome}`, { description: "Abrindo painel de histórico de consumo." })}>
          <BarChart3 className="h-3 w-3" /> Histórico
        </Button>
        <Button size="sm" variant="outline" className="text-[11px] h-8 px-2" onClick={() => toast.info(`Movimentações de ${item.nome}`, { description: "Filtrando movimentações deste item." })}>
          <History className="h-3 w-3" /> Movim.
        </Button>
        <Button size="sm" className="text-[11px] h-8 px-2" onClick={() => onSolicitar?.(item)}>
          <Send className="h-3 w-3" /> Solicitar
        </Button>
      </div>
    </div>
  );
}
