import { createFileRoute } from "@tanstack/react-router";
import { Rocket, Clock } from "lucide-react";

export const Route = createFileRoute("/vendas/crm-b2c")({
  head: () => ({ meta: [{ title: "CRM B2C — PassoFirme" }] }),
  component: CrmB2CPage,
});

function CrmB2CPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <h1 className="text-2xl font-semibold tracking-tight">CRM B2C</h1>
        <span className="text-[10px] rounded-full bg-warning/25 text-warning-foreground px-2 py-0.5 font-medium">
          Mês 5
        </span>
      </div>

      <div className="rounded-2xl border bg-card p-10 text-center shadow-sm max-w-3xl mx-auto">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
          <Rocket className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Canal B2C em preparação
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Operação prevista para o <strong className="text-foreground">Mês 5</strong> após estruturação
          completa do canal B2B. Esta área está reservada para a expansão comercial futura da PassoFirme.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg border bg-background p-3">
            <p className="font-medium">Site próprio</p>
            <p className="text-muted-foreground mt-1">Mês 5</p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="font-medium">Mercado Livre</p>
            <p className="text-muted-foreground mt-1">Mês 6</p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="font-medium">Instagram</p>
            <p className="text-muted-foreground mt-1">Mês 6</p>
          </div>
        </div>
      </div>
    </div>
  );
}
