import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  User, Target, Layers, FileText, Copy, Check, RotateCcw,
  BrainCircuit, MessageSquare, Zap, Layout, BookOpen, Shield,
  ChevronRight, ChevronLeft, GitBranch, Repeat2, TreePine
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
  { id: 'claude',  name: 'Claude',  vendor: 'Anthropic', prefers: 'XML',      color: 'violet',  dot: '#7C3AED' },
  { id: 'gpt',     name: 'GPT',     vendor: 'OpenAI',    prefers: 'Markdown', color: 'emerald', dot: '#10B981' },
  { id: 'gemini',  name: 'Gemini',  vendor: 'Google',    prefers: 'Markdown', color: 'blue',    dot: '#3B82F6' },
  { id: 'llama',   name: 'Llama',   vendor: 'Meta',      prefers: 'Markdown', color: 'orange',  dot: '#F97316' },
];

const ROLES = [
  'Experto en Marketing Digital', 'Ingeniero de Software Senior', 'Redactor Creativo',
  'Analista de Datos', 'Consultor Legal', 'Profesor / Tutor Académico',
  'Gestor de Producto', 'Reclutador IT', 'Diseñador UX/UI', 'Traductor Profesional',
  'Oficial de Cumplimiento', 'Arquitecto de Software', 'Científico de Datos',
];

const EXPERIENCE_LEVELS = [
  { id: 'junior',    label: 'Junior / Aprendiz' },
  { id: 'mid',       label: 'Semi-Senior / Competente' },
  { id: 'senior',    label: 'Senior / Experto' },
  { id: 'principal', label: 'Principal / Autoridad Mundial' },
];

const TONES = [
  { id: 'professional',  label: 'Profesional y Corporativo',          desc: 'Formal, sin emociones' },
  { id: 'friendly',      label: 'Amigable y Cercano',                 desc: 'Conversacional, empático' },
  { id: 'academic',      label: 'Académico y Formal',                 desc: 'Riguroso, citando fuentes' },
  { id: 'persuasive',    label: 'Persuasivo y de Ventas',             desc: 'Enfocado en conversión' },
  { id: 'concise',       label: 'Directo y Conciso',                  desc: 'Mínimas palabras, máximo impacto' },
  { id: 'inspirational', label: 'Inspirador',                         desc: 'Motivacional, positivo' },
  { id: 'technical',     label: 'Denso y Técnico',                    desc: 'Jerga especializada, sin simplificar' },
  { id: 'eli5',          label: 'Explica como a un niño de 5 años',   desc: 'Analogías simples' },
];

const FORMATS = [
  { id: 'plain',    label: 'Texto Plano',                  needsSchema: false },
  { id: 'bullets',  label: 'Lista con Viñetas',            needsSchema: false },
  { id: 'table',    label: 'Tabla Comparativa',            needsSchema: false },
  { id: 'markdown', label: 'Markdown Estructurado',        needsSchema: false },
  { id: 'json',     label: 'JSON Estructurado',            needsSchema: true  },
  { id: 'xml',      label: 'XML Estructurado',             needsSchema: true  },
  { id: 'csv',      label: 'CSV (Tabla de Datos)',         needsSchema: false },
  { id: 'steps',    label: 'Paso a Paso Numerado',         needsSchema: false },
  { id: 'code',     label: 'Solo Código (sin explicaciones)', needsSchema: false },
];

const AUDIENCE_LEVELS = [
  'Niño de 5 años',
  'Principiante sin conocimientos previos',
  'Intermedio con bases',
  'Experto / Técnico',
  'Ejecutivo (solo resumen)',
];

// --- Componentes UI ---

const InputGroup = ({ label, children, helper }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-stone-700">{label}</label>
    {children}
    {helper && <p className="text-xs text-stone-400">{helper}</p>}
  </div>
);

const Toggle = ({ label, checked, onChange, icon: Icon, description }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      'flex items-center justify-between w-full p-3 rounded-xl border transition-all duration-150',
      checked
        ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-200 shadow-sm'
        : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm',
    )}
  >
    <div className="flex items-center space-x-3 min-w-0">
      {Icon && <Icon className={cn('w-4 h-4 flex-shrink-0', checked ? 'text-indigo-600' : 'text-stone-400')} />}
      <div className="min-w-0 text-left">
        <span className={cn('text-sm font-medium block', checked ? 'text-indigo-900' : 'text-stone-700')}>
          {label}
        </span>
        {description && (
          <span className="text-xs text-stone-400 leading-tight">{description}</span>
        )}
      </div>
    </div>
    <div className={cn(
      'w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ml-3',
      checked ? 'bg-indigo-600' : 'bg-stone-300',
    )}>
      <div className={cn(
        'absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-5' : 'translate-x-0',
      )} />
    </div>
  </button>
);

// --- Componente Principal ---

