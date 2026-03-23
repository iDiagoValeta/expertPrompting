# CLAUDE.md — PromptArchitect

Guía de contexto para Claude Code en este repositorio.

## ¿Qué es este proyecto?

**PromptArchitect** es una herramienta web para construir prompts optimizados para LLMs (Claude, GPT-4o, Gemini, Llama) mediante un wizard de 8 pasos. El prompt final se genera en tiempo real en un panel lateral.

- **Demo:** https://iDiagoValeta.github.io/expertPrompting/
- **Stack:** React 18 + Vite 5 + Tailwind CSS 3.4 + Lucide React
- **Deploy:** GitHub Pages via `gh-pages` branch

---

## Comandos esenciales

```bash
# Desarrollo local
cd prompt-flow
npm run dev          # http://localhost:5173

# Producción
npm run build        # Compila a dist/
npm run deploy       # Build + publica en gh-pages
```

---

## Estructura del código

```
prompt-flow/src/
├── App.jsx           # TODO el código: estado, buildPrompt, wizard, UI (~500 líneas)
└── data/
    └── templates.js  # 8 sectores + 30 casos de uso + SAFETY_TIPS
```

Un solo componente principal (`App.jsx`). No hay routing, no hay context API, no hay componentes separados en archivos distintos.

---

## Arquitectura clave

### buildPrompt (useMemo)
Función pura que genera el prompt final a partir del estado `data`. Se adapta automáticamente:
- **Claude** → estructura XML (`<persona>`, `<tarea>`, `<restricciones>`…)
- **GPT / Gemini / Llama** → estructura Markdown (`## SECCIÓN`, `**bold**`)

El helper `createTagHelper(modelId, useXMLTags)` devuelve una función `tag(name, content)` que aplica la estructura correcta.

### Estado principal (`data`)
```js
{
  model: 'claude'|'gpt'|'gemini'|'llama',
  role, experienceLevel, task, audienceLevel,
  context, inputData, constraints[],
  format, outputSchema, length, tone,
  // Técnicas base
  useCoT, useFewShot, useDecomposition,
  useMultiAgent, useXMLTags, usePreFill, useNegativeInstructions,
  // Técnicas avanzadas 2025
  useSelfConsistency, useReAct, useToT,
}
```

### Validación de pasos
Solo los pasos 2 (rol ≥ 3 chars) y 4 (tarea ≥ 10 chars) son obligatorios. El resto es opcional. Ver `isStepValid(stepIndex)`.

---

## Paleta de colores (Tailwind)

Definida en `tailwind.config.js` como `brand.*`:

| Token | Hex | Uso |
|-------|-----|-----|
| `brand.bg` | `#FAFAF9` | Fondo principal |
| `brand.primary` | `#4F46E5` | Acento indigo (pasos activos, botón Siguiente) |
| `brand.accent` | `#F59E0B` | CTA Copiar (amber) |
| `brand.success` | `#10B981` | Pasos completados, validación OK |
| `brand.preview` | `#1C1917` | Fondo panel derecho (oscuro) |

En la práctica se usa la escala Tailwind estándar (`stone-*`, `indigo-*`, `emerald-*`, `amber-*`) que coincide con estos valores.

---

## Convenciones de código

- **Clases Tailwind** via `cn()` (clsx + tailwind-merge) — nunca concatenar strings directamente
- **Animaciones** con `animate-slide-up` y `animate-fade-in` (definidas en `tailwind.config.js` + plugin `tailwindcss-animate`)
- **Scrollbar** en panel preview: clase `custom-scrollbar` (definida en `index.css`)
- **Scrollbar** en panel formulario: clase `form-scrollbar` (definida en `index.css`)
- Sin TypeScript — JSX puro
- Sin librerías de estado externas — solo `useState` / `useMemo` / `useEffect`

---

## Añadir una nueva técnica de prompting

1. Añadir campo boolean al estado inicial en `useState({ ... })` y en `reset()`
2. Añadir el `Toggle` correspondiente en el `case 6` de `renderStepContent()`
3. Añadir la lógica de generación de texto en `buildPrompt` (sección de razonamiento)
4. Actualizar el array `activeTechniques` en el header del prompt final

---

## Añadir un nuevo sector / caso de uso

Editar `src/data/templates.js`. Cada sector sigue esta estructura:

```js
{
  id: 'mi-sector',
  name: 'Nombre del Sector',
  icon: '🚀',
  description: 'Breve descripción.',
  useCases: [
    {
      id: 'mi-sector-caso1',
      title: 'Título del caso',
      role: 'Rol profesional',
      task: 'Descripción de la tarea',
      context: 'Contexto de aplicación',
      constraints: 'Restricción 1\nRestricción 2',
      tone: 'Profesional y Corporativo',   // debe coincidir con TONES[].label
      format: 'Markdown Estructurado',      // debe coincidir con FORMATS[].label
      examples: [{ input: '...', output: '...' }],  // opcional
      chainOfThought: 'Pasos de razonamiento...',   // opcional
    }
  ]
}
```

---

## Deploy

El `base` de Vite está fijado en `/expertPrompting/` (para GitHub Pages). No cambiarlo.

```bash
# Desde prompt-flow/
npm run deploy
# → build + publica en rama gh-pages automáticamente
```

GitHub Pages tarda ~1-2 minutos en actualizar tras el deploy.
