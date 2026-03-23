import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  User, Target, Layers, FileText, Copy, Check, RotateCcw,
  BrainCircuit, MessageSquare, Zap, Layout, BookOpen, Shield,
  ChevronRight, ChevronLeft, GitBranch, Repeat2, TreePine
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SECTORS, SAFETY_TIPS } from './data/templates';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MODELS = [
  { id: 'claude', name: 'Claude',  vendor: 'Anthropic', prefers: 'XML'      },
  { id: 'gpt',    name: 'GPT',     vendor: 'OpenAI',    prefers: 'Markdown' },
  { id: 'gemini', name: 'Gemini',  vendor: 'Google',    prefers: 'Markdown' },
  { id: 'llama',  name: 'Llama',   vendor: 'Meta',      prefers: 'Markdown' },
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
  { id: 'professional',  label: 'Profesional y Corporativo',        desc: 'Formal, sin emociones' },
  { id: 'friendly',      label: 'Amigable y Cercano',               desc: 'Conversacional, empático' },
  { id: 'academic',      label: 'Académico y Formal',               desc: 'Riguroso, citando fuentes' },
  { id: 'persuasive',    label: 'Persuasivo y de Ventas',           desc: 'Enfocado en conversión' },
  { id: 'concise',       label: 'Directo y Conciso',                desc: 'Mínimas palabras, máximo impacto' },
  { id: 'inspirational', label: 'Inspirador',                       desc: 'Motivacional, positivo' },
  { id: 'technical',     label: 'Denso y Técnico',                  desc: 'Jerga especializada, sin simplificar' },
  { id: 'eli5',          label: 'Explica como a un niño de 5 años', desc: 'Analogías simples' },
];

const FORMATS = [
  { id: 'plain',    label: 'Texto Plano',                     needsSchema: false },
  { id: 'bullets',  label: 'Lista con Viñetas',               needsSchema: false },
  { id: 'table',    label: 'Tabla Comparativa',               needsSchema: false },
  { id: 'markdown', label: 'Markdown Estructurado',           needsSchema: false },
  { id: 'json',     label: 'JSON Estructurado',               needsSchema: true  },
  { id: 'xml',      label: 'XML Estructurado',                needsSchema: true  },
  { id: 'csv',      label: 'CSV (Tabla de Datos)',            needsSchema: false },
  { id: 'steps',    label: 'Paso a Paso Numerado',            needsSchema: false },
  { id: 'code',     label: 'Solo Código (sin explicaciones)', needsSchema: false },
];

const AUDIENCE_LEVELS = [
  'Niño de 5 años',
  'Principiante sin conocimientos previos',
  'Intermedio con bases',
  'Experto / Técnico',
  'Ejecutivo (solo resumen)',
];

// ── Componentes base ──────────────────────────────────────────────────────────

const InputGroup = ({ label, children, helper }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-stone-700">{label}</label>
    {children}
    {helper && <p className="text-xs text-stone-400 leading-relaxed">{helper}</p>}
  </div>
);

const Toggle = ({ label, checked, onChange, icon: Icon, description }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      'flex items-center justify-between w-full p-3 rounded-xl border transition-all duration-150',
      checked
        ? 'border-stone-700 bg-stone-100 ring-1 ring-stone-300'
        : 'border-stone-200 bg-white hover:border-stone-300',
    )}
  >
    <div className="flex items-center gap-3 min-w-0">
      {Icon && <Icon className={cn('w-4 h-4 flex-shrink-0', checked ? 'text-stone-700' : 'text-stone-400')} />}
      <div className="min-w-0 text-left">
        <span className={cn('text-sm font-medium block truncate', checked ? 'text-stone-900' : 'text-stone-600')}>
          {label}
        </span>
        {description && <span className="text-xs text-stone-400 leading-tight">{description}</span>}
      </div>
    </div>
    <div className={cn(
      'w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ml-3',
      checked ? 'bg-stone-800' : 'bg-stone-300',
    )}>
      <div className={cn(
        'absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-5' : 'translate-x-0',
      )} />
    </div>
  </button>
);

// ── Componente principal ──────────────────────────────────────────────────────

