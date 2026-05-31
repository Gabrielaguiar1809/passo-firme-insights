import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { StatusPill } from "@/components/passofirme/ui-bits";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/visao/plano-acao")({
  head: () => ({ meta: [{ title: "Plano de Ação — PassoFirme" }] }),
  component: PlanoAcaoPage,
});

const planoCls: Record<string, string> = {
  Aberto: "bg-info/15 text-info",
  "Em andamento": "bg-warning/25 text-warning-foreground",
  Concluído: "bg-success/15 text-success",
  Atrasado: "bg-destructive/15 text-destructive",
};

function PlanoAcaoPage() {
  const { planoAcao, addPlano, updatePlano } = useData();
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Plano de Ação</h1>
          <p className="text-sm text-muted-foreground">Acompanhe iniciativas em andamento com responsáveis e prazos.</p>
        </div>
        <Button size="sm" onClick={() => { addPlano({ problema: "Nova ação", responsavel: "—", prazo: new Date().toISOString().slice(0,10), status: "Aberto" }); toast.success("Ação adicionada"); }}>+ Nova Ação</Button>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">Problema</th><th className="px-4 py-3 text-left">Responsável</th><th className="px-4 py-3 text-left">Prazo</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {planoAcao.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{p.problema}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.responsavel}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.prazo}</td>
                <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${planoCls[p.status]}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => { const next = p.status === "Aberto" ? "Em andamento" : p.status === "Em andamento" ? "Concluído" : "Aberto"; updatePlano(p.id, { status: next as never }); }}>Avançar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
