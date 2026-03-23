<div align="center">

# PromptArchitect

**Constructor profesional de prompts para IA**

Genera prompts optimizados paso a paso para Claude, GPT-4o, Gemini y Llama<br>usando las técnicas más avanzadas de ingeniería de prompts 2025–2026.

[![Demo](https://img.shields.io/badge/Demo-Live-4F46E5?style=for-the-badge&logo=github)](https://iDiagoValeta.github.io/expertPrompting/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ¿Qué es PromptArchitect?

Una herramienta web que guía la construcción de prompts mediante un **wizard de 8 pasos**. El prompt se genera en tiempo real en un panel lateral y se adapta automáticamente según el modelo objetivo:

- **Claude** → estructura XML semántica (`<persona>`, `<tarea>`, `<restricciones>`…)
- **GPT / Gemini / Llama** → estructura Markdown (`## SECCIÓN`, `**negrita**`)

---

## Características

- **8 pasos guiados** — rol, contexto, tarea, formato, técnicas avanzadas y seguridad
- **4 modelos soportados** — Claude, GPT-4o, Gemini 2.5, Llama 3
- **10 técnicas de prompting** — CoT, Few-Shot, ReAct, Self-Consistency, ToT y más
- **30+ plantillas profesionales** en 8 sectores: Tecnología, Salud, Legal, Negocios, Marketing, RRHH, Operaciones y Educación
- **Preview en tiempo real** con contador de tokens estimados
- **Sin backend** — todo ocurre en el cliente, sin almacenamiento de datos

---

## Inicio Rápido

```bash
cd prompt-flow
npm install
npm run dev
# → http://localhost:5173
```

---

## Técnicas de Prompting Implementadas

### Base

| Técnica | Cuándo usarla |
|---------|---------------|
| **Role Prompting** | Siempre — mejora consistencia y calidad |
| **Chain-of-Thought (CoT)** | Problemas complejos, análisis, matemáticas |
| **Few-Shot Learning** | Cuando el formato de salida es crítico |
| **Prompt Decomposition** | Tareas multi-paso o de planificación |
| **Multi-Agent Debate** | Decisiones con múltiples puntos de vista |
| **Anti-Alucinación** | Siempre que se requieran hechos precisos |
| **XML / Markdown Structuring** | Prompts complejos con múltiples partes |

### Avanzadas 2025–2026

**Self-Consistency** — Genera múltiples razonamientos independientes y selecciona el más consistente por votación mayoritaria. Aumenta la precisión ~20% sobre CoT solo en tareas de razonamiento.

**ReAct (Reasoning + Acting)** — Patrón iterativo que alterna pensamiento explícito con acciones concretas:
```
Pensamiento → Acción → Observación → (repite)
```
Ideal para agentes con acceso a herramientas externas.

**Tree of Thoughts (ToT)** — Explora 3 ramas de razonamiento en paralelo antes de sintetizar la mejor solución. Beneficia tareas de planificación estratégica.

---

## Diferencias por Modelo

| Modelo | Estructura | Fortalezas | Best Practice |
|--------|-----------|------------|---------------|
| **Claude** | XML semántico | Documentos largos, análisis cuidadoso, multi-paso | Usar `<thinking>` para CoT; pre-fill `{` para JSON |
| **GPT-4o** | Markdown estricto | Código ejecutable, JSON exacto, comentarios | Especificar formato primero; word counts duros |
| **Gemini 2.5** | Markdown + scope | Research, multimodal, summarización | Listar fuentes a considerar; scope explícito |
| **Llama 3** | Markdown simple | Open-source, instrucciones directas | Instrucciones concisas; evitar anidamiento profundo |

---

## Arquitectura del Wizard

```
① Modelo LLM   → Determina XML vs Markdown
② Plantilla    → Precarga sector profesional (opcional)
③ Persona      → Rol, experiencia, tono de voz
④ Contexto     → Contexto previo, audiencia, datos de entrada
⑤ Tarea        → Instrucción principal + restricciones
⑥ Formato      → Estructura de salida, esquema, longitud
⑦ Avanzado     → CoT · Few-Shot · Self-Consistency · ReAct · ToT · Guardrails
⑧ Seguridad    → Validación y consejos de privacidad
```

El panel derecho muestra el prompt generado **en tiempo real**.

---

## Sectores y Plantillas

| Sector | Ejemplos de casos de uso |
|--------|--------------------------|
| 🚀 Tecnología | Generación de código en repo existente, refactoring legacy, debugging |
| ⚕️ Salud | Resumen de EHR, triaje clínico, planificación de tratamiento |
| ⚖️ Legal | Análisis de contratos, investigación legal, documentación de cumplimiento |
| 💼 Negocios | Análisis de cartera, detección de fraude, respuestas a RFP |
| 📢 Marketing | Análisis competitivo, branding, repurposing de contenido |
| 👤 RRHH | Job descriptions, guías de entrevista, planes de onboarding |
| ⚙️ Operaciones | Evaluación de proveedores, optimización de inventario |
| 📚 Educación | Tutoría socrática, materiales educativos, RAG con citas |

---

## Estructura del Proyecto

```
expertPrompting/
├── CLAUDE.md              # Guía de contexto para Claude Code
├── README.md
└── prompt-flow/
    ├── src/
    │   ├── App.jsx        # Componente principal — estado, buildPrompt, wizard, UI
    │   ├── data/
    │   │   └── templates.js   # 8 sectores, 30+ casos de uso, SAFETY_TIPS
    │   ├── index.css      # Estilos globales, scrollbar personalizado
    │   └── main.jsx       # Entry point React
    ├── index.html         # Meta tags, fuente Inter
    ├── tailwind.config.js # Paleta brand + plugin animate
    ├── vite.config.js     # Base path /expertPrompting/ para GitHub Pages
    └── package.json
```

---

## Stack Tecnológico

[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Lucide](https://img.shields.io/badge/Lucide_React-f66151?style=flat-square)](https://lucide.dev/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=github)](https://pages.github.com/)

---

## Deploy

```bash
cd prompt-flow
npm run deploy   # build + publica en rama gh-pages
```

Configura GitHub Pages: **Settings → Pages → Branch: `gh-pages` / Folder: `/ (root)`**

URL pública: `https://iDiagoValeta.github.io/expertPrompting/`

---

## Privacidad

- Sin backend — todo ocurre en el cliente
- No se almacenan ni transmiten datos del usuario
- Código fuente privado — solo el build compilado es público

---

<div align="center">
<sub>Privado — Todos los derechos reservados</sub>
</div>