export default function App() {
  const roleInputRef = useRef(null);

  const STEPS = [
    { id: 0, title: 'Modelo LLM', icon: Zap,          description: 'Elige el modelo objetivo' },
    { id: 1, title: 'Plantilla',  icon: BookOpen,      description: 'Plantilla de sector (opcional)' },
    { id: 2, title: 'Persona',    icon: User,          description: 'Rol, experiencia y tono' },
    { id: 3, title: 'Contexto',   icon: FileText,      description: 'Datos de entrada y contexto' },
    { id: 4, title: 'Tarea',      icon: Target,        description: 'Instrucción principal' },
    { id: 5, title: 'Formato',    icon: Layout,        description: 'Estructura de la respuesta' },
    { id: 6, title: 'Avanzado',   icon: BrainCircuit,  description: 'Técnicas de razonamiento' },
    { id: 7, title: 'Seguridad',  icon: Shield,        description: 'Validación final' },
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

  // ── Constructor de prompt ─────────────────────────────────────────────────

  const createTagHelper = (modelId, useXMLTags) => {
    const useXML = useXMLTags && modelId === 'claude';
    return (name, content) => {
      if (!useXMLTags) return content;
      if (useXML) return `<${name}>\n${content}\n</${name}>`;
      return `## ${name.replace(/_/g, ' ').toUpperCase()}\n${content}`;
    };
  };

  const convertXmlToMarkdown = (text) => {
    if (!text) return text;
    return text
      .replace(/<([a-z_]+)\s+([^>]+)>[\s\n]*/gi, (_, tagName, attrs) => {
        const title = tagName.replace(/_/g, ' ').toUpperCase();
        const m = attrs.match(/(?:path|id|name|label|language|severity|risk|priority|type)="([^"]+)"/i);
        return `\n### ${title}${m ? `: ${m[1]}` : ''}\n`;
      })
      .replace(/<([a-z_]+)>[\s\n]*/gi, (_, t) => `\n### ${t.replace(/_/g, ' ').toUpperCase()}\n`)
      .replace(/<\/[a-z_]+>[\s\n]*/gi, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const buildPrompt = useMemo(() => {
    const modelInfo = MODELS.find(m => m.id === data.model);
    const useXML = data.useXMLTags && data.model === 'claude';
    const tag = createTagHelper(data.model, data.useXMLTags);
    const parts = [];

    if (data.role) {
      let p = useXML
        ? `Eres un ${data.role}${data.experienceLevel ? ` de nivel ${EXPERIENCE_LEVELS.find(e => e.id === data.experienceLevel)?.label}` : ''}.`
        : `**Rol:** ${data.role}${data.experienceLevel ? `\n**Nivel:** ${EXPERIENCE_LEVELS.find(e => e.id === data.experienceLevel)?.label}` : ''}`;
      if (data.tone) {
        const t = TONES.find(t => t.id === data.tone);
        if (t) p += useXML ? `\nEstilo de comunicación: ${t.label} (${t.desc}).` : `\n**Tono:** ${t.label} — ${t.desc}`;
      }
      if (data.useMultiAgent) {
        const shortRole = data.role.split(/\s+(con|especializado|experto en|de nivel|\(|,)/i)[0].trim();
        p += useXML
          ? `\n\nModo Debate:\nSimula un debate interno:\n- Agente Principal (${shortRole}): Propone la solución.\n- Agente Crítico (Escéptico): Cuestiona y busca huecos lógicos.\nSintetiza la mejor respuesta tras el debate.`
          : `\n\n### MODO MULTI-AGENTE\n- **Agente A (${shortRole}):** Propone la solución.\n- **Agente B (Crítico):** Cuestiona y busca huecos.\nSintetiza la mejor respuesta.`;
      }
      parts.push(tag('persona', p));
    }

    if (data.context || data.audienceLevel) {
      let c = data.context || '';
      if (data.audienceLevel) {
        if (c) c += '\n\n';
        c += useXML
          ? `Audiencia objetivo: ${data.audienceLevel}\nAdapta el nivel de detalle y vocabulario para esta audiencia.`
          : `**AUDIENCIA:** ${data.audienceLevel}\nAdapta el nivel de detalle y vocabulario para esta audiencia.`;
      }
      parts.push(tag('contexto', c));
    }

    if (data.inputData) {
      parts.push(tag('datos_entrada', `Basa tu respuesta ÚNICAMENTE en la siguiente información:\n\n${data.inputData.trim()}`));
    }

    const validAttachments = attachments.filter(a => a.name && a.description);
    if (validAttachments.length > 0) {
      const at = validAttachments.map((a, i) =>
        useXML ? `Archivo ${i + 1}:\n  Nombre: ${a.name}\n  Descripción: ${a.description}`
               : `**Archivo ${i + 1}:** ${a.name}\n${a.description}`
      ).join('\n\n');
      parts.push(tag('archivos_adjuntos', at));
    }

    if (data.useFewShot) {
      const ve = examples.filter(e => e.input && e.output);
      if (ve.length > 0) {
        const ex = useXML
          ? ve.map((e, i) => `Ejemplo ${i + 1}:\n  Entrada: ${e.input}\n  Salida esperada: ${e.output}`).join('\n\n')
          : ve.map((e, i) => `**Ejemplo ${i + 1}:**\n- Entrada: ${e.input}\n- Salida: ${convertXmlToMarkdown(e.output)}`).join('\n\n');
        parts.push(tag('ejemplos', `Aprende del patrón de estos ejemplos y aplícalo a la tarea:\n\n${ex}`));
      }
    }

    if (data.task) {
      let t = data.task;
      if (data.useDecomposition) {
        t += useXML
          ? `\n\nEstrategia de resolución:\n1. Analiza los requisitos y restricciones\n2. Descompón en sub-tareas manejables\n3. Resuelve cada sub-tarea secuencialmente\n4. Integra las soluciones parciales\n5. Valida el resultado final`
          : `\n\n### ESTRATEGIA DE RESOLUCIÓN\n1. Analiza los requisitos\n2. Descompón en sub-tareas\n3. Resuelve secuencialmente\n4. Integra soluciones\n5. Valida el resultado`;
      }
      parts.push(tag('tarea', t));
    }

    const cl = [...(Array.isArray(data.constraints) ? data.constraints.filter(c => c.trim()) : [])];
    if (data.useNegativeInstructions) {
      cl.push(
        'IMPORTANTE: Si no tienes suficiente información para responder con certeza, indícalo explícitamente.',
        'NO inventes hechos, fechas, estadísticas, librerías o APIs. Basa tu respuesta en los datos proporcionados.',
        'Si hay ambigüedad, solicita clarificación antes de asumir.',
        'Distingue claramente entre hechos verificables y opiniones.',
      );
    }
    if (cl.length > 0) {
      parts.push(tag('restricciones', cl.map(c => `${useXML ? '•' : '-'} ${c}`).join('\n')));
    }

    const reasoning = [];
    if (data.useCoT) {
      if (data.model === 'claude' && useXML) {
        reasoning.push(`Antes de responder, sigue este proceso:\n\n1. PENSAMIENTO:\n   - Analiza el problema paso a paso\n   - Identifica posibles enfoques\n   - Evalúa pros y contras\n   - Selecciona el mejor enfoque con justificación\n\n2. RESPUESTA:\n   [Tu respuesta final aquí]`);
      } else if (data.model === 'gpt') {
        reasoning.push(`Piensa paso a paso:\n\n1. **Entendimiento:** ¿Qué se pide exactamente?\n2. **Análisis:** ¿Cuáles son los elementos clave?\n3. **Opciones:** ¿Qué alternativas existen?\n4. **Evaluación:** ¿Cuál es la mejor opción y por qué?\n5. **Respuesta:** Presenta tu solución final.`);
      } else {
        reasoning.push(`Resuelve paso a paso:\n- Analiza los datos disponibles\n- Identifica el enfoque óptimo\n- Presenta la respuesta con justificación`);
      }
    }
    if (data.useSelfConsistency) {
      reasoning.push(useXML
        ? `Auto-Consistencia:\nGenera 3 respuestas independientes usando diferentes enfoques de razonamiento.\nAnaliza cuál es la más coherente y precisa, y preséntala como respuesta final con justificación breve.`
        : `### AUTO-CONSISTENCIA\nGenera **3 respuestas independientes** usando diferentes enfoques.\nPresenta la más coherente como **respuesta final** con justificación breve.`);
    }
    if (data.useReAct) {
      reasoning.push(useXML
        ? `Patrón ReAct:\nPensamiento: [analiza qué hacer]\nAcción: [paso concreto]\nObservación: [evalúa resultado]\nRepite hasta la respuesta final.`
        : `### PATRÓN REACT\n**Pensamiento:** [analiza]\n**Acción:** [paso concreto]\n**Observación:** [evalúa]\nRepite hasta la **respuesta final**.`);
    }
    if (data.useToT) {
      reasoning.push(useXML
        ? `Árbol de Pensamientos:\nEnfoque A: [primera vía]\nEnfoque B: [segunda vía]\nEnfoque C: [tercera vía]\nEvalúa: viabilidad, calidad y riesgos de cada uno.\nSintetiza la mejor solución.`
        : `### ÁRBOL DE PENSAMIENTOS\n- **Enfoque A:** [primera vía]\n- **Enfoque B:** [segunda vía]\n- **Enfoque C:** [tercera vía]\nEvalúa cada uno y sintetiza la **mejor solución**.`);
    }
    if (reasoning.length > 0) parts.push(tag('razonamiento', reasoning.join('\n\n---\n\n')));

    const fi = [];
    if (data.format) {
      const fo = FORMATS.find(f => f.id === data.format);
      if (fo) {
        fi.push(useXML ? `Formato requerido: ${fo.label}` : `**Formato requerido:** ${fo.label}`);
        if (fo.needsSchema && data.outputSchema) {
          fi.push(useXML
            ? `Esquema a seguir:\n${data.outputSchema}\nRellena exactamente, sin campos adicionales.`
            : `### ESQUEMA\n\`\`\`\n${data.outputSchema}\n\`\`\`\nRellena exactamente.`);
        }
        if (data.model === 'claude' && data.format === 'json' && data.usePreFill) {
          fi.push('Tu respuesta debe comenzar directamente con { sin texto previo.');
        }
      }
    }
    if (data.length) fi.push(useXML ? `Longitud objetivo: ${data.length}` : `**Longitud:** ${data.length}`);
    if (fi.length > 0) parts.push(tag('formato_salida', fi.join('\n')));

    const techniques = [
      data.useCoT && 'Chain-of-Thought',
      data.useFewShot && 'Few-Shot',
      data.useDecomposition && 'Descomposición',
      data.useMultiAgent && 'Multi-Agente',
      data.useNegativeInstructions && 'Anti-Alucinación',
      data.useSelfConsistency && 'Self-Consistency',
      data.useReAct && 'ReAct',
      data.useToT && 'Tree-of-Thoughts',
    ].filter(Boolean);

    const header = `# Prompt → ${modelInfo?.name || 'LLM'} | ${useXML ? 'XML' : 'Markdown'}\n# Técnicas: ${techniques.join(', ') || 'Ninguna'}\n\n`;
    return header + parts.join('\n\n');
  }, [data, examples, attachments]);

  const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (roleInputRef.current && data.role) {
      try { roleInputRef.current.setSelectionRange(data.role.length, data.role.length); } catch { /* ok */ }
    }
  }, [data.role]);

  const loadTemplate = (useCase) => {
    setActiveTemplate(useCase.id);
    const toneId = TONES.find(t => t.label === useCase.tone)?.id || '';
    const formatId = FORMATS.find(f => f.label === useCase.format)?.id || '';
    const hasExamples = useCase.examples?.length > 0;
    setExamples(hasExamples ? useCase.examples.map(e => ({ input: e.input, output: e.output })) : [{ input: '', output: '' }]);
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

  const nextStep = () => { if (currentStep < STEPS.length - 1 && isStepValid(currentStep)) setCurrentStep(s => s + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
  const goToStep = (idx) => {
    if (idx <= currentStep) { setCurrentStep(idx); return; }
    let ok = true;
    for (let i = currentStep; i < idx; i++) if (!isStepValid(i)) { ok = false; break; }
    if (ok) setCurrentStep(idx);
  };

  const isStepValid = (i) => {
    if (i === 2) return data.role.trim().length >= 3;
    if (i === 4) return data.task.trim().length >= 10;
    return true;
  };

  const getStepError = (i) => {
    if (i === 2) {
      if (!data.role.trim()) return 'El rol es obligatorio para continuar';
      if (data.role.trim().length < 3) return 'El rol debe tener al menos 3 caracteres';
    }
    if (i === 4) {
      if (!data.task.trim()) return 'La tarea es obligatoria para continuar';
      if (data.task.trim().length < 10) return 'La tarea debe tener al menos 10 caracteres';
    }
    return null;
  };

  const currentStepValid = isStepValid(currentStep);
  const currentStepError = getStepError(currentStep);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(buildPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setActiveTemplate(null); setSelectedSector(null);
    setData({
      model: 'claude', role: '', experienceLevel: '', task: '', audienceLevel: '',
      context: '', inputData: '', constraints: [''], format: '', outputSchema: '',
      length: '', tone: '', useCoT: false, useFewShot: false, useDecomposition: false,
      useMultiAgent: false, useXMLTags: true, usePreFill: false, useNegativeInstructions: true,
      useSelfConsistency: false, useReAct: false, useToT: false,
    });
    setExamples([{ input: '', output: '' }]);
    setAttachments([{ name: '', description: '' }]);
    setCurrentStep(0);
  };

  const addExample    = () => { if (examples.length < 5) setExamples(e => [...e, { input: '', output: '' }]); };
  const removeExample = (i) => { if (examples.length > 1) setExamples(e => e.filter((_, x) => x !== i)); };
  const updateExample = (i, f, v) => setExamples(e => { const n = [...e]; n[i][f] = v; return n; });

  const addConstraint    = () => setData(p => ({ ...p, constraints: [...(p.constraints || ['']), ''] }));
  const removeConstraint = (i) => setData(p => { const n = (p.constraints || []).filter((_, x) => x !== i); return { ...p, constraints: n.length ? n : [''] }; });
  const updateConstraint = (i, v) => setData(p => { const n = [...(p.constraints || [])]; n[i] = v; return { ...p, constraints: n }; });

  const addAttachment    = () => { if (attachments.length < 10) setAttachments(a => [...a, { name: '', description: '' }]); };
  const removeAttachment = (i) => { if (attachments.length > 1) setAttachments(a => a.filter((_, x) => x !== i)); };
  const updateAttachment = (i, f, v) => setAttachments(a => { const n = [...a]; n[i][f] = v; return n; });

  // ── Clases reutilizables ──────────────────────────────────────────────────

  const inputCls = 'w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-300 focus:border-stone-500 focus:outline-none bg-stone-50 text-sm transition-colors';
  const btnPrimary = 'px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-medium hover:bg-stone-900 transition-colors';
  const btnGhost   = 'text-xs text-stone-400 hover:text-stone-600 transition-colors';

  // ── Renderizado de pasos ──────────────────────────────────────────────────

  const renderStepContent = () => {
    switch (currentStep) {

      case 0:
        return (
          <div className="p-6 animate-slide-up">
            <InputGroup
              label="Modelo LLM objetivo"
              helper="La estructura del prompt se adapta automáticamente: XML semántico para Claude, Markdown para el resto."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {MODELS.map(model => {
                  const sel = data.model === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleChange('model', model.id)}
                      className={cn(
                        'p-4 rounded-2xl border-2 text-left transition-all duration-150',
                        sel ? 'border-stone-700 bg-stone-100 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={cn('font-bold text-base', sel ? 'text-stone-900' : 'text-stone-700')}>{model.name}</div>
                          <div className="text-xs text-stone-400 mt-0.5">{model.vendor}</div>
                        </div>
                        {sel && <Check className="w-4 h-4 text-stone-700 flex-shrink-0" />}
                      </div>
                      <div className={cn(
                        'mt-2.5 text-xs px-2 py-0.5 rounded-md inline-block font-medium border',
                        sel ? 'bg-stone-200 text-stone-700 border-stone-300' : 'bg-stone-50 text-stone-400 border-stone-200',
                      )}>
                        {model.prefers}
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
                  {!selectedSector ? 'Sector profesional' : 'Casos de uso'}
                </h3>
                <p className="text-sm text-stone-500">
                  {!selectedSector
                    ? 'Selecciona el sector que mejor describe tu trabajo (opcional).'
                    : 'Elige un caso para precargar datos, o salta para crear desde cero.'}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {selectedSector && !activeTemplate && (
                  <button onClick={() => setSelectedSector(null)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium transition-colors flex items-center gap-1.5">
                    <ChevronLeft className="w-3.5 h-3.5" /> Sectores
                  </button>
                )}
                {activeTemplate && (
                  <button onClick={() => { setActiveTemplate(null); setSelectedSector(null); }}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium transition-colors flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Limpiar
                  </button>
                )}
              </div>
            </div>

            {!selectedSector ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SECTORS.map(sector => (
                  <button key={sector.id} onClick={() => setSelectedSector(sector.id)}
                    className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 text-left group">
                    <h4 className="font-semibold text-stone-800 mb-1 text-sm group-hover:text-stone-900 transition-colors">
                      {sector.name}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{sector.description}</p>
                    <div className="mt-2 text-xs text-stone-400 font-medium flex items-center gap-1">
                      {sector.useCases.length} casos de uso <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {SECTORS.find(s => s.id === selectedSector)?.useCases.map(uc => (
                  <button key={uc.id} onClick={() => loadTemplate(uc)}
                    className={cn(
                      'w-full p-4 rounded-2xl border text-left transition-all duration-150',
                      activeTemplate === uc.id
                        ? 'bg-stone-100 border-stone-600 ring-1 ring-stone-300'
                        : 'bg-white border-stone-200 hover:border-stone-400',
                    )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-900 mb-1 text-sm">{uc.title}</h4>
                        <p className="text-xs text-stone-500 mb-1"><span className="font-medium">Rol:</span> {uc.role}</p>
                        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">{uc.task}</p>
                      </div>
                      {activeTemplate === uc.id && (
                        <div className="w-5 h-5 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
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
              label={<>Rol / Profesión <span className="text-stone-400 font-normal">(obligatorio)</span></>}
              helper="Define la identidad experta de la IA. Mínimo 3 caracteres."
            >
              <div className="relative">
                <textarea
                  list="roles-list"
                  className={cn(
                    'w-full p-3 border rounded-xl focus:ring-2 focus:outline-none bg-stone-50 resize-none min-h-[64px] text-sm transition-all',
                    data.role.trim().length > 0 && data.role.trim().length < 3
                      ? 'border-amber-500 bg-amber-50/60 focus:ring-amber-200 focus:border-amber-500'
                      : data.role.trim().length >= 3
                      ? 'border-stone-500 focus:ring-stone-200 focus:border-stone-600'
                      : 'border-stone-200 focus:ring-stone-200 focus:border-stone-500',
                  )}
                  placeholder="Ej. Arquitecto de Software, Consultor Legal, Científico de Datos..."
                  rows={2}
                  ref={roleInputRef}
                  value={data.role}
                  onChange={e => handleChange('role', e.target.value)}
                />
                {data.role.trim().length >= 3 && (
                  <div className="absolute right-3 top-3">
                    <Check className="w-4 h-4 text-stone-500" />
                  </div>
                )}
                <datalist id="roles-list">{ROLES.map(r => <option key={r} value={r} />)}</datalist>
              </div>
            </InputGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup label="Nivel de experiencia" helper="Calibra la autoridad y profundidad.">
                <select className={inputCls} value={data.experienceLevel} onChange={e => handleChange('experienceLevel', e.target.value)}>
                  <option value="">Sin especificar</option>
                  {EXPERIENCE_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </InputGroup>
              <InputGroup label="Tono de comunicación" helper="Ajusta el estilo de respuesta.">
                <select className={inputCls} value={data.tone} onChange={e => handleChange('tone', e.target.value)}>
                  <option value="">Neutro</option>
                  {TONES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </InputGroup>
            </div>

            {data.tone && (
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-sm text-stone-600 animate-fade-in">
                {TONES.find(t => t.id === data.tone)?.desc}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="p-6 space-y-5 animate-slide-up">
            <InputGroup label="Contexto previo" helper="Información de fondo y situación actual.">
              <textarea className={cn(inputCls, 'min-h-[96px] resize-none')}
                placeholder="Ej. Estamos en un entorno legacy con SQL Server 2012..."
                value={data.context} onChange={e => handleChange('context', e.target.value)} />
            </InputGroup>

            <InputGroup label="Nivel de audiencia" helper="¿Para quién es la respuesta?">
              <select className={inputCls} value={data.audienceLevel} onChange={e => handleChange('audienceLevel', e.target.value)}>
                <option value="">No especificado</option>
                {AUDIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </InputGroup>

            <InputGroup label="Datos de entrada" helper="Pega texto, código o documentos que la IA debe usar como referencia.">
              <textarea
                className="w-full p-3 border border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-500 focus:outline-none min-h-[120px] font-mono text-xs bg-stone-900 text-stone-200 placeholder:text-stone-600 resize-none"
                placeholder="Pega aquí logs, código fuente, documentos, transcripciones..."
                value={data.inputData} onChange={e => handleChange('inputData', e.target.value)} />
            </InputGroup>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-stone-700">Archivos adjuntos (descripción)</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Referencia archivos por nombre y descripción (no se suben).</p>
                </div>
                <button onClick={addAttachment} disabled={attachments.length >= 10}
                  className={cn(btnPrimary, attachments.length >= 10 && 'opacity-40 cursor-not-allowed')}>
                  Añadir
                </button>
              </div>
              <div className="space-y-2">
                {attachments.map((att, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-stone-500">Archivo {i + 1}</span>
                      {attachments.length > 1 && (
                        <button onClick={() => removeAttachment(i)} className={btnGhost}>Eliminar</button>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <input className={cn(inputCls, 'p-2')} placeholder="Nombre del archivo *"
                        value={att.name} onChange={e => updateAttachment(i, 'name', e.target.value)} />
                      <textarea className={cn(inputCls, 'p-2 min-h-[52px] resize-none')} placeholder="Descripción *"
                        value={att.description} onChange={e => updateAttachment(i, 'description', e.target.value)} />
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
              label={<>Tarea principal <span className="text-stone-400 font-normal">(obligatorio)</span></>}
              helper="Verbos de acción: Genera, Clasifica, Resume, Extrae, Analiza... Mínimo 10 caracteres."
            >
              <div className="relative">
                <textarea
                  className={cn(
                    'w-full p-3 border rounded-xl focus:ring-2 focus:outline-none min-h-[100px] bg-stone-50 text-sm resize-none transition-all',
                    data.task.trim().length > 0 && data.task.trim().length < 10
                      ? 'border-amber-500 bg-amber-50/60 focus:ring-amber-200 focus:border-amber-500'
                      : data.task.trim().length >= 10
                      ? 'border-stone-500 focus:ring-stone-200 focus:border-stone-600'
                      : 'border-stone-200 focus:ring-stone-200 focus:border-stone-500',
                  )}
                  placeholder="Ej. Genera un endpoint REST en Python que valide tokens JWT..."
                  value={data.task} onChange={e => handleChange('task', e.target.value)} />
                {data.task.trim().length >= 10 && (
                  <div className="absolute right-3 top-3"><Check className="w-4 h-4 text-stone-500" /></div>
                )}
              </div>
            </InputGroup>

            <InputGroup label="Restricciones y límites" helper="Define lo que NO debe hacer o los límites del trabajo.">
              <div className="space-y-2">
                {(data.constraints || ['']).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input className={cn(inputCls, 'flex-1 p-2.5')}
                      placeholder="Ej. No uses librerías obsoletas"
                      value={item} onChange={e => updateConstraint(i, e.target.value)} />
                    {(data.constraints?.length || 0) > 1 && (
                      <button onClick={() => removeConstraint(i)} className={btnGhost}>✕</button>
                    )}
                  </div>
                ))}
                <button onClick={addConstraint} className={btnPrimary}>+ Añadir restricción</button>
              </div>
            </InputGroup>
          </div>
        );

      case 5:
        return (
          <div className="p-6 space-y-5 animate-slide-up">
            <InputGroup label="Formato de salida" helper="Define cómo debe estructurarse la respuesta.">
              <select className={inputCls} value={data.format} onChange={e => handleChange('format', e.target.value)}>
                <option value="">Sin formato específico</option>
                {FORMATS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </InputGroup>

            {data.format && FORMATS.find(f => f.id === data.format)?.needsSchema && (
              <InputGroup label="Esquema" helper="Proporciona un esquema vacío que el modelo debe rellenar exactamente.">
                <textarea
                  className="w-full p-3 border border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-500 focus:outline-none min-h-[100px] font-mono text-xs bg-stone-900 text-stone-200 placeholder:text-stone-600 resize-none"
                  placeholder={data.format === 'json' ? '{\n  "nombre": "",\n  "edad": 0\n}' : '<resultado>\n  <item id="" />\n</resultado>'}
                  value={data.outputSchema} onChange={e => handleChange('outputSchema', e.target.value)} />
              </InputGroup>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup label="Longitud objetivo">
                <input className={inputCls} placeholder="Ej. Máximo 200 palabras, 3 párrafos"
                  value={data.length} onChange={e => handleChange('length', e.target.value)} />
              </InputGroup>
              {data.model === 'claude' && data.format === 'json' && (
                <InputGroup label="Pre-llenado (Claude)">
                  <Toggle label="Forzar inicio con '{'" checked={data.usePreFill} onChange={v => handleChange('usePreFill', v)} />
                </InputGroup>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="p-6 space-y-5 animate-slide-up">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Técnicas base</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Toggle label="Cadena de Pensamiento" icon={Zap}          description="Razonamiento paso a paso"          checked={data.useCoT}                onChange={v => handleChange('useCoT', v)} />
                <Toggle label="Descomposición"         icon={Target}       description="Divide en fases y resuelve"        checked={data.useDecomposition}      onChange={v => handleChange('useDecomposition', v)} />
                <Toggle label="Multi-Agente / Debate"  icon={MessageSquare} description="Debate interno de perspectivas"  checked={data.useMultiAgent}          onChange={v => handleChange('useMultiAgent', v)} />
                <Toggle label="Few-Shot (ejemplos)"    icon={Copy}         description="1–5 ejemplos de referencia"        checked={data.useFewShot}            onChange={v => handleChange('useFewShot', v)} />
                <Toggle label="Etiquetas XML/Markdown" icon={Layout}       description="Estructura semántica del prompt"   checked={data.useXMLTags}            onChange={v => handleChange('useXMLTags', v)} />
                <Toggle label="Anti-Alucinación"       icon={Shield}       description="Guardrails para hechos precisos"   checked={data.useNegativeInstructions} onChange={v => handleChange('useNegativeInstructions', v)} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Técnicas avanzadas 2025</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Toggle label="Self-Consistency" icon={Repeat2}    description="Múltiples razonamientos → consenso" checked={data.useSelfConsistency} onChange={v => handleChange('useSelfConsistency', v)} />
                <Toggle label="ReAct"             icon={GitBranch} description="Pensar → Actuar → Observar"         checked={data.useReAct}           onChange={v => handleChange('useReAct', v)} />
                <Toggle label="Tree of Thoughts"  icon={TreePine}  description="Explorar múltiples ramas"          checked={data.useToT}             onChange={v => handleChange('useToT', v)} />
              </div>
            </div>

            {data.useSelfConsistency && data.useToT && (
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-500 animate-fade-in">
                Self-Consistency + Tree of Thoughts generan prompts extensos. Úsalos juntos solo si el modelo tiene ventana de contexto amplia.
              </div>
            )}

            {data.useFewShot && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-stone-700">Ejemplos few-shot</h4>
                  <button onClick={addExample} disabled={examples.length >= 5}
                    className={cn(btnPrimary, examples.length >= 5 && 'opacity-40 cursor-not-allowed')}>
                    Añadir ({examples.length}/5)
                  </button>
                </div>
                <div className="space-y-2">
                  {examples.map((ex, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-stone-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-stone-500">Ejemplo {i + 1}</span>
                        {examples.length > 1 && <button onClick={() => removeExample(i)} className={btnGhost}>Eliminar</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input className={cn(inputCls, 'p-2')} placeholder="Entrada..."
                          value={ex.input} onChange={e => updateExample(i, 'input', e.target.value)} />
                        <input className={cn(inputCls, 'p-2')} placeholder="Salida ideal..."
                          value={ex.output} onChange={e => updateExample(i, 'output', e.target.value)} />
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
          <div className="p-6 space-y-4 animate-slide-up">
            <div className="space-y-3">
              {SAFETY_TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <Shield className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-stone-700 text-sm">{tip.title}</h5>
                    <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2 mb-1.5">
                <Check className="w-4 h-4 text-stone-600" />
                <h4 className="font-semibold text-stone-800 text-sm">Prompt listo</h4>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                Generado siguiendo las mejores prácticas de ingeniería de prompts 2025–2026.
                Copia el resultado del panel derecho y pégalo en tu LLM favorito.
              </p>
            </div>
          </div>
        );

      default: return null;
    }
  };

  const charCount = buildPrompt?.length ?? 0;

  // ── Layout principal ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col md:flex-row">

      {/* PANEL IZQUIERDO */}
      <div className="w-full md:w-1/2 lg:w-3/5 border-r border-stone-200 bg-white flex flex-col h-screen">

        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-stone-800 tracking-tight">PromptArchitect</span>
            </div>
            <button onClick={reset} title="Empezar de nuevo"
              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-600 transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive    = currentStep === idx;
              const isCompleted = currentStep > idx;
              return (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center">
                    <button onClick={() => goToStep(idx)} title={step.title}
                      className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200',
                        isActive    ? 'bg-stone-800 border-stone-800 text-white shadow-sm ring-4 ring-stone-200'
                        : isCompleted ? 'bg-stone-500 border-stone-500 text-white'
                        : 'bg-white border-stone-300 text-stone-400 hover:border-stone-500 hover:text-stone-600',
                      )}>
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                    <span className={cn(
                      'text-[9px] font-medium mt-0.5 hidden sm:block truncate max-w-[48px] text-center leading-tight',
                      isActive ? 'text-stone-800' : isCompleted ? 'text-stone-500' : 'text-stone-400',
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={cn(
                      'flex-1 h-0.5 mx-1 rounded-full transition-colors duration-300',
                      isCompleted ? 'bg-stone-400' : 'bg-stone-200',
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
            {(() => { const I = STEPS[currentStep].icon; return <I className="w-4 h-4 text-stone-500" />; })()}
            <div>
              <h2 className="font-bold text-sm text-stone-800">{STEPS[currentStep].title}</h2>
              <p className="text-xs text-stone-400">{STEPS[currentStep].description}</p>
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
            <div className="mb-3 p-2.5 bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-2 text-stone-600 text-xs animate-fade-in">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{currentStepError}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button onClick={prevStep} disabled={currentStep === 0}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all',
                currentStep === 0 ? 'bg-stone-100 text-stone-300 cursor-not-allowed' : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
              )}>
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <span className="text-xs text-stone-400">{currentStep + 1} / {STEPS.length}</span>

            <button onClick={nextStep} disabled={currentStep === STEPS.length - 1 || !currentStepValid}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all',
                currentStep === STEPS.length - 1 || !currentStepValid
                  ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  : 'bg-stone-800 text-white hover:bg-stone-900 active:scale-95',
              )}>
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO — PREVIEW */}
      <div className="w-full md:w-1/2 lg:w-2/5 bg-stone-900 text-stone-300 flex flex-col h-screen sticky top-0">
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-stone-100 text-sm flex items-center gap-2">
              Prompt generado
              {activeTemplate && (
                <span className="px-2 py-0.5 rounded-md bg-stone-700 text-stone-400 text-xs font-medium">
                  Plantilla activa
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              {charCount > 0 ? `${charCount.toLocaleString()} caracteres` : 'Completa los pasos para generar el prompt'}
            </p>
          </div>
          <button onClick={copyToClipboard}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all',
              copied ? 'bg-stone-600 text-stone-100' : 'bg-stone-700 hover:bg-stone-600 text-stone-100',
            )}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap custom-scrollbar text-stone-400">
          {charCount > 0
            ? buildPrompt
            : <span className="text-stone-600 italic">El prompt aparecerá aquí...</span>
          }
        </div>

        {charCount > 0 && (
          <div className="px-5 py-3 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-600">~{Math.ceil(charCount / 4).toLocaleString()} tokens estimados</span>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-md font-medium',
              charCount > 8000 ? 'bg-stone-700 text-stone-400' : 'bg-stone-800 text-stone-500',
            )}>
              {charCount > 8000 ? 'Prompt extenso' : 'Tamaño adecuado'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
