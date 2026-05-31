# Plano: Evolução do PassoFirme para plataforma integrada por setores

Manter identidade visual, cores, dashboard atual e todos os dados fictícios existentes. Evoluir estrutura, menu e adicionar módulos faltantes — tudo compartilhando a mesma base de dados em `src/lib/passofirme/store.tsx`.

## 1. Menu lateral — reorganização por setores

Reescrever `AppSidebar.tsx` usando `Collapsible` (já disponível em shadcn) por grupo. Cada setor é expansível/recolhível.

```text
📊 Visão Geral
   ├ Dashboard Executivo        → /
   ├ Indicadores Gerais         → /indicadores
   ├ Observações Estratégicas   → /visao/observacoes  (novo)
   ├ Plano de Ação              → /visao/plano-acao   (novo)
   └ Sugestões de Melhoria      → /visao/sugestoes    (novo)

💰 Vendas
   ├ CRM B2B                    → /vendas/crm-b2b     (novo)
   ├ CRM B2C                    → /vendas/crm-b2c     (novo)
   ├ Pedidos de Venda           → /vendas/pedidos     (novo)
   ├ Disponibilidade            → /vendas/disponibilidade (novo)
   ├ Programação de Produção    → /producao/programacao (compartilhada)
   └ Indicadores Comerciais     → /vendas/indicadores (novo)

🛒 Compras
   ├ Planejamento               → /planejamento  (existe)
   ├ Requisições                → /requisicoes   (existe)
   ├ Cotações                   → /cotacoes      (existe)
   ├ Fornecedores               → /fornecedores  (existe)
   ├ Pedidos de Compra          → /pedidos       (existe)
   └ Indicadores de Compras     → /compras/indicadores (novo, derivado)

📦 Estoque
   ├ Estoque MP                 → /estoque              (existe)
   ├ Estoque Operacional        → /estoque-operacional  (existe)
   ├ Movimentações              → /movimentacoes        (existe)
   ├ Recebimentos               → /estoque/recebimentos (novo, derivado dos pedidos recebidos)
   ├ Devoluções                 → /estoque/devolucoes   (novo, filtro de movimentações)
   └ Indicadores de Estoque     → /estoque/indicadores  (novo)

🏭 Produção
   ├ Programação de Produção    → /producao/programacao (novo, lista planejamentos)
   ├ Ordens de Produção         → /producao/ordens      (novo)
   ├ Consumo de MP              → /producao/consumo     (novo)
   ├ Produto Acabado            → /produtos             (existe)
   ├ Gargalos da Produção       → /producao/gargalos    (novo)
   └ Indicadores Operacionais   → /producao/indicadores (novo)

🏢 Administrativo
   ├ Solicitações Internas      → /admin/solicitacoes   (novo, filtra requisições operacionais)
   ├ Controle de Limpeza        → /admin/limpeza        (novo, filtra Estoque OP)
   ├ Controle de Escritório     → /admin/escritorio     (novo, filtra Estoque OP)
   ├ Controle de EPIs           → /admin/epi            (novo, filtra Estoque OP)
   └ Indicadores Administrativos→ /admin/indicadores    (novo)

🤖 Inteligência
   ├ Assistente IA              → /assistente           (existe)
   ├ Relatórios                 → /inteligencia/relatorios (novo)
   ├ Observações Estratégicas   → /visao/observacoes    (reuso)
   ├ Sugestões de Melhoria      → /visao/sugestoes      (reuso)
   └ Histórico de Melhorias     → /inteligencia/historico (novo)

⚙️ Configurações                → /configuracoes (existe)
```

## 2. Base de dados — extensões em `data.ts` e `store.tsx`

Adicionar (sem remover nada):
- `clientesB2BSeed`, `clientesB2CSeed` (lead, status do funil, valor, contato).
- `pedidosVendaSeed` (cliente, produto existente em `produtosSeed`, qtd, status).
- `ordensProducaoSeed` (OP nº, produto, qtd planejada, qtd produzida, status, datas) — geradas a partir dos `planejamentosSeed` existentes.
- `gargalosSeed` (etapa: Corte/Pesponto/Montagem/Acabamento, status, observação).
- `observacoesSeed`, `planoAcaoSeed`, `sugestoesMelhoriaSeed`, `historicoMelhoriasSeed`.

Tudo derivado/coerente com `produtosSeed`, `materiasSeed`, `itensOperacionalSeed` já existentes — sem duplicar.

Novos hooks derivados:
- `useIndicadoresVendas` (conversão, ticket médio, novos clientes).
- `useIndicadoresCompras` (saving, OTIF, IQF — reusa).
- `useIndicadoresProducao` (atingimento meta, produtividade, retrabalho, lead time, consumo MP).
- `useIndicadoresEstoque` (cobertura média, % ruptura, valor parado).
- `useDisponibilidadeProdutos` (estoque − reservado em pedidos de venda + em produção das OPs).

## 3. Páginas novas (cards + indicadores visuais, evitar tabelões)

Cada rota nova segue o padrão atual (`KpiCard`, gráficos Recharts, listas em cards). Páginas:

- **Vendas:** `crm-b2b.tsx` e `crm-b2c.tsx` (Kanban por estágio do funil), `pedidos-venda.tsx`, `disponibilidade.tsx`, `indicadores-comerciais.tsx`.
- **Produção:** `programacao.tsx`, `ordens.tsx`, `consumo.tsx`, `gargalos.tsx` (cards por etapa com semáforo), `indicadores-prod.tsx`.
- **Visão Geral:** `observacoes.tsx`, `plano-acao.tsx`, `sugestoes.tsx`.
- **Administrativo:** páginas filtradas reusando `StockCard` e `DataTable` existentes.
- **Compras/Estoque indicadores:** páginas dedicadas reusando hooks.
- **Inteligência:** `relatorios.tsx`, `historico.tsx`.

## 4. Integração entre setores (regra crítica)

- Ao "fechar" pedido de venda → reserva produto acabado (reduz `disponivel = estoque − reservado`).
- Ao concluir uma OP → soma quantidade ao `produtosSeed.estoque` e gera movimentação de consumo de MP (já temos o motor de movimentações).
- KPIs do dashboard executivo (`/`) ganham 2 novos cards (Vendas do mês, Produção do mês) calculados a partir de pedidos de venda + ordens de produção, **sem alterar o layout/cor já existentes**.

## 5. Arquivos a criar/editar

**Editar (sem quebrar):**
- `src/components/passofirme/AppSidebar.tsx` — grupos expansíveis.
- `src/lib/passofirme/data.ts` — novos seeds + tipos.
- `src/lib/passofirme/store.tsx` — novos estados, ações, hooks derivados.
- `src/routes/index.tsx` — adicionar 2 KPIs (Vendas/Produção do mês) preservando o resto.
- `src/routeTree.gen.ts` — registrar novas rotas.

**Criar (~20 novas rotas listadas acima).**

## 6. Garantias
- Não remover nenhuma rota/arquivo existente.
- Não alterar `styles.css` nem paleta.
- Reusar `KpiCard`, `DataTable`, `StockCard`, `ui-bits`.
- Todos os dados compartilhados via `useData()` — sem duplicação.
