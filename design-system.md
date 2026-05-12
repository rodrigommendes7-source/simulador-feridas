# Design System — Simulador de Feridas

> Documento de referência para o Claude Code.  
> Lê este ficheiro antes de tocar em qualquer CSS ou componente.  
> O ficheiro `design-tokens.css` contém todas as variáveis prontas a usar.

---

## Como usar este documento

1. Importa `design-tokens.css` no topo do CSS global (ou em `globals.css` / `index.css`)
2. Usa **sempre variáveis CSS** — nunca escreve cores ou tamanhos em hardcode
3. Segue as regras de cada secção antes de criar ou modificar um componente

---

## 01 · Cores

### Regra principal
> Nunca usa um valor hex diretamente no CSS de um componente. Usa sempre `var(--color-*)`.

### Fundos — escala de profundidade
Usa sempre a escala correta conforme a camada do elemento:

| Variável | Hex | Usa em |
|---|---|---|
| `--color-base` | `#0D1B2A` | `body`, fundo da página |
| `--color-surface` | `#132338` | Cards, painéis, sidebars |
| `--color-elevated` | `#1C3150` | Hover, selected, inputs, itens de lista |
| `--color-border` | `#2B4A6F` | Bordas em hover, separadores fortes |
| `--color-border-subtle` | `#1C3150` | Bordas padrão de cards |

### Destaque — âmbar
| Variável | Uso |
|---|---|
| `--color-accent` | Botão primário, progresso, score, ativo |
| `--color-accent-hover` | Hover do botão primário |
| `--color-accent-subtle` | Fundo de badges âmbar |
| `--color-accent-border` | Borda de badges âmbar |

### Texto
| Variável | Uso |
|---|---|
| `--color-text-primary` | Títulos, corpo principal, valores |
| `--color-text-secondary` | Labels, descrições, meta, captions |
| `--color-text-disabled` | Placeholders, estados vazios, "—" |

### Cores semânticas (estado clínico)
| Estado | Cor base | Usa em |
|---|---|---|
| Sucesso / Correto | `--color-success` | Resposta certa, caso concluído, nível introdutório |
| Atenção / Rever | `--color-warning` | Nível intermédio, feedback de revisão |
| Erro / Incorreto | `--color-error` | Resposta errada, nível avançado, crítico |
| Info / Dica | `--color-info` | Dicas clínicas, informação neutra |

Para fundos e bordas semânticas usa sempre as variantes `--color-*-subtle` e `--color-*-border`.

---

## 02 · Tipografia

### Famílias
```css
font-family: var(--font-sans);  /* Inter — todo o texto */
font-family: var(--font-mono);  /* JetBrains Mono — valores numéricos, scores, tokens */
```

### Importar as fontes (no `<head>` ou CSS global)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```

### Escala de tamanhos
| Classe / Variável | Tamanho | Peso | Usa em |
|---|---|---|---|
| `--text-h1` | 22px | 500 | Título de página |
| `--text-h2` | 17px | 500 | Título de secção |
| `--text-h3` | 14px | 500 | Título de card, item de lista |
| `--text-body` | 13px | 400 | Corpo de texto, descrições |
| `--text-label` | 11px | 500 | Labels uppercase, captions, badges |
| `--text-badge` | 10px | 500 | Badges, tags de estado |
| `--text-mono` | 12px | 400 | Scores, percentagens, HEX |

### Regras tipográficas
- **Apenas dois pesos:** 400 (regular) e 500 (medium). Nunca 600, 700 ou bold.
- **Eyebrows e labels de secção:** sempre uppercase + `letter-spacing: var(--tracking-label)` + `color: var(--color-accent)`
- **Valores numéricos** (score, %, contagens): sempre `font-family: var(--font-mono)` + `color: var(--color-accent)`
- **Nunca** mistura pesos dentro do mesmo nível de hierarquia

---

## 03 · Espaçamento

Usa sempre as variáveis — nunca valores em px soltos:

| Variável | Valor | Usa em |
|---|---|---|
| `--space-xs` | 4px | Gap entre ícone e label, gap interno de badge |
| `--space-sm` | 8px | Gap entre elementos inline |
| `--space-md` | 12px | Padding interno de alertas, gap de lista |
| `--space-lg` | 16px | Padding de card, gap entre cards |
| `--space-xl` | 20px | Padding de secção pequena |
| `--space-2xl` | 24px | Padding horizontal de página |
| `--space-3xl` | 32px | Padding de hero, espaçamento entre secções |
| `--space-4xl` | 40px | Espaçamento grande entre blocos |
| `--space-nav` | 52px | Altura fixa da navbar |

---

## 04 · Border Radius

| Variável | Valor | Usa em |
|---|---|---|
| `--radius-xs` | 3px | Tags, badges, divisores |
| `--radius-sm` | 6px | Botões sm, links de nav |
| `--radius-md` | 8px | Botões padrão, inputs |
| `--radius-lg` | 10px | Cards principais, itens de lista |
| `--radius-xl` | 12px | Painéis, modais, sidebars |
| `--radius-pill` | 9999px | Pills de estado, avatares, contadores |

---

## 05 · Bordas

