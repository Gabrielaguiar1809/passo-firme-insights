import { createFileRoute } from "@tanstack/react-router";
import { ControleOP } from "@/components/passofirme/ControleOP";

export const Route = createFileRoute("/admin/limpeza")({
  head: () => ({ meta: [{ title: "Controle de Limpeza — PassoFirme" }] }),
  component: () => <ControleOP titulo="Controle de Limpeza" descricao="Itens de limpeza utilizados pela fábrica." categoria="Limpeza" />,
});
