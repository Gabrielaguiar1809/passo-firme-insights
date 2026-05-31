import { createFileRoute } from "@tanstack/react-router";
import { ControleOP } from "@/components/passofirme/ControleOP";

export const Route = createFileRoute("/admin/escritorio")({
  head: () => ({ meta: [{ title: "Controle de Escritório — PassoFirme" }] }),
  component: () => <ControleOP titulo="Controle de Escritório" descricao="Material de escritório e suprimentos administrativos." categoria="Escritório" />,
});