Usa sempre as variáveis — nunca cores em hardcode:

```css
border: var(--border-default);        /* Cards padrão */
border: var(--border-hover);          /* Hover de cards, inputs em repouso */
border: var(--border-accent);         /* Destaque sutil âmbar */
border-left: var(--border-accent-strong); /* Acento lateral (card ativo) */
```

**Espessura:** sempre `0.5px` para bordas de contentor. Só `2px` para o acento lateral de card ativo.

---

## 06 · Componentes — Regras de uso

### Botões
```html
<!-- Primário: ação principal da página (1 por ecrã) -->
<button class="btn btn-primary">Iniciar caso</button>

<!-- Secundário: ação alternativa relevante -->
<button class="btn btn-secondary">Guardar rascunho</button>

<!-- Ghost: ação de menor prioridade -->
<button class="btn btn-ghost">Cancelar</button>

<!-- Perigo: ação destrutiva -->
<button class="btn btn-danger">Eliminar caso</button>

<!-- Tamanhos -->
<button class="btn btn-primary btn-sm">Pequeno</button>
<button class="btn btn-primary btn-lg">Grande</button>
```

### Badges de nível (casos clínicos)
```html
<span class="badge badge-intro">Introdutório</span>  <!-- verde -->
<span class="badge badge-inter">Intermédio</span>    <!-- âmbar -->
<span class="badge badge-avance">Avançado</span>     <!-- vermelho -->
```

### Tags de estado (respostas, progresso)
```html
<span class="tag tag-success">Correto</span>
<span class="tag tag-warning">Rever</span>
<span class="tag tag-error">Incorreto</span>
<span class="tag tag-neutral">Pendente</span>
```

### Cards
```html
<!-- Card padrão -->
<div class="card">...</div>

<!-- Card clicável (com cursor pointer e hover) -->
<div class="card card-clickable">...</div>

<!-- Card com acento âmbar (ativo / recomendado) -->
<div class="card card-accent">...</div>
```

### Alertas de feedback clínico
```html
<div class="alert alert-success">
  <div class="alert-dot" style="background: var(--color-success)"></div>
  Decisão correta — o desbridamento está indicado.
</div>

<div class="alert alert-warning">
  <div class="alert-dot" style="background: var(--color-accent)"></div>
  Atenção — considera avaliar o exsudado primeiro.
</div>

<div class="alert alert-info">
  <div class="alert-dot" style="background: var(--color-info)"></div>
  Dica — lesões de grau II raramente requerem antibioterapia.
</div>
```

### Barras de progresso por tema
```html
<div class="progress-track">
  <div class="progress-fill" style="width: 68%"></div>
</div>
```
> O `width` é sempre definido inline via JS/framework — nunca em CSS estático.

### Inputs
```html
<label class="input-label">Nome do caso</label>
<input class="input" type="text" placeholder="ex: Lesão por pressão">
```

---

## 07 · Movimento & Transições

### Regras obrigatórias
- **Hover de botões e cards:** `transition: background var(--transition-fast), border-color var(--transition-fast)`
- **Aparecer / desaparecer (modais, toasts):** `opacity 0→1 + translateY(4px→0)` em `var(--transition-normal)`
- **Barras de progresso:** `width` com `var(--transition-progress)` ao montar o componente
- **Clique de botão:** `transform: scale(0.97)` em `:active` com `var(--transition-press)`
- **Nunca** anima `width`, `height` ou `padding` de layout — só `opacity`, `transform`, e cores

---

## 08 · Anti-padrões — O que nunca fazer

| ❌ Errado | ✅ Correto |
|---|---|
| `color: #F5F0E8` | `color: var(--color-text-primary)` |
| `font-weight: 700` | `font-weight: var(--weight-medium)` |
| `border: 1px solid #333` | `border: var(--border-default)` |
| `border-radius: 4px` | `border-radius: var(--radius-xs)` |
| `gap: 10px` | `gap: var(--space-sm)` ou `var(--space-md)` |
| `font-size: 12px` num título | usar a variável `--text-h3` |
| `font-weight: 600` | não existe — usa 500 |
| fundo branco em qualquer componente | sempre `--color-base`, `--color-surface` ou `--color-elevated` |

---

## 09 · Estrutura de ficheiros recomendada

```
/src
  /styles
    design-tokens.css   ← importa sempre primeiro
    globals.css         ← reset + body + tipografia base
    componentes/
      buttons.css
      cards.css
      badges.css
      alerts.css
      nav.css
      progress.css
      inputs.css
  /componentes
    ...
```

Em frameworks com CSS modules ou Tailwind, define os tokens como variáveis CSS globais em `:root` e usa-os via `var()` dentro dos estilos de cada componente.

---

## 10 · Checklist antes de fazer commit

- [ ] Usei `var(--color-*)` em todas as cores?
- [ ] Usei apenas peso 400 ou 500?
- [ ] O fundo mais profundo é `--color-base` e os cards são `--color-surface`?
- [ ] Os botões primários são âmbar (`--color-accent`)?
- [ ] As transições usam as variáveis `--transition-*`?
- [ ] Não há valores em px soltos fora das variáveis de espaçamento?
