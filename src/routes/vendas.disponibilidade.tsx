import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useDisponibilidade } from "@/lib/passofirme/store";
import { PRODUTOS_OFICIAIS, NUMERACOES } from "@/lib/passofirme/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Footprints } from "lucide-react";

export const Route = createFileRoute("/vendas/disponibilidade")({
  head: () => ({ meta: [{ title: "Disponibilidade de Produtos — PassoFirme" }] }),
  component: DisponibilidadePage,
});

function DisponibilidadePage() {
  const lista = useDisponibilidade();
  const [cat, setCat] = useState<string>("todos");
  const [num, setNum] = useState<string>("todas");

  const filtered = useMemo(() => lista.filter((p) => {
    if (cat !== "todos" && p.produto !== cat) return false;
    if (num !== "todas" && p.numeracao !== num) return false;
    return true;
  }), [lista, cat, num]);

  const totais = useMemo(() => ({
    estoque: filtered.reduce((a, p) => a + p.quantidade, 0),
    reservado: filtered.reduce((a, p) => a + p.reservado, 0),
    disponivel: filtered.reduce((a, p) => a + p.disponivel, 0),
    futuro: filtered.reduce((a, p) => a + p.futuro, 0),
  }), [filtered]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Footprints className="h-6 w-6 text-primary" /> Disponibilidade de Produtos
        </h1>
        <p className="text-sm text-muted-foreground">SKU = Produto + Cor + Numeração. Considera reservas de pedidos e ordens em produção.</p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-3 items-center">
        <Select value={cat} onValueChange={(v) => { setCat(v); setNum("todas"); }}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os produtos</SelectItem>
            {PRODUTOS_OFICIAIS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={num} onValueChange={setNum} disabled={cat === "todos"}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Numeração" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as numerações</SelectItem>
            {NUMERACOES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-4 text-xs">
          <span><strong className="text-foreground">{filtered.length}</strong> SKUs</span>
          <span>Estoque: <strong className="text-foreground">{totais.estoque}</strong></span>
          <span>Disponível: <strong className="text-success">{totais.disponivel}</strong></span>
          <span>Futuro: <strong className="text-info">{totais.futuro}</strong></span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">Nenhum SKU corresponde aos filtros.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition">
              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{p.codigo}</p>
                <h3 className="text-sm font-semibold">{p.produto}</h3>
                <p className="text-xs text-muted-foreground">{p.cor} · Numeração {p.numeracao}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground uppercase">Estoque</p><p className="text-lg font-semibold">{p.quantidade}</p></div>
                <div className="rounded-lg bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground uppercase">Reservado</p><p className="text-lg font-semibold text-warning-foreground">{p.reservado}</p></div>
                <div className="rounded-lg bg-success/10 p-2"><p className="text-[10px] text-muted-foreground uppercase">Disponível</p><p className="text-lg font-semibold text-success">{p.disponivel}</p></div>
                <div className="rounded-lg bg-info/10 p-2"><p className="text-[10px] text-muted-foreground uppercase">Em Produção</p><p className="text-lg font-semibold text-info">{p.emProducao}</p></div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Disponibilidade futura: <span className="font-medium text-foreground">{p.futuro}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
