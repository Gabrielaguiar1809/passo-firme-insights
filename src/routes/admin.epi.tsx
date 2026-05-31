import { createFileRoute } from "@tanstack/react-router";
import { ControleOP } from "@/components/passofirme/ControleOP";

export const Route = createFileRoute("/admin/epi")({
  head: () => ({ meta: [{ title: "Controle de EPIs — PassoFirme" }] }),
  component: () => <ControleOP titulo="Controle de EPIs" descricao="Equipamentos de proteção individual entregues aos colaboradores." categoria="EPI" />,
});
