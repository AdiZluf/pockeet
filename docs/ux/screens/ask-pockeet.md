# Ask Pockeet

**Route:** `ask` (modal from Home card)  
**Purpose:** Chat-like UI for spending questions — **canned SQLite-backed answers in MVP+**; real LLM deferred.

## Entry points

| Entry | Behavior |
|-------|----------|
| Home card | Tap card or suggested chip → open modal |
| Ask modal | Text input + suggested questions |

## Home card (inline)

- Title: “Ask Pockeet”
- Subtitle: “Questions about your spending”
- 3 suggested question chips (static rotation)
- Tap → `ask` modal

## Ask modal layout

1. Header — title + close
2. Transcript — user bubble + assistant bubble
3. Suggested questions row
4. Text input + Send
5. Footer disclaimer — estimates from saved receipts; not financial advice

## Mock behavior (MVP+)

- 400–800ms “thinking” state on send
- Keyword → canned response map (EN):
  - restaurant/dining → `cat_dining` total for current calendar month
  - shufersal → merchant ILIKE, last 90 days
  - category/increased → compare current vs previous month breakdown
  - 500g/meat/price per → “coming soon” fallback
- Unknown → generic help copy

## Excluded MVP+

- LLM, RAG, embeddings, line-item SKU normalization

## Related

- [home.md](home.md) · [data-model](../../engineering/data-model.md)
