import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { StatusPill } from "@/components/passofirme/ui-bits";

export const Route = createFileRoute("/admin/solicitacoes")({
  head: () => ({ meta: [{ title: "Solicitações Internas — PassoFirme" }] }),
  component: SolicitacoesInternasPage,
});

function SolicitacoesInternasPage() {
  const { requisicoes } = useData();
  // setores administrativos
  const adminSetores = ["Administrativo"];
  const list = requisicoes.filter((r) => adminSetores.includes(r.setor) || r.itemTipo === "OP");
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Solicitações Internas</h1>
        <p className="text-sm text-muted-foreground">Requisições de itens operacionais e administrativos.</p>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">Nº</th><th className="px-4 py-3 text-left">Setor</th><th className="px-4 py-3 text-left">Item</th><th className="px-4 py-3 text-right">Qtd</th><th className="px-4 py-3 text-left">Prioridade</th><th className="px-4 py-3 text-left">Status</th></tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{r.numero}</td>
                <td className="px-4 py-3">{r.setor}</td>
                <td className="px-4 py-3 font-medium">{r.item}</td>
                <td className="px-4 py-3 text-right">{r.quantidade}</td>
                <td className="px-4 py-3"><StatusPill status={r.prioridade} /></td>
                <td className="px-4 py-3"><StatusPill status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
