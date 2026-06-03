## Escopo

O prompt cobre 10 seções e dezenas de telas novas em Estoque, Compras, Produção, Logística + ajustes em Vendas e Visão Geral. É grande demais para uma única entrega coerente — proponho dividir em **4 fases**, mantendo tudo no padrão atual (TanStack Router, store fictícia em `src/lib/passofirme/store.tsx`, sem banco real).

## Fase 1 — Fundação (esta entrega)

Itens críticos que destravam todo o resto:

1. **Padronização global de produtos (Seção 1)**
   - Reduzir `produtosSeed` para apenas **Tênis Esportivo** e **Tênis Casual**, cores variadas, numerações 37–42. SKU = `Produto + Cor + Numeração`.
   - Remover qualquer referência a "Sapato Executivo" / outros modelos em seeds, cards, gráficos e dropdowns.
   - Helper único `PRODUTOS_OFICIAIS` e `NUMERACOES` reutilizado em todo o sistema.

2. **CRM B2C inativado (Seção 2)**
   - Substituir conteúdo por banner "Operação prevista para o Mês 5", manter no menu com badge "Mês 5".

3. **Vendas — complementos (Seção 3)**
   - Filtros cascata Categoria → Numeração na tela de Disponibilidade.
   - Grade de numeração (37–42) ao criar/editar Pedido de Venda, com cálculo automático de Disponível e Situação (verde/amarelo/vermelho) e alerta de exceção.

4. **Lote interno** — tipo + gerador `LOT-AAAA-MM-NNNN` na store (usado por todas as fases seguintes).

## Fase 2 — Estoque + Compras (Seções 4 e 5)

- Estoque MP por SKU com ponto de pedido automático, Controle de Vencimento de químicos, Inventário Cíclico, Devoluções a Fornecedor, Indicadores reestruturados.
- Recebimentos com fluxo de 3 etapas (identificação → conferência → inspeção) e quarentena.
- Compras: Planejamento calculado, fluxo de aprovação por valor, Fichas de Especificação, matriz comparativa ponderada de cotações, IQF com 4 componentes, Acordos de Fornecimento, Indicadores.

## Fase 3 — Produção + Logística (Seções 6 e 7)

- PCP semanal com sequenciamento, OPs com checklist, SOP de Colagem (5 etapas), Pontos de Verificação, Manutenção Preventiva, Consumo Real vs Planejado, Indicadores (Aderência, OEE, Retrabalho, Setup).
- Logística: agendamento de recebimentos, Rastreabilidade de Lote (consulta bidirecional), Logística Reversa em 5 etapas com SLA, Transportadoras com IQF próprio, Indicadores Logísticos.

## Fase 4 — Integrações e Consolidação (Seções 8, 9, 10)

- Fluxos automáticos entre módulos (Vendas→Produção→Estoque→Compras→Logística) ligados via store compartilhada.
- Painel consolidado por setor na Visão Geral com semáforos clicáveis.
- Regras globais (bloqueio de quarentena, IQF vermelho fora de cotações/expedições, alerta SLA devoluções).

## Detalhes técnicos

- Tudo continua em `src/lib/passofirme/data.ts` + `store.tsx` (sem backend). Hooks derivados expostos via `useData()`.
- Rotas novas seguem padrão dot-notation (`estoque.inventario.tsx`, `compras.fichas.tsx`, `producao.sop.tsx`, `logistica.transportadoras.tsx`, etc.) — o Vite plugin gera o tree.
- Reusar `KpiCard`, `DataTable`, `StockCard`, `Kanban`, `ControleOP`. Sem mudar `styles.css` nem paleta.
- `category-icons.tsx` cobre os novos ícones (Lucide).

## Pergunta

Confirma começar pela **Fase 1** agora? Ou prefere outra ordem (por exemplo, atacar Produção primeiro)?