export default function App() {
  const roleInputRef = useRef(null);

  const STEPS = [
    { id: 0, title: 'Modelo LLM',          icon: Zap,         description: 'Elige el modelo objetivo' },
    { id: 1, title: 'Plantilla',            icon: BookOpen,    description: 'Plantilla de sector (opcional)' },
    { id: 2, title: 'Persona',              icon: User,        description: 'Rol, experiencia y tono' },
    { id: 3, title: 'Contexto',             icon: FileText,    description: 'Datos de entrada y contexto' },
    { id: 4, title: 'Tarea',                icon: Target,      description: 'Instrucción principal' },
    { id: 5, title: 'Formato',              icon: Layout,      description: 'Estructura de la respuesta' },
    { id: 6, title: 'Avanzado',             icon: BrainCircuit, description: 'Técnicas de razonamiento' },
    { id: 7, title: 'Seguridad',            icon: Shield,      description: 'Validación final' },
  ];

  const [data, setData] = useState({
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
    useNegativeInstructions: true,
    useSelfConsistency: false,
    useReAct: false,
    useToT: false,
  });

  const [examples, setExamples] = useState([{ input: '', output: '' }]);
  const [attachments, setAttachments] = useState([{ name: '', description: '' }]);
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // ========================================
  // CONSTRUCTOR DE PROMPT
  // ========================================

  const createTagHelper = (modelId, useXMLTags) => {
    const useXML = useXMLTags && modelId === 'claude';
    return (name, content) => {
      if (!useXMLTags) return content;
      if (useXML) {
        return `<${name}>\n${content}\n</${name}>`;
      }
      const displayName = name.replace(/_/g, ' ').toUpperCase();
      return `## ${displayName}\n${content}`;
    };
  };

  const convertXmlToMarkdown = (text) => {
    if (!text) return text;
    return text
      .replace(/<([a-z_]+)\s+([^>]+)>[\s\n]*/gi, (_, tagName, attrs) => {
        const title = tagName.replace(/_/g, ' ').toUpperCase();
        const attrMatch = attrs.match(/(?:path|id|name|label|language|severity|risk|priority|type)="([^"]+)"/i);
        return `\n### ${title}${attrMatch ? `: ${attrMatch[1]}` : ''}\n`;
      })
      .replace(/<([a-z_]+)>[\s\n]*/gi, (_, tagName) => `\n### ${tagName.replace(/_/g, ' ').toUpperCase()}\n`)
      .replace(/<\/[a-z_]+>[\s\n]*/gi, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const buildPrompt = useMemo(() => {
    const modelInfo = MODELS.find(m => m.id === data.model);
    const useXML = data.useXMLTags && data.model === 'claude';
    const tag = createTagHelper(data.model, data.useXMLTags);
    const parts = [];

    // 1. PERSONA
    if (data.role) {
      let personaText = '';
      if (useXML) {
        personaText = `Eres un ${data.role}`;
        if (data.experienceLevel) {
          const expLabel = EXPERIENCE_LEVELS.find(e => e.id === data.experienceLevel)?.label;
          personaText += ` de nivel ${expLabel}`;
        }
        personaText += '.';
      } else {
        personaText = `**Rol:** ${data.role}`;
        if (data.experienceLevel) {
          const expLabel = EXPERIENCE_LEVELS.find(e => e.id === data.experienceLevel)?.label;
          personaText += `\n**Nivel de Experiencia:** ${expLabel}`;
        }
      }
      if (data.tone) {
        const toneObj = TONES.find(t => t.id === data.tone);
        if (toneObj) {
          personaText += useXML
            ? `\nEstilo de comunicación: ${toneObj.label} (${toneObj.desc}).`
            : `\n**Tono:** ${toneObj.label} — ${toneObj.desc}`;
        }
      }
      if (data.useMultiAgent) {
        const shortRole = data.role.split(/\s+(con|especializado|experto en|de nivel|\(|,)/i)[0].trim();
        personaText += useXML
          ? `\n\nModo Debate:\nSimula un debate interno entre dos perspectivas:\n- Agente Principal (${shortRole}): Propone la solución.\n- Agente Crítico (Escéptico): Cuestiona y busca huecos lógicos.\nSintetiza la mejor respuesta tras el debate.`
          : `\n\n### MODO MULTI-AGENTE\nSimula un debate interno:\n- **Agente A (${shortRole}):** Propone la solución.\n- **Agente B (Crítico):** Cuestiona y busca huecos.\nLuego sintetiza la mejor respuesta.`;
      }
      parts.push(tag('persona', personaText));
    }

    // 2. CONTEXTO
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

    // 3. DATOS DE ENTRADA
    if (data.inputData) {
      parts.push(tag('datos_entrada', `Basa tu respuesta ÚNICAMENTE en la siguiente información:\n\n${data.inputData.trim()}`));
    }

    // 3b. ARCHIVOS ADJUNTOS
    const validAttachments = attachments.filter(a => a.name && a.description);
    if (validAttachments.length > 0) {
      const attachmentsText = validAttachments.map((att, idx) =>
        useXML
          ? `Archivo ${idx + 1}:\n  Nombre: ${att.name}\n  Descripción: ${att.description}`
          : `**Archivo ${idx + 1}:** ${att.name}\n${att.description}`,
      ).join('\n\n');
      parts.push(tag('archivos_adjuntos', attachmentsText));
    }

    // 4. EJEMPLOS (Few-Shot)
    if (data.useFewShot) {
      const validExamples = examples.filter(ex => ex.input && ex.output);
      if (validExamples.length > 0) {
        const examplesText = useXML
          ? validExamples.map((ex, idx) =>
              `Ejemplo ${idx + 1}:\n  Entrada: ${ex.input}\n  Salida esperada: ${ex.output}`,
            ).join('\n\n')
          : validExamples.map((ex, idx) => {
              const outputText = convertXmlToMarkdown(ex.output);
              return `**Ejemplo ${idx + 1}:**\n- Entrada: ${ex.input}\n- Salida Esperada: ${outputText}`;
            }).join('\n\n');
        parts.push(tag('ejemplos', `Aprende del patrón de estos ejemplos y aplícalo a la tarea:\n\n${examplesText}`));
      }
    }

    // 5. TAREA
    if (data.task) {
      let taskText = data.task;
      if (data.useDecomposition) {
        taskText += useXML
          ? `\n\nEstrategia de resolución:\n1. Analiza los requisitos y restricciones\n2. Descompón el problema en sub-tareas manejables\n3. Resuelve cada sub-tarea secuencialmente\n4. Integra las soluciones parciales\n5. Valida el resultado final`
          : `\n\n### ESTRATEGIA DE RESOLUCIÓN\n1. Analiza los requisitos y restricciones\n2. Descompón el problema en sub-tareas\n3. Resuelve cada sub-tarea secuencialmente\n4. Integra las soluciones parciales\n5. Valida el resultado final`;
      }
      parts.push(tag('tarea', taskText));
    }

    // 6. RESTRICCIONES
    const constraintsList = [];
    if (Array.isArray(data.constraints)) {
      constraintsList.push(...data.constraints.filter(c => c.trim()));
    }
    if (data.useNegativeInstructions) {
      constraintsList.push(
        'IMPORTANTE: Si no tienes suficiente información para responder con certeza, responde textualmente: "No tengo información suficiente para responder esto con precisión."',
        'NO inventes hechos, fechas, estadísticas, nombres de librerías o APIs. Basa tu respuesta únicamente en los datos proporcionados.',
        'Si hay ambigüedad en la pregunta, solicita clarificación antes de asumir.',
        'Distingue claramente entre hechos verificables y opiniones/suposiciones.',
      );
    }
    if (constraintsList.length > 0) {
      const constraintsText = constraintsList.map(c => `${useXML ? '•' : '-'} ${c}`).join('\n');
      parts.push(tag('restricciones', constraintsText));
    }

    // 7. RAZONAMIENTO — CoT, Self-Consistency, ReAct, ToT
    const reasoningParts = [];

    if (data.useCoT) {
      let cotContent = '';
      if (data.model === 'claude' && useXML) {
        cotContent = `Antes de dar tu respuesta final, sigue este proceso:\n\n1. PENSAMIENTO:\n   - Analiza el problema paso a paso\n   - Identifica posibles enfoques\n   - Evalúa pros y contras de cada opción\n   - Selecciona el mejor enfoque justificando tu elección\n\n2. RESPUESTA:\n   [Tu respuesta final aquí]`;
      } else if (data.model === 'gpt') {
        cotContent = `Piensa paso a paso siguiendo este esquema:\n\n1. **Entendimiento:** ¿Qué se me está pidiendo exactamente?\n2. **Análisis:** ¿Cuáles son los elementos clave del problema?\n3. **Opciones:** ¿Qué alternativas existen?\n4. **Evaluación:** ¿Cuál es la mejor opción y por qué?\n5. **Respuesta:** Presenta tu solución final.\n\nMuestra tu razonamiento antes de la respuesta final.`;
      } else {
        cotContent = `Resuelve este problema paso a paso:\n- Primero, analiza los datos disponibles\n- Luego, identifica el enfoque óptimo\n- Finalmente, presenta tu respuesta con justificación`;
      }
      reasoningParts.push(cotContent);
    }

    if (data.useSelfConsistency) {
      const scContent = useXML
        ? `Auto-Consistencia:\nGenera 3 respuestas independientes a esta tarea usando diferentes enfoques de razonamiento.\nLuego analiza cuál es la más coherente y precisa, y preséntala como tu respuesta final.\nJustifica brevemente por qué elegiste ese enfoque.`
        : `### AUTO-CONSISTENCIA\nGenera **3 respuestas independientes** a esta tarea usando diferentes enfoques de razonamiento.\nLuego analiza cuál es la más coherente y precisa, y preséntala como tu **respuesta final**.\nJustifica brevemente por qué elegiste ese enfoque.`;
      reasoningParts.push(scContent);
    }

    if (data.useReAct) {
      const reactContent = useXML
        ? `Patrón ReAct (Razonamiento + Acción):\nResuelve esta tarea usando el patrón iterativo:\n\nPensamiento: [analiza qué necesitas hacer a continuación]\nAcción: [describe qué paso concreto tomar]\nObservación: [evalúa el resultado del paso anterior]\n\nRepite Pensamiento → Acción → Observación hasta alcanzar la respuesta final.`
        : `### PATRÓN REACT (RAZONAMIENTO + ACCIÓN)\nResuelve esta tarea usando el patrón iterativo:\n\n**Pensamiento:** [analiza qué necesitas hacer]\n**Acción:** [describe qué paso concreto tomar]\n**Observación:** [evalúa el resultado]\n\nRepite hasta alcanzar la **respuesta final**.`;
      reasoningParts.push(reactContent);
    }

    if (data.useToT) {
      const totContent = useXML
        ? `Árbol de Pensamientos:\nExplora 3 enfoques distintos para esta tarea:\n\nEnfoque A: [primera vía de solución]\nEnfoque B: [segunda vía de solución]\nEnfoque C: [tercera vía de solución]\n\nEvalúa cada enfoque según: viabilidad, calidad y riesgos.\nFinalmente, sintetiza la mejor solución combinando lo más valioso de cada enfoque.`
        : `### ÁRBOL DE PENSAMIENTOS (ToT)\nExplora **3 enfoques distintos** para esta tarea:\n\n- **Enfoque A:** [primera vía de solución]\n- **Enfoque B:** [segunda vía de solución]\n- **Enfoque C:** [tercera vía de solución]\n\nEvalúa cada enfoque: viabilidad, calidad y riesgos.\nSintetiza la **mejor solución** combinando lo más valioso de cada enfoque.`;
      reasoningParts.push(totContent);
    }

    if (reasoningParts.length > 0) {
      parts.push(tag('razonamiento', reasoningParts.join('\n\n---\n\n')));
    }

    // 8. FORMATO DE SALIDA
    const formatInstructions = [];
    if (data.format) {
      const formatObj = FORMATS.find(f => f.id === data.format);
      if (formatObj) {
        formatInstructions.push(useXML
          ? `Formato requerido: ${formatObj.label}`
          : `**Formato requerido:** ${formatObj.label}`);
        if (formatObj.needsSchema && data.outputSchema) {
          formatInstructions.push(useXML
            ? `Esquema a seguir:\n${data.outputSchema}\nRellena este esquema exactamente, sin añadir campos adicionales.`
            : `### ESQUEMA A SEGUIR\n\`\`\`\n${data.outputSchema}\n\`\`\`\nRellena este esquema exactamente.`);
        }
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

    // ENSAMBLAJE FINAL
    let finalText = parts.join('\n\n');

    const activeTechniques = [
      data.useCoT && 'Chain-of-Thought',
      data.useFewShot && 'Few-Shot',
      data.useDecomposition && 'Descomposición',
      data.useMultiAgent && 'Multi-Agente',
      data.useNegativeInstructions && 'Anti-Alucinación',
      data.useSelfConsistency && 'Self-Consistency',
      data.useReAct && 'ReAct',
      data.useToT && 'Tree-of-Thoughts',
    ].filter(Boolean);

    const structureType = useXML ? 'XML (Claude)' : 'Markdown';
    const header = `# Prompt → ${modelInfo?.name || 'LLM'} | Estructura: ${structureType}\n# Técnicas: ${activeTechniques.join(', ') || 'Ninguna'}\n\n`;

    return header + finalText;
  }, [data, examples, attachments]);

  const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (roleInputRef.current && data.role) {
      const el = roleInputRef.current;
      try { el.setSelectionRange(data.role.length, data.role.length); } catch { /* ok */ }
    }
  }, [data.role]);

  const loadTemplate = (useCase) => {
    setActiveTemplate(useCase.id);
    const toneId = TONES.find(t => t.label === useCase.tone)?.id || '';
    const formatId = FORMATS.find(f => f.label === useCase.format)?.id || '';
    const hasExamples = useCase.examples && useCase.examples.length > 0;
    if (hasExamples) {
      setExamples(useCase.examples.map(ex => ({ input: ex.input, output: ex.output })));
    } else {
      setExamples([{ input: '', output: '' }]);
    }
    setData(prev => ({
      ...prev,
      role: useCase.role || '',
      experienceLevel: 'senior',
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
      useFewShot: hasExamples,
      useDecomposition: useCase.id.includes('plan') || useCase.id.includes('strategy') || useCase.id.includes('portfolio') || useCase.id.includes('legacy'),
      useMultiAgent: false,
      useNegativeInstructions: true,
      useSelfConsistency: false,
      useReAct: false,
      useToT: false,
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const goToStep = (idx) => {
    if (idx < currentStep) { setCurrentStep(idx); return; }
    if (idx === currentStep) return;
    let canAdvance = true;
    for (let i = currentStep; i < idx; i++) {
      if (!isStepValid(i)) { canAdvance = false; break; }
    }
    if (canAdvance) setCurrentStep(idx);
  };

  const isStepValid = (stepIndex) => {
    switch (stepIndex) {
      case 0: return !!data.model;
      case 1: return true;
      case 2: return data.role.trim().length >= 3;
      case 3: return true;
      case 4: return data.task.trim().length >= 10;
      default: return true;
    }
  };

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
      default: return null;
    }
  };

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
      useNegativeInstructions: true,
      useSelfConsistency: false,
      useReAct: false,
      useToT: false,
    });
    setExamples([{ input: '', output: '' }]);
    setAttachments([{ name: '', description: '' }]);
    setCurrentStep(0);
  };

  const addExample = () => { if (examples.length < 5) setExamples([...examples, { input: '', output: '' }]); };
  const removeExample = (i) => { if (examples.length > 1) setExamples(examples.filter((_, idx) => idx !== i)); };
  const updateExample = (i, field, value) => {
    const next = [...examples]; next[i][field] = value; setExamples(next);
  };

  const addConstraint = () => setData(prev => ({ ...prev, constraints: [...(prev.constraints || ['']), ''] }));
  const removeConstraint = (i) => setData(prev => {
    const next = [...(prev.constraints || [])].filter((_, idx) => idx !== i);
    return { ...prev, constraints: next.length ? next : [''] };
  });
  const updateConstraint = (i, value) => setData(prev => {
    const next = [...(prev.constraints || [])]; next[i] = value; return { ...prev, constraints: next };
  });

  const addAttachment = () => { if (attachments.length < 10) setAttachments([...attachments, { name: '', description: '' }]); };
  const removeAttachment = (i) => { if (attachments.length > 1) setAttachments(attachments.filter((_, idx) => idx !== i)); };
  const updateAttachment = (i, field, value) => {
    const next = [...attachments]; next[i][field] = value; setAttachments(next);
  };

  // --- Renderizado de pasos ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="p-6 animate-slide-up">
            <InputGroup
              label="Selecciona el Modelo LLM Objetivo"
              helper="La estructura del prompt se adapta automáticamente: XML para Claude, Markdown para el resto."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {MODELS.map(model => {
                  const isSelected = data.model === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleChange('model', model.id)}
                      className={cn(
                        'p-4 rounded-2xl border-2 text-left transition-all duration-150',
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-100'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm',
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: model.dot }} />
                        <div>
                          <div className={cn('font-bold text-base', isSelected ? 'text-indigo-900' : 'text-stone-800')}>
                            {model.name}
                          </div>
                          <div className="text-xs text-stone-500">{model.vendor}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 ml-auto" />}
                      </div>
                      <div className={cn(
                        'mt-2 text-xs px-2 py-0.5 rounded-full inline-block font-medium',
                        isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-500',
                      )}>
                        Estructura: {model.prefers}
                      </div>
                    </button>
                  );
                })}
              </div>
            </InputGroup>
          </div>
        );

      case 1:
        return (
          <div className="p-6 animate-slide-up">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-stone-800 mb-1">
                  {!selectedSector ? 'Elige tu Sector Profesional' : 'Casos de Uso Disponibles'}
                </h3>
                <p className="text-sm text-stone-500">
                  {!selectedSector
                    ? 'Selecciona el sector que mejor describe tu trabajo o proyecto.'
                    : 'Elige un caso de uso para precargar datos, o salta para crear desde cero.'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {selectedSector && !activeTemplate && (
                  <button
                    onClick={() => setSelectedSector(null)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Sectores
                  </button>
                )}
                {activeTemplate && (
                  <button
                    onClick={() => {
                      setActiveTemplate(null);
                      setSelectedSector(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {!selectedSector ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SECTORS.map(sector => (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{sector.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-900 mb-0.5 group-hover:text-indigo-700 transition-colors text-sm">
                          {sector.name}
                        </h4>
                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                          {sector.description}
                        </p>
                        <div className="mt-2 text-xs text-indigo-600 font-medium flex items-center gap-1">
                          {sector.useCases.length} casos
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {SECTORS.find(s => s.id === selectedSector)?.useCases.map(useCase => (
                  <button
                    key={useCase.id}
                    onClick={() => loadTemplate(useCase)}
                    className={cn(
                      'w-full p-4 rounded-2xl border text-left transition-all duration-150 hover:shadow-sm',
                      activeTemplate === useCase.id
                        ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-100'
                        : 'bg-white border-stone-200 hover:border-indigo-300',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-900 mb-1 text-sm">{useCase.title}</h4>
                        <p className="text-xs text-stone-600 mb-1.5">
                          <span className="font-medium">Rol:</span> {useCase.role}
                        </p>
                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{useCase.task}</p>
                      </div>
                      {activeTemplate === useCase.id && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="p-6 space-y-5 animate-slide-up">
            <InputGroup
              label={<>A. Rol / Profesión <span className="text-red-500">*</span></>}
              helper="Define la identidad experta de la IA. Campo obligatorio (mín. 3 caracteres)."
            >
              <div className="relative">
                <textarea
                  list="roles-list"
                  className={cn(
                    'w-full p-3 border rounded-xl focus:ring-2 focus:outline-none transition-all bg-stone-50 resize-none min-h-[64px] text-sm',
                    data.role.trim().length > 0 && data.role.trim().length < 3
                      ? 'border-amber-400 bg-amber-50 focus:ring-amber-200 focus:border-amber-400'
                      : data.role.trim().length >= 3
                      ? 'border-emerald-400 bg-emerald-50/50 focus:ring-emerald-200 focus:border-emerald-400'
                      : 'border-stone-200 focus:ring-indigo-100 focus:border-indigo-400',
                  )}
                  placeholder="Ej. Arquitecto de Software, Consultor Legal, Científico de Datos..."
                  rows={2}
                  ref={roleInputRef}
                  value={data.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                />
                {data.role.trim().length >= 3 && (
                  <div className="absolute right-3 top-3">
                    <Check className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
                <datalist id="roles-list">
                  {ROLES.map(r => <option key={r} value={r} />)}
                </datalist>
              </div>
            </InputGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup label="B. Nivel de Experiencia" helper="Calibra la autoridad y profundidad.">
                <select
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none bg-stone-50 text-sm"
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
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none bg-stone-50 text-sm"
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
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-indigo-800 animate-fade-in">
                <strong>Efecto:</strong> {TONES.find(t => t.id === data.tone)?.desc}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="p-6 space-y-5 animate-slide-up">
            <InputGroup label="A. Contexto Previo" helper="Prepara el escenario. Información de fondo y situación actual.">
              <textarea
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none min-h-[96px] bg-stone-50 text-sm resize-none"
                placeholder="Ej. Estamos en un entorno legacy con SQL Server 2012. El usuario tiene conocimientos básicos de programación..."
                value={data.context}
                onChange={(e) => handleChange('context', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="B. Nivel de Audiencia" helper="¿Para quién es la respuesta?">
              <select
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none bg-stone-50 text-sm"
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
                className="w-full p-3 border border-stone-800 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[120px] font-mono text-sm bg-stone-900 text-stone-100 placeholder:text-stone-500 resize-none"
                placeholder="Pega aquí logs, código fuente, documentos, transcripciones..."
                value={data.inputData}
                onChange={(e) => handleChange('inputData', e.target.value)}
              />
            </InputGroup>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-stone-700">D. Archivos Adjuntos (Descripción)</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Especifica nombre y descripción de archivos a referenciar (no se suben).</p>
                </div>
                <button
                  onClick={addAttachment}
                  disabled={attachments.length >= 10}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    attachments.length >= 10
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700',
                  )}
                >
                  + Añadir
                </button>
              </div>
              <div className="space-y-2">
                {attachments.map((att, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-stone-600">Archivo {idx + 1}</span>
                      {attachments.length > 1 && (
                        <button onClick={() => removeAttachment(idx)} className="text-xs text-red-500 hover:text-red-700">
                          Eliminar
                        </button>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <input
                        className="w-full p-2 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                        placeholder="Nombre del archivo (ej: contrato_NDA_v2.pdf) *"
                        value={att.name}
                        onChange={(e) => updateAttachment(idx, 'name', e.target.value)}
                      />
                      <textarea
                        className="w-full p-2 border border-stone-200 rounded-lg text-sm bg-stone-50 min-h-[56px] resize-none focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                        placeholder="Descripción del archivo (contenido, propósito, información relevante) *"
                        value={att.description}
                        onChange={(e) => updateAttachment(idx, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-6 space-y-5 animate-slide-up">
            <InputGroup
              label={<>A. Tarea Principal (Imperativa) <span className="text-red-500">*</span></>}
              helper="Usa verbos de acción fuertes: Genera, Clasifica, Resume, Extrae, Analiza... (mín. 10 caracteres)"
            >
              <div className="relative">
                <textarea
                  className={cn(
                    'w-full p-3 border rounded-xl focus:ring-2 focus:outline-none min-h-[100px] bg-stone-50 text-sm resize-none transition-all',
                    data.task.trim().length > 0 && data.task.trim().length < 10
                      ? 'border-amber-400 bg-amber-50 focus:ring-amber-200 focus:border-amber-400'
                      : data.task.trim().length >= 10
                      ? 'border-emerald-400 bg-emerald-50/50 focus:ring-emerald-200 focus:border-emerald-400'
                      : 'border-stone-200 focus:ring-indigo-100 focus:border-indigo-400',
                  )}
                  placeholder="Ej. Genera un endpoint REST en Python que valide tokens JWT y retorne el perfil del usuario..."
                  value={data.task}
                  onChange={(e) => handleChange('task', e.target.value)}
                />
                {data.task.trim().length > 0 && (
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    <span className={cn(
                      'text-xs font-medium',
                      data.task.trim().length >= 10 ? 'text-emerald-600' : 'text-amber-600',
                    )}>
                      {data.task.trim().length}/10+
                    </span>
                    {data.task.trim().length >= 10 && <Check className="w-4 h-4 text-emerald-500" />}
                  </div>
                )}
              </div>
            </InputGroup>

            <InputGroup label="B. Restricciones y Límites" helper="Define lo que NO debe hacer o los límites del trabajo.">
              <div className="space-y-2">
                {(data.constraints || ['']).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      className="flex-1 p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none bg-stone-50 text-sm"
                      placeholder="Ej. No uses librerías obsoletas, máximo 50 líneas de código"
                      value={item}
                      onChange={(e) => updateConstraint(idx, e.target.value)}
                    />
                    {(data.constraints?.length || 0) > 1 && (
                      <button
                        onClick={() => removeConstraint(idx)}
                        className="px-2.5 py-2 rounded-lg text-xs text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addConstraint}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors"
                >
                  + Añadir restricción
                </button>
              </div>
            </InputGroup>
          </div>
        );

      case 5:
        return (
          <div className="p-6 space-y-5 animate-slide-up">
            <InputGroup label="A. Formato Estructurado" helper="Define cómo debe verse la respuesta.">
              <select
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none bg-stone-50 text-sm"
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
                  className="w-full p-3 border border-stone-800 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[100px] font-mono text-sm bg-stone-900 text-stone-100 placeholder:text-stone-500 resize-none"
                  placeholder={data.format === 'json' ? '{\n  "nombre": "",\n  "edad": 0\n}' : '<resultado>\n  <item id="" />\n</resultado>'}
                  value={data.outputSchema}
                  onChange={(e) => handleChange('outputSchema', e.target.value)}
                />
              </InputGroup>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup label="C. Longitud Objetivo">
                <input
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none bg-stone-50 text-sm"
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

      case 6:
        return (
          <div className="p-6 space-y-5 animate-slide-up">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Técnicas Base</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Toggle label="Cadena de Pensamiento (CoT)" icon={Zap} description="Razonamiento paso a paso"
                  checked={data.useCoT} onChange={(v) => handleChange('useCoT', v)} />
                <Toggle label="Descomposición de Tareas" icon={Target} description="Divide y resuelve en fases"
                  checked={data.useDecomposition} onChange={(v) => handleChange('useDecomposition', v)} />
                <Toggle label="Multi-Agente / Debate" icon={MessageSquare} description="Debate interno de perspectivas"
                  checked={data.useMultiAgent} onChange={(v) => handleChange('useMultiAgent', v)} />
                <Toggle label="Ejemplos (Few-Shot)" icon={Copy} description="1-5 ejemplos de referencia"
                  checked={data.useFewShot} onChange={(v) => handleChange('useFewShot', v)} />
                <Toggle label="Etiquetas XML/Markdown" icon={Layout} description="Estructura semántica del prompt"
                  checked={data.useXMLTags} onChange={(v) => handleChange('useXMLTags', v)} />
                <Toggle label="Anti-Alucinación" icon={Shield} description="Guardrails para respuestas precisas"
                  checked={data.useNegativeInstructions} onChange={(v) => handleChange('useNegativeInstructions', v)} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Técnicas Avanzadas 2025</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Toggle label="Self-Consistency" icon={Repeat2} description="Múltiples razonamientos → consenso"
                  checked={data.useSelfConsistency} onChange={(v) => handleChange('useSelfConsistency', v)} />
                <Toggle label="ReAct (Razonamiento + Acción)" icon={GitBranch} description="Pensar → Actuar → Observar"
                  checked={data.useReAct} onChange={(v) => handleChange('useReAct', v)} />
                <Toggle label="Árbol de Pensamientos (ToT)" icon={TreePine} description="Explorar múltiples ramas"
                  checked={data.useToT} onChange={(v) => handleChange('useToT', v)} />
              </div>
            </div>

            {data.useCoT && data.model === 'claude' && (
              <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 text-sm text-violet-800 animate-fade-in">
                <strong>Claude + CoT:</strong> Se estructurará el razonamiento con etiquetas &lt;thinking&gt; y &lt;answer&gt;.
              </div>
            )}

            {data.useSelfConsistency && data.useToT && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800 animate-fade-in">
                <strong>Self-Consistency + ToT:</strong> Combinación potente pero verbosa. El prompt resultante será más largo.
              </div>
            )}

            {data.useFewShot && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-stone-700">Ejemplos de Entrenamiento (Few-Shot)</h4>
                  <button
                    onClick={addExample}
                    disabled={examples.length >= 5}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                      examples.length >= 5
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700',
                    )}
                  >
                    + Ejemplo ({examples.length}/5)
                  </button>
                </div>
                <div className="space-y-2">
                  {examples.map((ex, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-stone-600">Ejemplo {idx + 1}</span>
                        {examples.length > 1 && (
                          <button onClick={() => removeExample(idx)} className="text-xs text-red-500 hover:text-red-700">
                            Eliminar
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          className="p-2 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                          placeholder="Entrada..."
                          value={ex.input}
                          onChange={(e) => updateExample(idx, 'input', e.target.value)}
                        />
                        <input
                          className="p-2 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:ring-1 focus:ring-indigo-300 focus:outline-none"
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

      case 7:
        return (
          <div className="p-6 space-y-5 animate-slide-up">
            <div className="grid grid-cols-1 gap-3">
              {SAFETY_TIPS.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
                  <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-amber-900 text-sm">{tip.title}</h5>
                    <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <h4 className="font-semibold text-emerald-900 text-sm">Prompt listo para usar</h4>
              </div>
              <p className="text-emerald-700 text-xs leading-relaxed">
                Tu prompt ha sido generado siguiendo las mejores prácticas de ingeniería de prompts 2025–2026.
                Copia el resultado del panel derecho y pégalo en tu LLM favorito.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const promptCharCount = buildPrompt ? buildPrompt.length : 0;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col md:flex-row">

      {/* PANEL IZQUIERDO */}
      <div className="w-full md:w-1/2 lg:w-3/5 border-r border-stone-200 bg-white flex flex-col h-screen">

        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 bg-gradient-to-b from-stone-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight text-stone-900">PromptArchitect</span>
            </div>
            <button
              onClick={reset}
              className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-600 transition-colors"
              title="Empezar de nuevo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = currentStep === idx;
              const isCompleted = currentStep > idx;
              return (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => goToStep(idx)}
                      title={step.title}
                      className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200',
                        isActive
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md ring-4 ring-indigo-100'
                          : isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-stone-300 text-stone-400 hover:border-indigo-300 hover:text-indigo-400',
                      )}
                    >
                      <StepIcon className="w-3.5 h-3.5" />
                    </button>
                    <span className={cn(
                      'text-[9px] font-medium mt-0.5 hidden sm:block truncate max-w-[48px] text-center leading-tight',
                      isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-stone-400',
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={cn(
                      'flex-1 h-1 mx-1 rounded-full transition-colors duration-300',
                      isCompleted ? 'bg-emerald-400' : 'bg-stone-200',
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Título del paso */}
        <div className="px-6 py-3 border-b border-stone-100 bg-white">
          <div className="flex items-center gap-2.5">
            {(() => { const Icon = STEPS[currentStep].icon; return <Icon className="w-5 h-5 text-indigo-600" />; })()}
            <div>
              <h2 className="font-bold text-base text-stone-800">{STEPS[currentStep].title}</h2>
              <p className="text-xs text-stone-500">{STEPS[currentStep].description}</p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto form-scrollbar bg-white">
          {renderStepContent()}
        </div>

        {/* Navegación */}
        <div className="px-6 py-4 border-t border-stone-100 bg-white">
          {currentStepError && (
            <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800 text-xs animate-fade-in">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{currentStepError}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all',
                currentStep === 0
                  ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <span className="text-xs text-stone-400 font-medium">
              {currentStep + 1} / {STEPS.length}
            </span>

            <button
              onClick={nextStep}
              disabled={currentStep === STEPS.length - 1 || !currentStepValid}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm',
                currentStep === STEPS.length - 1 || !currentStepValid
                  ? 'bg-stone-100 text-stone-300 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95',
              )}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: PREVIEW */}
      <div className="w-full md:w-1/2 lg:w-2/5 bg-stone-900 text-stone-200 flex flex-col h-screen sticky top-0">
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              Prompt Resultante
              {activeTemplate && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                  Plantilla activa
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {promptCharCount > 0 ? `${promptCharCount.toLocaleString()} caracteres` : 'Empieza completando los pasos'}
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm active:scale-95',
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-white',
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap custom-scrollbar text-stone-300">
          {buildPrompt ? (
            buildPrompt
          ) : (
            <span className="text-stone-600 italic">El prompt aparecerá aquí mientras completas los pasos...</span>
          )}
        </div>

        {promptCharCount > 0 && (
          <div className="px-5 py-3 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              ~{Math.ceil(promptCharCount / 4).toLocaleString()} tokens estimados
            </span>
            <div className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              promptCharCount > 8000 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400',
            )}>
              {promptCharCount > 8000 ? 'Prompt largo' : 'Tamaño óptimo'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
