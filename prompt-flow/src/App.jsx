import React, { useState, useEffect } from 'react';
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
  "Experto en Marketing Digital", "Ingeniero de Software Senior", "Redactor Creativo (Copywriter)",
  "Analista de Datos", "Consultor Legal", "Profesor / Tutor Académico", 
  "Product Manager", "Reclutador IT", "Diseñador UX/UI", "Traductor Profesional",
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
  "Niño de 5 años (ELI5)", "Principiante sin conocimientos previos", 
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
  // Definir los pasos del flujo
  const STEPS = [
    { id: 0, title: 'Modelo LLM', icon: Zap, description: 'Elige el modelo objetivo' },
    { id: 1, title: 'Plantilla', icon: BookOpen, description: 'Selecciona una plantilla (opcional)' },
    { id: 2, title: 'Anclaje de Persona', icon: User, description: 'Rol, experiencia y tono' },
    { id: 3, title: 'Contexto y Datos', icon: FileText, description: 'Priming y datos de entrada' },
    { id: 4, title: 'Instrucción y Tarea', icon: Target, description: 'Qué debe hacer la IA' },
    { id: 5, title: 'Formato de Salida', icon: Layout, description: 'Estructura de respuesta' },
    { id: 6, title: 'Refinamiento Avanzado', icon: BrainCircuit, description: 'CoT, Few-Shot, Guardrails' },
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
    constraints: '',
    format: '',
    outputSchema: '', // Nuevo: para JSON/XML schemas
    length: '',
    tone: '',
    // Advanced Toggles
    useCoT: false, // Chain of Thought
    useFewShot: false, // Ejemplos
    useDecomposition: false, // Paso a paso
    useMultiAgent: false, // Debate
    useXMLTags: true, // Nuevo: usar etiquetas XML/Markdown
    usePreFill: false, // Nuevo: para Claude
    useNegativeInstructions: true // Nuevo: "No hagas X"
  });

  const [examples, setExamples] = useState([{ input: '', output: '' }]); // Ahora es array
  const [copied, setCopied] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null); // Nuevo: sector seleccionado
  const [currentStep, setCurrentStep] = useState(0);

  // Efecto para construir el prompt en tiempo real
  useEffect(() => {
    buildPrompt();
  }, [data, examples]);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const loadTemplate = (useCase) => {
    setActiveTemplate(useCase.id);
    
    // Mapear tone string a ID
    const toneId = TONES.find(t => t.label === useCase.tone)?.id || '';
    
    // Mapear format string a ID
    const formatId = FORMATS.find(f => f.label === useCase.format)?.id || '';
    
    setData(prev => ({
      ...prev,
      role: useCase.role || '',
      experienceLevel: 'senior', // Por defecto senior para templates
      task: useCase.task || '',
      audienceLevel: '', 
      context: useCase.context || '',
      inputData: '', 
      constraints: useCase.constraints || '',
      format: formatId,
      outputSchema: '',
      length: '', 
      tone: toneId,
      useCoT: useCase.id.includes('debug') || useCase.id.includes('biz') || useCase.id.includes('ehr') || useCase.id.includes('legal'),
      useFewShot: false,
      useDecomposition: useCase.id.includes('plan') || useCase.id.includes('strategy') || useCase.id.includes('portfolio'),
      useMultiAgent: false,
      useNegativeInstructions: true
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < STEPS.length) {
      setCurrentStep(stepIndex);
    }
  };

  const buildPrompt = () => {
    const useXML = data.useXMLTags && (data.model === 'claude' || data.model === 'gemini');
    const parts = [];
    
    // Helper para tags
    const tag = (name, content, inline = false) => {
      if (!data.useXMLTags) return content;
      if (useXML) {
        return inline ? `<${name}>${content}</${name}>` : `<${name}>\n${content}\n</${name}>`;
      }
      return `## ${name.toUpperCase()}\n${content}`;
    };

    // === 1. ANCLAJE DE PERSONA Y ROL ===
    if (data.role) {
      let personaText = `Actúas como un ${data.role}`;
      if (data.experienceLevel) {
        const expLabel = EXPERIENCE_LEVELS.find(e => e.id === data.experienceLevel)?.label;
        personaText += ` de nivel ${expLabel}`;
      }
      personaText += '.';
      
      // Añadir calibración de tono
      if (data.tone) {
        const toneObj = TONES.find(t => t.id === data.tone);
        if (toneObj) {
          personaText += ` Tu estilo de comunicación debe ser: ${toneObj.label} (${toneObj.desc}).`;
        }
      }
      
      // Multi-agente
      if (data.useMultiAgent) {
        personaText += `\n\nMODO MULTI-AGENTE: Simula un debate interno entre dos perspectivas:\n- Agente A (${data.role}): Propone la solución.\n- Agente B (Crítico Escéptico): Cuestiona y busca huecos.\nLuego sintetiza la mejor respuesta.`;
      }
      
      parts.push(tag('persona', personaText));
    }

    // === 2. CONTEXTO Y PRIMING ===
    if (data.context || data.audienceLevel) {
      let contextText = '';
      if (data.context) contextText += data.context;
      if (data.audienceLevel) {
        if (contextText) contextText += '\n\n';
        contextText += `AUDIENCIA: La respuesta debe ser comprensible para alguien con nivel "${data.audienceLevel}".`;
      }
      parts.push(tag('contexto', contextText));
    }

    // === 3. DATOS DE ENTRADA (RAG simplificado) ===
    if (data.inputData) {
      parts.push(tag('datos_entrada', data.inputData.trim()));
    }

    // === 4. FEW-SHOT PROMPTING (1-5 ejemplos) ===
    if (data.useFewShot && examples.some(ex => ex.input || ex.output)) {
      const validExamples = examples.filter(ex => ex.input && ex.output);
      if (validExamples.length > 0) {
        let examplesText = validExamples.map((ex, idx) => 
          `Ejemplo ${idx + 1}:\nEntrada: ${ex.input}\nSalida Esperada: ${ex.output}`
        ).join('\n\n');
        parts.push(tag('ejemplos', examplesText));
      }
    }

    // === 5. INSTRUCCIÓN PRINCIPAL (TASK) ===
    if (data.task) {
      let taskText = data.task;
      
      // Descomposición automática si está activada
      if (data.useDecomposition) {
        taskText += '\n\nESTRATEGIA: Divide esta tarea en sub-pasos lógicos y resuélvelos secuencialmente.';
      }
      
      parts.push(tag('tarea', taskText));
    }

    // === 6. RESTRICCIONES Y GUARDRAILS ===
    const constraintsList = [];
    
    // Restricciones del usuario
    if (data.constraints) {
      constraintsList.push(...data.constraints.split('\n').filter(c => c.trim()));
    }
    
    // Guardrails automáticos (Negativas)
    if (data.useNegativeInstructions) {
      constraintsList.push('Si no tienes suficiente información para responder con certeza, indica "No tengo suficiente información para esto" en lugar de inventar datos.');
      constraintsList.push('No inventes hechos, fechas o estadísticas. Basa tu respuesta únicamente en los datos proporcionados o en conocimiento general verificable.');
    }
    
    if (constraintsList.length > 0) {
      const constraintsText = constraintsList.map(c => `• ${c}`).join('\n');
      parts.push(tag('restricciones', constraintsText));
    }

    // === 7. CHAIN-OF-THOUGHT (CoT) ===
    if (data.useCoT) {
      if (useXML && data.model === 'claude') {
        // Claude con thinking tags
        parts.push(tag('instruccion_razonamiento', 
          'Antes de dar tu respuesta final, usa etiquetas <thinking> para mostrar tu proceso de razonamiento paso a paso. Luego, coloca tu respuesta final dentro de etiquetas <answer>.'
        ));
      } else {
        // Zero-Shot CoT genérico
        parts.push(tag('instruccion_razonamiento', 
          'Pensemos paso a paso para asegurar la precisión. Muestra tu razonamiento antes de la respuesta final.'
        ));
      }
    }

    // === 8. FORMATO DE SALIDA (OUTPUT SHAPING) ===
    const formatInstructions = [];
    
    if (data.format) {
      const formatObj = FORMATS.find(f => f.id === data.format);
      if (formatObj) {
        formatInstructions.push(`Formato de salida: ${formatObj.label}`);
        
        // Schema si es necesario
        if (formatObj.needsSchema && data.outputSchema) {
          formatInstructions.push(`\nEsquema a seguir:\n${data.outputSchema}`);
        }
        
        // Pre-fill hint para Claude con JSON
        if (data.model === 'claude' && data.format === 'json' && data.usePreFill) {
          formatInstructions.push('\n[NOTA: La respuesta debe empezar directamente con el carácter {]');
        }
      }
    }
    
    if (data.length) {
      formatInstructions.push(`Longitud: ${data.length}`);
    }
    
    if (formatInstructions.length > 0) {
      parts.push(tag('formato_salida', formatInstructions.join('\n')));
    }

    // === ENSAMBLAJE FINAL ===
    let finalText = parts.join('\n\n');
    
    // Añadir comentario sobre el modelo objetivo
    const modelInfo = MODELS.find(m => m.id === data.model);
    const header = `# Prompt optimizado para: ${modelInfo?.name || 'LLM genérico'}\n# Estructura: ${useXML ? 'XML' : 'Markdown'}\n\n`;
    
    setFinalPrompt(header + finalText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalPrompt);
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
      constraints: '',
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
    setCurrentStep(0);
  };
  
  // Helper para añadir/quitar ejemplos
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
            <InputGroup label="A. Rol / Profesión" helper="Define la identidad experta de la IA.">
              <div className="relative">
                <input 
                  list="roles" 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50"
                  placeholder="Ej. Arquitecto de Software, Consultor Legal..."
                  value={data.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                />
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
            <InputGroup label="A. Contextual Priming" helper="Prepara el escenario. Información de fondo y situación actual.">
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

            <InputGroup label="C. Datos de Entrada (RAG Simplificado)" helper="Pega texto, código o documentos que la IA debe usar como knowledge base.">
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[120px] font-mono text-sm bg-slate-900 text-slate-100 placeholder:text-slate-500"
                placeholder="Pega aquí logs, código fuente, documentos, transcripciones..."
                value={data.inputData}
                onChange={(e) => handleChange('inputData', e.target.value)}
              />
            </InputGroup>
          </div>
        );

      case 4: // Instrucción y Tarea
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-top-2">
            <InputGroup label="A. Tarea Principal (Imperativa)" helper="Usa verbos de acción fuertes: Genera, Clasifica, Resume, Extrae, Analiza...">
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px] bg-slate-50"
                placeholder="Ej. Genera un endpoint REST en Python que valide tokens JWT y retorne el perfil del usuario..."
                value={data.task}
                onChange={(e) => handleChange('task', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="B. Restricciones y Guardrails" helper="Define límites, negativas y lo que NO debe hacer.">
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[80px] bg-slate-50"
                placeholder="Ej. No uses librerías deprecated&#10;No excedas 100 líneas&#10;No inventes datos&#10;Si hay ambigüedad, pide clarificación"
                value={data.constraints}
                onChange={(e) => handleChange('constraints', e.target.value)}
              />
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
                <InputGroup label="D. Pre-fill (Claude)">
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
                label="Chain-of-Thought (CoT)" 
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
                label="Few-Shot (1-5 ejemplos)" 
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
                label="Guardrails Anti-Alucinación" 
                icon={Shield}
                checked={data.useNegativeInstructions} 
                onChange={(v) => handleChange('useNegativeInstructions', v)} 
              />
            </div>

            {data.useCoT && data.model === 'claude' && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900 animate-in fade-in">
                <strong>Claude CoT:</strong> Se usarán etiquetas &lt;thinking&gt; y &lt;answer&gt; para separar razonamiento de respuesta final.
              </div>
            )}

            {data.useFewShot && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-slate-700">Ejemplos de Entrenamiento (Few-Shot)</h4>
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
        <div className="p-6 border-t border-slate-200 bg-white flex items-center justify-between">
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
            disabled={currentStep === STEPS.length - 1}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all",
              currentStep === STEPS.length - 1
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            )}
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
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
          {finalPrompt ? (
            finalPrompt
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
          <span>Optimizado para GPT-4, Claude 3, Llama 3</span>
          <span>{finalPrompt.length} caracteres</span>
        </div>
      </div>

    </div>
  );
}
