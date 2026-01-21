import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  User, Target, Layers, FileText, Copy, Check, RotateCcw, 
  BrainCircuit, MessageSquare, Zap, Layout, ChevronDown, Play,
  BookOpen, Shield, ChevronRight, ChevronLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SECTORS, SAFETY_TIPS } from './data/templates';

// --- Utilerías ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Data & Config ---
const MODELS = [
  { id: 'gpt', name: 'GPT (OpenAI)', prefers: 'Markdown' },
  { id: 'claude', name: 'Claude (Anthropic)', prefers: 'XML' },
  { id: 'gemini', name: 'Gemini (Google)', prefers: 'Markdown' },
  { id: 'llama', name: 'Llama (Meta)', prefers: 'Markdown' }
];

const ROLES = [
  "Experto en Marketing Digital", "Ingeniero de Software Senior", "Redactor Creativo",
  "Analista de Datos", "Consultor Legal", "Profesor / Tutor Académico", 
  "Gestor de Producto", "Reclutador IT", "Diseñador UX/UI", "Traductor Profesional",
  "Oficial de Cumplimiento", "Arquitecto de Software", "Científico de Datos"
];

const EXPERIENCE_LEVELS = [
  { id: 'junior', label: 'Junior / Aprendiz' },
  { id: 'mid', label: 'Semi-Senior / Competente' },
  { id: 'senior', label: 'Senior / Experto' },
  { id: 'principal', label: 'Principal / Autoridad Mundial' }
];

const TASKS = [
  "Generar / Escribir", "Resumir", "Analizar / Auditar", "Refactorizar Código",
  "Traducir", "Clasificar", "Planificar / Estrategia", "Resolver Problema",
  "Extraer Entidades", "Comparar Opciones", "Depurar Código"
];

const TONES = [
  { id: 'professional', label: 'Profesional y Corporativo', desc: 'Formal, sin emociones' },
  { id: 'friendly', label: 'Amigable y Cercano', desc: 'Conversacional, empático' },
  { id: 'academic', label: 'Académico y Formal', desc: 'Riguroso, citando fuentes' },
  { id: 'persuasive', label: 'Persuasivo y de Ventas', desc: 'Enfocado en conversión' },
  { id: 'concise', label: 'Directo y Conciso', desc: 'Mínimas palabras, máximo impacto' },
  { id: 'inspirational', label: 'Inspirador', desc: 'Motivacional, positivo' },
  { id: 'technical', label: 'Denso y Técnico', desc: 'Jerga especializada, sin simplificar' },
  { id: 'eli5', label: 'Explica como a un niño de 5 años', desc: 'Analogías simples' }
];

const FORMATS = [
  { id: 'plain', label: 'Texto Plano', needsSchema: false },
  { id: 'bullets', label: 'Lista con Viñetas', needsSchema: false },
  { id: 'table', label: 'Tabla Comparativa', needsSchema: false },
  { id: 'markdown', label: 'Markdown Estructurado', needsSchema: false },
  { id: 'json', label: 'JSON Estructurado', needsSchema: true },
  { id: 'xml', label: 'XML Estructurado', needsSchema: true },
  { id: 'csv', label: 'CSV (Tabla de Datos)', needsSchema: false },
  { id: 'steps', label: 'Paso a Paso Numerado', needsSchema: false },
  { id: 'code', label: 'Solo Código (sin explicaciones)', needsSchema: false }
];

const AUDIENCE_LEVELS = [
  "Niño de 5 años", "Principiante sin conocimientos previos", 
  "Intermedio con bases", "Experto / Técnico", "Ejecutivo (solo resumen)"
];

// --- Componentes UI ---

const InputGroup = ({ label, children, helper }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-slate-700">{label}</label>
    {children}
    {helper && <p className="text-xs text-slate-400">{helper}</p>}
  </div>
);

