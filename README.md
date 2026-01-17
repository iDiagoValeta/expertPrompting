# PromptArchitect 🚀

Herramienta web avanzada para construir prompts programáticamente siguiendo los estándares de ingeniería de prompts 2025-2026.

## 🌟 Características

- **Arquitectura Modular**: Construcción paso a paso de prompts optimizados
- **8 Sectores Profesionales**: Casos de uso específicos para Tecnología, Salud, Legal, Negocios, Marketing, RRHH, Operaciones y Educación
- **Soporte Multi-Modelo**: Optimización automática para GPT, Claude, Gemini y Llama
- **Técnicas Avanzadas**: Chain-of-Thought, Few-Shot Learning, Guardrails anti-alucinación
- **Estructuras XML/Markdown**: Delimitadores automáticos según el modelo objetivo

## 🚀 Desarrollo Local

```bash
cd prompt-flow
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Deploy en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages:

```bash
cd prompt-flow
npm run deploy
```

Esto ejecutará:
1. `npm run build` - Compila la aplicación
2. `gh-pages -d dist` - Despliega a la rama gh-pages

### Configuración de GitHub Pages

1. Ve a Settings → Pages en tu repositorio
2. Selecciona:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Guarda los cambios

Tu aplicación estará disponible en: `https://iDiagoValeta.github.io/expertPrompting/`

## 🛠️ Stack Tecnológico

- **React 18** - Framework UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Iconos
- **GitHub Pages** - Hosting

## 📝 Estructura del Proyecto

```
prompt-flow/
├── src/
│   ├── App.jsx           # Componente principal
│   ├── data/
│   │   └── templates.js  # Sectores y casos de uso
│   ├── index.css         # Estilos globales
│   └── main.jsx          # Entry point
├── index.html
├── vite.config.js        # Configuración de Vite
└── package.json
```

## 🔒 Privacidad

- El código fuente permanece **privado** en GitHub (requiere GitHub Pro)
- Solo el código compilado se despliega públicamente en GitHub Pages
- No se expone lógica sensible en el cliente

## 📄 Licencia

Privado - Todos los derechos reservados
