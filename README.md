# PromptArchitect

Constructor profesional de prompts para IA. Genera prompts optimizados paso a paso para Claude, GPT-4o, Gemini y Llama usando las técnicas más avanzadas de ingeniería de prompts 2025–2026.

**Demo:** [iDiagoValeta.github.io/expertPrompting](https://iDiagoValeta.github.io/expertPrompting/)

---

## Inicio Rápido

```bash
cd prompt-flow
npm install
npm run dev
# → http://localhost:5173
```

---

## Técnicas Implementadas

### Técnicas Base

| Técnica | Descripción | Cuándo usarla |
|---------|-------------|---------------|
| **Chain-of-Thought (CoT)** | El modelo razona paso a paso antes de responder | Problemas complejos, matemáticas, análisis |
| **Few-Shot Learning** | Provee 1–5 ejemplos de entrada/salida | Cuando el formato de salida es crítico |
| **Role Prompting** | Asigna un rol/expertise específico a la IA | Siempre — mejora consistencia y calidad |
| **Prompt Decomposition** | Divide la tarea en sub-pasos explícitos | Tareas multi-paso o de planificación |
| **Multi-Agent Debate** | Simula debate interno entre perspectivas | Decisiones con múltiples puntos de vista |
| **Anti-Alucinación (Guardrails)** | Instrucciones para admitir incertidumbre | Siempre que se requieran hechos precisos |
| **XML/Markdown Structuring** | Delimita secciones semánticamente | Prompts complejos con múltiples partes |

### Técnicas Avanzadas (2025–2026)

#### Self-Consistency
Genera múltiples razonamientos independientes y selecciona el más consistente mediante votación mayoritaria.

```
Efectivo en: tareas de razonamiento aritmético, sentido común, inferencia simbólica.
Combinación potente: CoT + Self-Consistency aumenta precisión ~20% sobre CoT solo.
```

#### ReAct (Reasoning + Acting)
Patrón iterativo que alterna pensamiento explícito con acciones concretas:

```
Pensamiento: [analiza qué necesitas hacer]
Acción:      [ejecuta un paso concreto]
Observación: [evalúa el resultado]
→ Repite hasta la respuesta final
```

Ideal para agentes con acceso a herramientas externas (búsqueda, código, APIs).

#### Tree of Thoughts (ToT)
Explora múltiples ramas de razonamiento en paralelo antes de converger:

```
Enfoque A → evalúa
Enfoque B → evalúa   →  Sintetiza la mejor solución
Enfoque C → evalúa
```

Beneficia tareas de planificación estratégica y problemas con múltiples soluciones válidas.

---

## Diferencias por Modelo

### Claude (Anthropic) — Estructura XML
- Prefiere contexto amplio y etiquetas XML semánticas (`<persona>`, `<tarea>`, `<restricciones>`)
- Excelente en: documentos largos, análisis cuidadoso, razonamiento multi-paso
- Sigue instrucciones con precisión incluso en prompts muy largos
- Constitutional AI: detecta y rechaza solicitudes problemáticas de forma natural
- **Best practice:** usa `<thinking>` para CoT y pre-fill con `{` para forzar JSON

### GPT-4o (OpenAI) — Estructura Markdown
- Prefiere esquemas estrictos y Markdown con `##` y `**negrita**`
- Excelente en: código limpio ejecutable, JSON exacto, comentarios inline
- **Best practice:** especifica formato primero, usa word counts y schemas explícitos

### Gemini 2.5 (Google) — Estructura Markdown
- Preferible para pipelines de investigación y tareas multimodales (texto + imágenes)
- Excelente en: summarización, digestión de información, análisis de fuentes
- **Best practice:** especifica el scope claramente y lista las fuentes a considerar

### Llama 3 (Meta) — Estructura Markdown simple
- Modelo open-source optimizado para instrucciones directas y simples
- Menos tolerante a prompts muy largos o complejos
- **Best practice:** instrucciones concisas, evita anidamiento profundo de etiquetas

---

## Arquitectura del Wizard (8 Pasos)

```
Paso 1: Modelo LLM      → Define la estructura del prompt (XML vs Markdown)
Paso 2: Plantilla       → Precarga sector profesional (opcional)
Paso 3: Persona         → Rol, nivel de experiencia, tono de voz
Paso 4: Contexto        → Contexto previo, audiencia objetivo, datos de entrada
Paso 5: Tarea           → Instrucción principal + restricciones
Paso 6: Formato         → Estructura de salida, esquema, longitud
Paso 7: Avanzado        → CoT, Few-Shot, Self-Consistency, ReAct, ToT, guardrails
Paso 8: Seguridad       → Validación y consejos de privacidad
```

El panel derecho muestra el prompt generado **en tiempo real** mientras completas los pasos.

---

## Sectores Profesionales

La app incluye **30+ casos de uso** organizados en 8 sectores:

| Sector | Casos de Uso |
|--------|-------------|
| Tecnología | Generación de código, refactoring legacy, debugging, prototipado |
| Salud | Resumen de EHR, triaje clínico, planificación de tratamiento |
| Legal | Análisis de contratos, investigación legal, documentación de cumplimiento |
| Negocios | Análisis de cartera, detección de fraude, respuestas a RFP |
| Marketing | Análisis competitivo, branding, repurposing de contenido |
| RRHH | Job descriptions, guías de entrevista, planes de onboarding |
| Operaciones | Evaluación de proveedores, optimización de inventario |
| Educación | Tutoría socrática, materiales educativos, RAG con citas |

---

## Estructura del Proyecto

```
expertPrompting/
├── README.md
└── prompt-flow/
    ├── src/
    │   ├── App.jsx           # Componente principal (~500 líneas)
    │   ├── data/
    │   │   └── templates.js  # 8 sectores, 30+ casos de uso
    │   ├── index.css         # Estilos globales + scrollbar personalizado
    │   └── main.jsx          # Entry point React
    ├── index.html            # Meta tags, fuente Inter
    ├── tailwind.config.js    # Paleta brand + plugin animate
    ├── vite.config.js        # Base path para GitHub Pages
    └── package.json
```

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18 | Framework UI |
| Vite | 5 | Build tool y dev server |
| Tailwind CSS | 3.4 | Styling utility-first |
| tailwindcss-animate | 1.0 | Animaciones de transición |
| Lucide React | 0.344 | Iconos SVG |
| clsx + tailwind-merge | — | Gestión de clases Tailwind |
| gh-pages | 6 | Deploy a GitHub Pages |

---

## Deploy en GitHub Pages

```bash
cd prompt-flow
npm run deploy
```

Esto ejecuta `npm run build` + `gh-pages -d dist`. Configura GitHub Pages así:

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` / Folder: `/ (root)`

URL: `https://iDiagoValeta.github.io/expertPrompting/`

---

## Privacidad y Licencia

- El código fuente permanece **privado** en GitHub
- Solo el código compilado se despliega públicamente
- No se almacenan ni transmiten datos del usuario
- Privado — Todos los derechos reservados