const Toggle = ({ label, checked, onChange, icon: Icon }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      "flex items-center justify-between w-full p-3 rounded-xl border transition-all",
      checked 
        ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-200" 
        : "border-slate-200 bg-white hover:border-slate-300"
    )}
  >
    <div className="flex items-center space-x-3">
      {Icon && <Icon className={cn("w-4 h-4", checked ? "text-indigo-600" : "text-slate-400")} />}
      <span className={cn("text-sm font-medium", checked ? "text-indigo-900" : "text-slate-600")}>{label}</span>
    </div>
    <div className={cn(
      "w-10 h-5 rounded-full relative transition-colors",
      checked ? "bg-indigo-600" : "bg-slate-300"
    )}>
      <div className={cn(
        "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </div>
  </button>
);

// --- Componente Principal ---

export default function App() {
  const roleInputRef = useRef(null);
  // Definir los pasos del flujo
  const STEPS = [
    { id: 0, title: 'Modelo LLM', icon: Zap, description: 'Elige el modelo objetivo' },
    { id: 1, title: 'Plantilla', icon: BookOpen, description: 'Selecciona una plantilla (opcional)' },
    { id: 2, title: 'Anclaje de Persona', icon: User, description: 'Rol, experiencia y tono' },
    { id: 3, title: 'Contexto y Datos', icon: FileText, description: 'Contexto previo y datos de entrada' },
    { id: 4, title: 'Instrucción y Tarea', icon: Target, description: 'Qué debe hacer la IA' },
    { id: 5, title: 'Formato de Salida', icon: Layout, description: 'Estructura de respuesta' },
    { id: 6, title: 'Refinamiento Avanzado', icon: BrainCircuit, description: 'Razonamiento, Ejemplos, Límites' },
    { id: 7, title: 'Seguridad', icon: Shield, description: 'Validación final' }
  ];

  // Estado del Formulario Modular
  const [data, setData] = useState({
    model: 'claude', // Modelo por defecto
    role: '',
    experienceLevel: '', // Nuevo: Junior/Senior
    task: '',
    audienceLevel: '', // Renombrado de 'level'
    context: '',
    inputData: '',
    constraints: [''],
    format: '',
    outputSchema: '', // Nuevo: para esquemas JSON/XML
    length: '',
    tone: '',
    // Opciones avanzadas
    useCoT: false, // Cadena de Pensamiento
    useFewShot: false, // Ejemplos
    useDecomposition: false, // Paso a paso
    useMultiAgent: false, // Debate
    useXMLTags: true, // Nuevo: usar etiquetas XML/Markdown
    usePreFill: false, // Nuevo: para Claude
    useNegativeInstructions: true // Nuevo: "No hagas X"
  });

  const [examples, setExamples] = useState([{ input: '', output: '' }]); // Ahora es array
  const [attachments, setAttachments] = useState([{ name: '', description: '' }]); // Nuevo: archivos adjuntos
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null); // Nuevo: sector seleccionado
  const [currentStep, setCurrentStep] = useState(0);

  // ========================================
  // CONSTRUCTOR DE PROMPT - Función pura con useMemo
  // ========================================
  
  // Función auxiliar para generar etiquetas según el modelo (XML para Claude, Markdown para otros)
  const createTagHelper = (modelId, useXMLTags) => {
    const useXML = useXMLTags && (modelId === 'claude');
    const useMarkdown = !useXML;
    
    return (name, content, inline = false) => {
      if (!useXMLTags) return content;
      if (useXML) {
        return inline ? `<${name}>${content}</${name}>` : `<${name}>\n${content}\n</${name}>`;
      }
      // Markdown headings para GPT/Gemini/Llama - convertir guiones bajos a espacios
      const displayName = name.replace(/_/g, ' ').toUpperCase();
      return `## ${displayName}\n${content}`;
    };
  };

  // Constructor de Prompt - Función pura que retorna el prompt construido
  const buildPrompt = useMemo(() => {
    const modelInfo = MODELS.find(m => m.id === data.model);
    const useXML = data.useXMLTags && data.model === 'claude';
    const tag = createTagHelper(data.model, data.useXMLTags);
    const parts = [];

    // === 1. ANCLAJE DE PERSONA Y ROL (con calibración de experiencia) ===
    if (data.role) {
      let personaText = '';
      
      if (useXML) {
        // Estructura optimizada para Claude con XML semántico
        personaText = `Eres un ${data.role}`;
        if (data.experienceLevel) {
          const expLabel = EXPERIENCE_LEVELS.find(e => e.id === data.experienceLevel)?.label;
          personaText += ` de nivel ${expLabel}`;
        }
        personaText += '.';
      } else {
        // Estructura Markdown para GPT/Gemini/Llama
        personaText = `**Rol:** ${data.role}`;
        if (data.experienceLevel) {
          const expLabel = EXPERIENCE_LEVELS.find(e => e.id === data.experienceLevel)?.label;
          personaText += `\n**Nivel de Experiencia:** ${expLabel}`;
        }
      }
      
      // Añadir calibración de tono
      if (data.tone) {
        const toneObj = TONES.find(t => t.id === data.tone);
        if (toneObj) {
          personaText += useXML 
            ? `\nEstilo de comunicación: ${toneObj.label} (${toneObj.desc}).`
            : `\n**Tono:** ${toneObj.label} - ${toneObj.desc}`;
        }
      }
      
      // Multi-agente (Debate interno)
      if (data.useMultiAgent) {
        // Extraer nombre corto del rol (primeras palabras antes de "con" o "especializado")
        const shortRole = data.role.split(/\s+(con|especializado|experto en|de nivel|\(|,)/i)[0].trim();
        const multiAgentText = useXML
          ? `\n\nModo Debate:\nSimula un debate interno entre dos perspectivas:\n- Agente Principal (${shortRole}): Propone la solución.\n- Agente Crítico (Escéptico): Cuestiona y busca huecos lógicos.\nSintetiza la mejor respuesta tras el debate.`
          : `\n\n### MODO MULTI-AGENTE\nSimula un debate interno:\n- **Agente A (${shortRole}):** Propone la solución.\n- **Agente B (Crítico):** Cuestiona y busca huecos.\nLuego sintetiza la mejor respuesta.`;
        personaText += multiAgentText;
      }
      
      parts.push(tag('persona', personaText));
    }

    // === 2. CONTEXTO Y PREPARACIÓN (con nivel de audiencia) ===
    if (data.context || data.audienceLevel) {
      let contextText = '';
      if (data.context) contextText += data.context;
      if (data.audienceLevel) {
        if (contextText) contextText += '\n\n';
        contextText += useXML
          ? `Audiencia objetivo: ${data.audienceLevel}\nAdapta el nivel de detalle y vocabulario para esta audiencia.`
          : `**AUDIENCIA:** ${data.audienceLevel}\nAdapta el nivel de detalle y vocabulario para esta audiencia.`;
      }
      parts.push(tag('contexto', contextText));
    }

    // === 3. DATOS DE ENTRADA (Base de Conocimiento) ===
    if (data.inputData) {
      const dataSection = `Basa tu respuesta ÚNICAMENTE en la siguiente información:\n\n${data.inputData.trim()}`;
      parts.push(tag('datos_entrada', dataSection));
    }

    // === 3b. ARCHIVOS ADJUNTOS ===
    const validAttachments = attachments.filter(att => att.name && att.description);
    if (validAttachments.length > 0) {
      let attachmentsText = validAttachments.map((att, idx) => 
        useXML
          ? `Archivo ${idx + 1}:\n  Nombre: ${att.name}\n  Descripción: ${att.description}`
          : `**Archivo ${idx + 1}:** ${att.name}\n${att.description}`
      ).join('\n\n');
      parts.push(tag('archivos_adjuntos', attachmentsText));
    }

  // Función auxiliar para convertir contenido con etiquetas XML a formato Markdown
  const convertXmlToMarkdown = (text) => {
    if (!text) return text;
    
    let converted = text
      // Convertir etiquetas con atributos (ej: <file path="src/..."> -> ### FILE: src/...)
      .replace(/<([a-z_]+)\s+([^>]+)>[\s\n]*/gi, (match, tagName, attrs) => {
        const title = tagName.replace(/_/g, ' ').toUpperCase();
        // Extraer valor del primer atributo para contexto
        const attrMatch = attrs.match(/(?:path|id|name|label|language|severity|risk|priority|type)="([^"]+)"/i);
        const attrValue = attrMatch ? `: ${attrMatch[1]}` : '';
        return `\n### ${title}${attrValue}\n`;
      })
      // Convertir etiquetas simples sin atributos a encabezados
      .replace(/<([a-z_]+)>[\s\n]*/gi, (match, tagName) => {
        const title = tagName.replace(/_/g, ' ').toUpperCase();
        return `\n### ${title}\n`;
      })
      // Eliminar etiquetas de cierre
      .replace(/<\/[a-z_]+>[\s\n]*/gi, '\n')
      // Limpiar múltiples saltos de línea
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return converted;
  };

    // === 4. EJEMPLOS (Few-Shot - ejemplos estructurados) ===
    if (data.useFewShot) {
      const validExamples = examples.filter(ex => ex.input && ex.output);
      if (validExamples.length > 0) {
        let examplesText = useXML
          ? validExamples.map((ex, idx) => 
              `Ejemplo ${idx + 1}:\n  Entrada: ${ex.input}\n  Salida esperada: ${ex.output}`
            ).join('\n\n')
          : validExamples.map((ex, idx) => {
              // Convertir salida XML a Markdown si no es Claude
              const outputText = convertXmlToMarkdown(ex.output);
              return `**Ejemplo ${idx + 1}:**\n- Entrada: ${ex.input}\n- Salida Esperada: ${outputText}`;
            }).join('\n\n');
        
        const intro = 'Aprende del patrón de estos ejemplos y aplícalo a la tarea:';
        parts.push(tag('ejemplos', `${intro}\n\n${examplesText}`));
      }
    }

    // === 5. INSTRUCCIÓN PRINCIPAL (TAREA) con Cadena de Pensamiento mejorada ===
    if (data.task) {
      let taskText = data.task;
      
      // Descomposición automática con pasos explícitos
      if (data.useDecomposition) {
        const decompositionText = useXML
          ? `\n\nEstrategia de resolución:\nAborda esta tarea siguiendo estos pasos:\n1. Analiza los requisitos y restricciones\n2. Descompón el problema en sub-tareas manejables\n3. Resuelve cada sub-tarea secuencialmente\n4. Integra las soluciones parciales\n5. Valida el resultado final`
          : `\n\n### ESTRATEGIA DE RESOLUCIÓN\n1. Analiza los requisitos y restricciones\n2. Descompón el problema en sub-tareas\n3. Resuelve cada sub-tarea secuencialmente\n4. Integra las soluciones parciales\n5. Valida el resultado final`;
        taskText += decompositionText;
      }
      
      parts.push(tag('tarea', taskText));
    }

    // === 6. RESTRICCIONES Y LÍMITES DE SEGURIDAD (Anti-alucinación mejorado) ===
    const constraintsList = [];
    
    // Restricciones del usuario
    if (Array.isArray(data.constraints)) {
      constraintsList.push(...data.constraints.filter(c => c.trim()));
    }
    
    // Límites de seguridad automáticos (Anclaje fuerte)
    if (data.useNegativeInstructions) {
      constraintsList.push(
        'IMPORTANTE: Si no tienes suficiente información para responder con certeza, responde textualmente: "No tengo información suficiente para responder esto con precisión."',
        'NO inventes hechos, fechas, estadísticas, nombres de librerías o APIs. Basa tu respuesta únicamente en los datos proporcionados.',
        'Si hay ambigüedad en la pregunta, solicita clarificación antes de asumir.',
        'Distingue claramente entre hechos verificables y opiniones/suposiciones.'
      );
    }
    
    if (constraintsList.length > 0) {
      const constraintsText = constraintsList.map(c => useXML ? `• ${c}` : `- ${c}`).join('\n');
      parts.push(tag('restricciones', constraintsText));
    }

    // === 7. CADENA DE PENSAMIENTO (CoT) - Diferenciado por modelo ===
    if (data.useCoT) {
      let cotContent = '';
      
      if (data.model === 'claude' && useXML) {
        // Claude con patrón de pensamiento extendido - sin etiquetas XML internas
        cotContent = `Antes de dar tu respuesta final, sigue este proceso:\n\n1. PENSAMIENTO:\n   - Analiza el problema paso a paso\n   - Identifica posibles enfoques\n   - Evalúa pros y contras de cada opción\n   - Selecciona el mejor enfoque justificando tu elección\n\n2. RESPUESTA:\n   [Tu respuesta final aquí]`;
      } else if (data.model === 'gpt') {
        // GPT con Cadena de Pensamiento optimizada
        cotContent = `Piensa paso a paso siguiendo este esquema:\n\n1. **Entendimiento:** ¿Qué se me está pidiendo exactamente?\n2. **Análisis:** ¿Cuáles son los elementos clave del problema?\n3. **Opciones:** ¿Qué alternativas existen?\n4. **Evaluación:** ¿Cuál es la mejor opción y por qué?\n5. **Respuesta:** Presenta tu solución final.\n\nMuestra tu razonamiento antes de la respuesta final.`;
      } else {
        // Gemini/Llama con enfoque estructurado
        cotContent = `Resuelve este problema paso a paso:\n- Primero, analiza los datos disponibles\n- Luego, identifica el enfoque óptimo\n- Finalmente, presenta tu respuesta con justificación\n\nPensemos paso a paso para asegurar precisión.`;
      }
      
      parts.push(tag('razonamiento', cotContent));
    }

    // === 8. FORMATO DE SALIDA (Estructuración de Respuesta) ===
    const formatInstructions = [];
    
    if (data.format) {
      const formatObj = FORMATS.find(f => f.id === data.format);
      if (formatObj) {
        formatInstructions.push(useXML 
          ? `Formato requerido: ${formatObj.label}`
          : `**Formato requerido:** ${formatObj.label}`);
        
        // Esquema si es necesario
        if (formatObj.needsSchema && data.outputSchema) {
          formatInstructions.push(useXML
            ? `Esquema a seguir:\n${data.outputSchema}\nRellena este esquema exactamente, sin añadir campos adicionales.`
            : `### ESQUEMA A SEGUIR\n\`\`\`\n${data.outputSchema}\n\`\`\`\nRellena este esquema exactamente.`);
        }
        
        // Indicación de pre-llenado para Claude con JSON
        if (data.model === 'claude' && data.format === 'json' && data.usePreFill) {
          formatInstructions.push('NOTA IMPORTANTE: Tu respuesta debe comenzar directamente con el carácter { sin texto previo.');
        }
      }
    }
    
    if (data.length) {
      formatInstructions.push(useXML
        ? `Longitud objetivo: ${data.length}`
        : `**Longitud:** ${data.length}`);
    }
    
    if (formatInstructions.length > 0) {
      parts.push(tag('formato_salida', formatInstructions.join('\n')));
    }

    // === ENSAMBLAJE FINAL ===
    let finalText = parts.join('\n\n');
    
    // Header informativo (no forma parte del prompt ejecutable)
    const structureType = useXML ? 'XML (optimizado para Claude)' : 'Markdown';
    const header = `# Prompt generado para: ${modelInfo?.name || 'LLM genérico'}\n# Estructura: ${structureType}\n# Técnicas activas: ${[data.useCoT && 'Cadena de Pensamiento', data.useFewShot && 'Ejemplos (Few-Shot)', data.useDecomposition && 'Descomposición', data.useMultiAgent && 'Multi-Agente', data.useNegativeInstructions && 'Anti-Alucinación'].filter(Boolean).join(', ') || 'Ninguna'}\n\n`;
    
    return header + finalText;
  }, [data, examples, attachments]);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (roleInputRef.current && data.role) {
      const el = roleInputRef.current;
      const end = data.role.length;
      try {
        el.setSelectionRange(end, end);
      } catch {
        // ignore for non-text inputs
      }
    }
  }, [data.role]);

  const loadTemplate = (useCase) => {
    setActiveTemplate(useCase.id);
    
    // Mapear tone string a ID
    const toneId = TONES.find(t => t.label === useCase.tone)?.id || '';
    
    // Mapear format string a ID
    const formatId = FORMATS.find(f => f.label === useCase.format)?.id || '';
    
    // Cargar ejemplos si la plantilla los tiene
    const hasExamples = useCase.examples && useCase.examples.length > 0;
    if (hasExamples) {
      setExamples(useCase.examples.map(ex => ({ input: ex.input, output: ex.output })));
    } else {
      setExamples([{ input: '', output: '' }]);
    }
    
    setData(prev => ({
      ...prev,
      role: useCase.role || '',
      experienceLevel: 'senior', // Por defecto senior para templates
      task: useCase.task || '',
      audienceLevel: '', 
      context: useCase.context || '',
      inputData: '', 
      constraints: useCase.constraints ? useCase.constraints.split('\n') : [''],
      format: formatId,
      outputSchema: '',
      length: '', 
      tone: toneId,
      useCoT: useCase.id.includes('debug') || useCase.id.includes('biz') || useCase.id.includes('ehr') || useCase.id.includes('legal'),
      useFewShot: hasExamples, // Activar automáticamente si hay ejemplos
      useDecomposition: useCase.id.includes('plan') || useCase.id.includes('strategy') || useCase.id.includes('portfolio') || useCase.id.includes('legacy'),
      useMultiAgent: false,
      useNegativeInstructions: true
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    // Solo permitir ir a pasos anteriores o al actual sin validación
    // Para avanzar, debe pasar la validación del paso actual
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    } else if (stepIndex === currentStep) {
      // Ya estamos en este paso
    } else if (stepIndex > currentStep) {
      // Validar todos los pasos intermedios antes de saltar
      let canAdvance = true;
      for (let i = currentStep; i < stepIndex; i++) {
        if (!isStepValid(i)) {
          canAdvance = false;
          break;
        }
      }
      if (canAdvance) {
        setCurrentStep(stepIndex);
      }
    }
  };

  // ========================================
  // VALIDACIÓN DE PASOS
  // ========================================
  
  // Función que determina si un paso tiene campos requeridos completos
  const isStepValid = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Modelo LLM - Siempre válido (tiene default)
        return !!data.model;
      
      case 1: // Plantilla - Opcional, siempre válido
        return true;
      
      case 2: // Anclaje de Persona - ROL es obligatorio
        return data.role.trim().length >= 3;
      
      case 3: // Contexto y Datos - Opcional
        return true;
      
      case 4: // Instrucción y Tarea - TAREA es obligatoria
        return data.task.trim().length >= 10;
      
      case 5: // Formato de Salida - Opcional
        return true;
      
      case 6: // Refinamiento Avanzado - Opcional
        return true;
      
      case 7: // Seguridad - Solo información
        return true;
      
      default:
        return true;
    }
  };

  // Obtener mensaje de error para el paso actual
  const getStepValidationMessage = (stepIndex) => {
    switch (stepIndex) {
      case 2:
        if (!data.role.trim()) return 'El rol es obligatorio para continuar';
        if (data.role.trim().length < 3) return 'El rol debe tener al menos 3 caracteres';
        return null;
      
      case 4:
        if (!data.task.trim()) return 'La tarea es obligatoria para continuar';
        if (data.task.trim().length < 10) return 'La tarea debe tener al menos 10 caracteres para ser específica';
        return null;
      
      default:
        return null;
    }
  };

  // Validación del paso actual
  const currentStepValid = isStepValid(currentStep);
  const currentStepError = getStepValidationMessage(currentStep);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(buildPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setActiveTemplate(null);
    setSelectedSector(null);
    setData({
      model: 'claude',
      role: '', 
      experienceLevel: '',
      task: '', 
      audienceLevel: '', 
      context: '', 
      inputData: '', 
      constraints: [''],
      format: '', 
      outputSchema: '',
      length: '', 
      tone: '', 
      useCoT: false, 
      useFewShot: false,
      useDecomposition: false, 
      useMultiAgent: false,
      useXMLTags: true,
      usePreFill: false,
      useNegativeInstructions: true
    });
    setExamples([{ input: '', output: '' }]);
    setAttachments([{ name: '', description: '' }]);
    setCurrentStep(0);
  };
  
  // Función auxiliar para añadir/quitar ejemplos
  const addExample = () => {
    if (examples.length < 5) {
      setExamples([...examples, { input: '', output: '' }]);
    }
  };
  
  const removeExample = (index) => {
    if (examples.length > 1) {
      setExamples(examples.filter((_, i) => i !== index));
    }
  };
  
  const updateExample = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  // Función auxiliar para añadir/quitar restricciones
  const addConstraint = () => {
    setData(prev => ({
      ...prev,
      constraints: [...(prev.constraints || ['']), '']
    }));
  };

  const removeConstraint = (index) => {
    setData(prev => {
      const next = [...(prev.constraints || [])].filter((_, i) => i !== index);
      return { ...prev, constraints: next.length ? next : [''] };
    });
  };

  const updateConstraint = (index, value) => {
    setData(prev => {
      const next = [...(prev.constraints || [])];
      next[index] = value;
      return { ...prev, constraints: next };
    });
  };

  // Función auxiliar para añadir/quitar archivos adjuntos
  const addAttachment = () => {
    if (attachments.length < 10) {
      setAttachments([...attachments, { name: '', description: '' }]);
    }
  };
  
  const removeAttachment = (index) => {
    if (attachments.length > 1) {
      setAttachments(attachments.filter((_, i) => i !== index));
    }
  };
  
  const updateAttachment = (index, field, value) => {
    const newAttachments = [...attachments];
    newAttachments[index][field] = value;
    setAttachments(newAttachments);
  };

  // Renderizar el contenido del paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Modelo LLM
        return (
          <div className="p-6 bg-slate-50/50 animate-in slide-in-from-top-2">
            <InputGroup label="Selecciona el Modelo LLM Objetivo" helper="Cada modelo prefiere estructuras diferentes (XML vs Markdown).">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MODELS.map(model => (
                  <button
                    key={model.id}
                    onClick={() => handleChange('model', model.id)}
                    className={cn(
                      "p-5 rounded-xl border text-left transition-all hover:shadow-md",
                      data.model === model.id
                        ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 shadow-lg"
                        : "bg-white border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    <div className="font-bold text-slate-900 text-base mb-2">{model.name}</div>
                    <div className="text-xs text-slate-500">Estructura preferida: {model.prefers}</div>
                  </button>
                ))}
              </div>
            </InputGroup>
          </div>
        );

      case 1: // Plantillas
        return (
          <div className="p-6 bg-slate-50/50 animate-in slide-in-from-top-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">
                  {!selectedSector ? 'Selecciona tu Sector' : 'Casos de Uso'}
                </h3>
                <p className="text-sm text-slate-500">
                  {!selectedSector 
                    ? 'Elige el sector que mejor describe tu trabajo o proyecto.' 
                    : 'Elige un caso de uso específico o salta este paso para crear desde cero.'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {selectedSector && !activeTemplate && (
                  <button
                    onClick={() => setSelectedSector(null)}
                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver a sectores</span>
                  </button>
                )}
                {activeTemplate && (
                  <button
                    onClick={() => {
                      setActiveTemplate(null);
                      setSelectedSector(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Limpiar selección</span>
                  </button>
                )}
              </div>
            </div>

            {/* Vista de Sectores */}
            {!selectedSector && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {SECTORS.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className="p-5 rounded-xl border bg-white hover:border-indigo-400 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-3xl">{sector.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {sector.name}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {sector.description}
                        </p>
                        <div className="mt-2 text-xs text-indigo-600 font-medium flex items-center">
                          <span>{sector.useCases.length} casos de uso</span>
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Vista de Casos de Uso */}
            {selectedSector && (
              <div className="space-y-4">
                {SECTORS.find(s => s.id === selectedSector)?.useCases.map((useCase) => (
                  <button
                    key={useCase.id}
                    onClick={() => loadTemplate(useCase)}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all hover:shadow-md",
                      activeTemplate === useCase.id 
                        ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200" 
                        : "bg-white border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-1 text-sm">
                          {useCase.title}
                        </h4>
                        <p className="text-xs text-slate-600 mb-2">
                          <strong>Rol:</strong> {useCase.role}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {useCase.task}
                        </p>
                      </div>
                      {activeTemplate === useCase.id && (
                        <div className="ml-3 flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 2: // Anclaje de Persona
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-top-2">
            <InputGroup 
              label={<>A. Rol / Profesión <span className="text-red-500">*</span></>} 
              helper="Define la identidad experta de la IA. Campo obligatorio (mín. 3 caracteres)."
            >
              <div className="relative">
                <textarea 
                  list="roles" 
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 resize-none min-h-[64px]",
                    data.role.trim().length > 0 && data.role.trim().length < 3
                      ? "border-amber-400 bg-amber-50/50"
                      : data.role.trim().length >= 3
                      ? "border-green-400 bg-green-50/30"
                      : "border-slate-200"
                  )}
                  placeholder="Ej. Arquitecto de Software, Consultor Legal..."
                  rows={2}
                  ref={roleInputRef}
                  value={data.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  onFocus={(e) => {
                    const end = e.target.value.length;
                    e.target.setSelectionRange(end, end);
                  }}
                />
                {data.role.trim().length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
                <datalist id="roles">
                  {ROLES.map(r => <option key={r} value={r} />)}
                </datalist>
              </div>
            </InputGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup label="B. Nivel de Experiencia" helper="Calibra la autoridad y profundidad.">
                <select 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  value={data.experienceLevel}
                  onChange={(e) => handleChange('experienceLevel', e.target.value)}
                >
                  <option value="">Sin especificar</option>
                  {EXPERIENCE_LEVELS.map(l => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup label="C. Tono de Comunicación" helper="Ajusta el estilo de respuesta.">
                <select 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  value={data.tone}
                  onChange={(e) => handleChange('tone', e.target.value)}
                >
                  <option value="">Neutro</option>
                  {TONES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </InputGroup>
            </div>
            
            {data.tone && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900 animate-in fade-in">
                <strong>Efecto:</strong> {TONES.find(t => t.id === data.tone)?.desc}
              </div>
            )}
          </div>
        );

      case 3: // Contexto y Datos
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-top-2">
            <InputGroup label="A. Contexto Previo" helper="Prepara el escenario. Información de fondo y situación actual.">
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px] bg-slate-50"
                placeholder="Ej. Estamos en un entorno legacy con SQL Server 2012. El usuario tiene conocimientos básicos de programación..."
                value={data.context}
                onChange={(e) => handleChange('context', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="B. Nivel de Audiencia" helper="¿Para quién es la respuesta?">
              <select 
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                value={data.audienceLevel}
                onChange={(e) => handleChange('audienceLevel', e.target.value)}
              >
                <option value="">No especificado</option>
                {AUDIENCE_LEVELS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </InputGroup>

            <InputGroup label="C. Datos de Entrada (Base de Conocimiento)" helper="Pega texto, código o documentos que la IA debe usar como referencia.">
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[120px] font-mono text-sm bg-slate-900 text-slate-100 placeholder:text-slate-500"
                placeholder="Pega aquí logs, código fuente, documentos, transcripciones..."
                value={data.inputData}
                onChange={(e) => handleChange('inputData', e.target.value)}
              />
            </InputGroup>

            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-700">D. Archivos Adjuntos (Descripción)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Especifica el nombre y descripción de archivos que quieres referenciar (no se suben, solo se describen).</p>
                </div>
                <button 
                  onClick={addAttachment}
                  disabled={attachments.length >= 10}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-colors",
                    attachments.length >= 10 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  )}
                >
                  + Añadir Archivo
                </button>
              </div>
              <div className="space-y-3">
                {attachments.map((att, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600">Archivo {idx + 1}</span>
                      {attachments.length > 1 && (
                        <button 
                          onClick={() => removeAttachment(idx)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input 
                        className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50" 
                        placeholder="Nombre del archivo (ej: contrato_NDA_v2.pdf) *"
                        value={att.name}
                        onChange={(e) => updateAttachment(idx, 'name', e.target.value)}
                      />
                      <textarea 
                        className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50 min-h-[60px]" 
                        placeholder="Descripción del archivo (contenido, propósito, información relevante) *"
                        value={att.description}
                        onChange={(e) => updateAttachment(idx, 'description', e.target.value)}
                      />
                    </div>
                    {att.name && !att.description && (
                      <p className="text-xs text-red-600 mt-1">⚠ La descripción es obligatoria</p>
                    )}
                    {!att.name && att.description && (
                      <p className="text-xs text-red-600 mt-1">⚠ El nombre del archivo es obligatorio</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Instrucción y Tarea
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-top-2">
            <InputGroup 
              label={<>A. Tarea Principal (Imperativa) <span className="text-red-500">*</span></>} 
              helper="Usa verbos de acción fuertes: Genera, Clasifica, Resume, Extrae, Analiza... (mín. 10 caracteres)"
            >
              <div className="relative">
                <textarea 
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px] bg-slate-50",
                    data.task.trim().length > 0 && data.task.trim().length < 10
                      ? "border-amber-400 bg-amber-50/50"
                      : data.task.trim().length >= 10
                      ? "border-green-400 bg-green-50/30"
                      : "border-slate-200"
                  )}
                  placeholder="Ej. Genera un endpoint REST en Python que valide tokens JWT y retorne el perfil del usuario..."
                  value={data.task}
                  onChange={(e) => handleChange('task', e.target.value)}
                />
                {data.task.trim().length > 0 && (
                  <div className="absolute right-3 top-3 flex items-center space-x-2">
                    <span className={cn(
                      "text-xs font-medium",
                      data.task.trim().length >= 10 ? "text-green-600" : "text-amber-600"
                    )}>
                      {data.task.trim().length}/10+
                    </span>
                    {data.task.trim().length >= 10 && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                )}
              </div>
            </InputGroup>

            <InputGroup label="B. Restricciones y Límites" helper="Define límites, negativas y lo que NO debe hacer.">
              <div className="space-y-2">
                {(data.constraints || ['']).map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      placeholder="Ej. No uses librerías obsoletas"
                      value={item}
                      onChange={(e) => updateConstraint(idx, e.target.value)}
                    />
                    {(data.constraints?.length || 0) > 1 && (
                      <button
                        onClick={() => removeConstraint(idx)}
                        className="px-3 py-2 rounded-lg text-sm text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <div>
                  <button
                    onClick={addConstraint}
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                  >
                    + Añadir restricción
                  </button>
                </div>
              </div>
            </InputGroup>
          </div>
        );

      case 5: // Formato de Salida
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-top-2">
            <InputGroup label="A. Formato Estructurado" helper="Define cómo debe verse la respuesta.">
              <select 
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                value={data.format}
                onChange={(e) => handleChange('format', e.target.value)}
              >
                <option value="">Sin formato específico</option>
                {FORMATS.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </InputGroup>

            {data.format && FORMATS.find(f => f.id === data.format)?.needsSchema && (
              <InputGroup label="B. Esquema / Plantilla" helper="Proporciona un esquema vacío que el modelo debe rellenar.">
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px] font-mono text-sm bg-slate-900 text-slate-100 placeholder:text-slate-500"
                  placeholder={data.format === 'json' ? '{\n  "nombre": "",\n  "edad": 0,\n  "activo": true\n}' : '<resultado>\n  <item id="" />\n</resultado>'}
                  value={data.outputSchema}
                  onChange={(e) => handleChange('outputSchema', e.target.value)}
                />
              </InputGroup>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup label="C. Longitud Objetivo">
                <input 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  placeholder="Ej. Máximo 200 palabras, 3 párrafos"
                  value={data.length}
                  onChange={(e) => handleChange('length', e.target.value)}
                />
              </InputGroup>

              {data.model === 'claude' && data.format === 'json' && (
                <InputGroup label="D. Pre-llenado (Claude)">
                  <Toggle 
                    label="Forzar inicio con '{'" 
                    checked={data.usePreFill} 
                    onChange={(v) => handleChange('usePreFill', v)} 
                  />
                </InputGroup>
              )}
            </div>
          </div>
        );

      case 6: // Refinamiento Avanzado
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Toggle 
                label="Cadena de Pensamiento (CoT)" 
                icon={Zap}
                checked={data.useCoT} 
                onChange={(v) => handleChange('useCoT', v)} 
              />
              <Toggle 
                label="Descomposición de Tareas" 
                icon={Target}
                checked={data.useDecomposition} 
                onChange={(v) => handleChange('useDecomposition', v)} 
              />
              <Toggle 
                label="Multi-Agente / Debate" 
                icon={MessageSquare}
                checked={data.useMultiAgent} 
                onChange={(v) => handleChange('useMultiAgent', v)} 
              />
              <Toggle 
                label="Ejemplos (Few-Shot, 1-5)" 
                icon={Copy}
                checked={data.useFewShot} 
                onChange={(v) => handleChange('useFewShot', v)} 
              />
              <Toggle 
                label="Etiquetas XML/Markdown" 
                icon={Layout}
                checked={data.useXMLTags} 
                onChange={(v) => handleChange('useXMLTags', v)} 
              />
              <Toggle 
                label="Límites Anti-Alucinación" 
                icon={Shield}
                checked={data.useNegativeInstructions} 
                onChange={(v) => handleChange('useNegativeInstructions', v)} 
              />
            </div>

            {data.useCoT && data.model === 'claude' && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900 animate-in fade-in">
                <strong>Claude (Cadena de Pensamiento):</strong> Se usarán etiquetas &lt;thinking&gt; y &lt;answer&gt; para separar razonamiento de respuesta final.
              </div>
            )}

            {data.useFewShot && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-slate-700">Ejemplos de Entrenamiento</h4>
                  <button 
                    onClick={addExample}
                    disabled={examples.length >= 5}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-medium transition-colors",
                      examples.length >= 5 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    )}
                  >
                    + Añadir Ejemplo
                  </button>
                </div>
                <div className="space-y-3">
                  {examples.map((ex, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-600">Ejemplo {idx + 1}</span>
                        {examples.length > 1 && (
                          <button 
                            onClick={() => removeExample(idx)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input 
                          className="p-2 border border-slate-200 rounded text-sm" 
                          placeholder="Entrada..."
                          value={ex.input}
                          onChange={(e) => updateExample(idx, 'input', e.target.value)}
                        />
                        <input 
                          className="p-2 border border-slate-200 rounded text-sm" 
                          placeholder="Salida ideal..."
                          value={ex.output}
                          onChange={(e) => updateExample(idx, 'output', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 7: // Seguridad
        return (
          <div className="p-6 animate-in slide-in-from-top-2 space-y-6">
            <div className="grid grid-cols-1 gap-4">
               {SAFETY_TIPS.map((tip, idx) => (
                 <div key={idx} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-amber-900 text-sm">{tip.title}</h5>
                      <p className="text-amber-800 text-xs mt-1 leading-relaxed">{tip.text}</p>
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2 text-sm">✓ Prompt listo para usar</h4>
              <p className="text-green-800 text-xs leading-relaxed">
                Tu prompt ha sido generado siguiendo las mejores prácticas de ingeniería de prompts 2025-2026. 
                Copia el resultado del panel derecho y pégalo en tu LLM favorito.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      
      {/* --- PANEL IZQUIERDO: CONSTRUCTOR SECUENCIAL --- */}
      <div className="w-full md:w-1/2 lg:w-3/5 border-r border-slate-200 bg-white flex flex-col h-screen">
        {/* Header con indicador de progreso */}
        <div className="p-6 border-b border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Layers className="w-6 h-6" />
              <span className="font-bold tracking-tight text-lg">PromptArchitect</span>
            </div>
            <button 
              onClick={reset}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title="Empezar de nuevo"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          {/* Indicador de pasos */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = currentStep === idx;
              const isCompleted = currentStep > idx;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => goToStep(idx)}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                      isActive 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg scale-110" 
                        : isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-slate-300 text-slate-400 hover:border-indigo-400"
                    )}
                    title={step.title}
                  >
                    <StepIcon className="w-5 h-5" />
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className={cn(
                      "flex-1 h-1 mx-2 transition-colors",
                      isCompleted ? "bg-green-500" : "bg-slate-200"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contenido del paso actual */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 border-b border-slate-200 bg-white">
            <div className="flex items-center space-x-3 mb-2">
              {(() => {
                const StepIcon = STEPS[currentStep].icon;
                return <StepIcon className="w-6 h-6 text-indigo-600" />;
              })()}
              <div>
                <h2 className="font-bold text-xl text-slate-800">{STEPS[currentStep].title}</h2>
                <p className="text-sm text-slate-500">{STEPS[currentStep].description}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white">
            {renderStepContent()}
          </div>
        </div>

        {/* Navegación */}
        <div className="p-6 border-t border-slate-200 bg-white">
          {/* Mensaje de validación */}
          {currentStepError && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-2 text-amber-800 text-sm animate-in fade-in">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>{currentStepError}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all",
                currentStep === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-sm text-slate-500">
              Paso {currentStep + 1} de {STEPS.length}
            </span>

            <button
              onClick={nextStep}
              disabled={currentStep === STEPS.length - 1 || !currentStepValid}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all",
                currentStep === STEPS.length - 1 || !currentStepValid
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
              title={currentStepError || ''}
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- PANEL DERECHO: VISTA PREVIA --- */}
      <div className="w-full md:w-1/2 lg:w-2/5 bg-slate-900 text-slate-200 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900 z-10">
          <h2 className="font-bold text-white flex items-center">
            <Check className="w-5 h-5 mr-2 text-green-400" />
            Prompt Resultante
            {activeTemplate && <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">Plantilla Activa</span>}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={copyToClipboard}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all",
                copied ? "bg-green-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
              )}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        <div className="flex-grow p-6 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap custom-scrollbar">
          {buildPrompt ? (
            buildPrompt
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
              <Play className="w-12 h-12 opacity-20" />
              <p className="text-center max-w-xs">
                Completa los pasos para ver tu prompt generarse aquí en tiempo real.
              </p>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-xs text-slate-500 flex justify-between">
          <span>Optimizado para {MODELS.find(m => m.id === data.model)?.name}</span>
          <span>{buildPrompt.length} caracteres</span>
        </div>
      </div>

    </div>
  );
}
