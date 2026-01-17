export const SECTORS = [
  {
    id: 'tech',
    name: 'Tecnología y Desarrollo de Software',
    icon: '💻',
    description: 'Modernización, código, depuración y arquitectura de sistemas.',
    useCases: [
      {
        id: 'tech-legacy',
        title: 'Modernización de Código Legacy',
        role: 'Ingeniero de Software Senior especializado en Migración',
        task: 'Actualizar código legacy a versiones modernas, analizando dependencias y ejecutando pruebas.',
        context: 'Aplicación antigua que necesita migración a tecnologías actuales sin romper funcionalidad existente.',
        format: 'Código actualizado con comentarios sobre cambios críticos',
        constraints: 'Mantener retrocompatibilidad donde sea posible\nDocumentar breaking changes\nEjecutar pruebas unitarias',
        tone: 'Técnico y preciso'
      },
      {
        id: 'tech-debug',
        title: 'Generación y Depuración de Código',
        role: 'Ingeniero de Software Senior',
        task: 'Generar funciones específicas o encontrar la causa raíz de errores analizando logs.',
        context: 'Necesidad de código eficiente o debugging de errores en producción.',
        format: 'Código con comentarios explicativos',
        constraints: 'Incluir manejo de errores\nSeguir guías de estilo (PEP8, ESLint)\nPriorizar eficiencia',
        tone: 'Técnico y preciso'
      },
      {
        id: 'tech-prototype',
        title: 'Aplicaciones "Zero-to-One"',
        role: 'Arquitecto de Software Full-Stack',
        task: 'Generar prototipos completos de aplicaciones web (Frontend + Backend) desde cero.',
        context: 'MVP rápido para validar idea de negocio con funcionalidad completa.',
        format: 'Código estructurado por carpetas (src/, api/, components/)',
        constraints: 'Usar stack moderno\nIncluir autenticación básica\nDocumentar setup',
        tone: 'Técnico y preciso'
      },
      {
        id: 'tech-data-clean',
        title: 'Limpieza y Análisis de Datos',
        role: 'Ingeniero de Datos',
        task: 'Procesar hojas de cálculo, rellenar valores faltantes y estandarizar formatos.',
        context: 'Datos desordenados que necesitan preparación para análisis o ML.',
        format: 'Script de limpieza + Dataset resultante',
        constraints: 'Documentar transformaciones aplicadas\nPreservar datos originales\nValidar integridad',
        tone: 'Técnico y preciso'
      },
      {
        id: 'tech-vendor',
        title: 'Evaluación de Proveedores Tecnológicos',
        role: 'Arquitecto de Soluciones / CTO',
        task: 'Investigar y comparar proveedores de tecnología detallando productos y características.',
        context: 'Decisión de compra de herramientas o plataformas para la organización.',
        format: 'Tabla comparativa + Recomendación justificada',
        constraints: 'Incluir costos, seguridad y escalabilidad\nConsiderar integración con stack actual',
        tone: 'Profesional y Corporativo'
      }
    ]
  },
  {
    id: 'health',
    name: 'Salud y Medicina',
    icon: '🏥',
    description: 'Análisis clínico, triaje y planes de tratamiento.',
    useCases: [
      {
        id: 'health-ehr',
        title: 'Análisis de Registros Médicos (EHR)',
        role: 'Médico Especialista con acceso a EHR',
        task: 'Analizar historiales clínicos complejos y generar notas SOAP (Subjetivo, Objetivo, Evaluación, Plan).',
        context: 'Paciente con historial extenso que requiere revisión rápida antes de consulta.',
        format: 'Nota SOAP estructurada',
        constraints: 'Basar análisis únicamente en datos proporcionados\nNo diagnosticar sin información suficiente\nCitar fuentes médicas si hace referencias',
        tone: 'Académico y Formal'
      },
      {
        id: 'health-triage',
        title: 'Triaje de Pacientes',
        role: 'Asistente Médico Virtual',
        task: 'Clasificar solicitudes de pacientes por gravedad (Rojo: 2h, Naranja: 24h, etc.) para programar citas.',
        context: 'Sistema de atención que necesita priorizar casos urgentes.',
        format: 'Clasificación + Recomendación de acción',
        constraints: 'Escalar inmediatamente casos de emergencia\nNo reemplazar juicio médico profesional',
        tone: 'Directo y Conciso'
      },
      {
        id: 'health-treatment',
        title: 'Planes de Tratamiento Personalizados',
        role: 'Coordinador de Atención Médica',
        task: 'Crear planes explicativos para pacientes sobre tratamientos, adaptando jerga médica.',
        context: 'Paciente necesita entender su plan de tratamiento en lenguaje sencillo.',
        format: 'Plan paso a paso en lenguaje comprensible',
        constraints: 'Usar analogías simples\nEvitar tecnicismos innecesarios\nIncluir advertencias relevantes',
        tone: 'Amigable y Cercano'
      }
    ]
  },
  {
    id: 'legal',
    name: 'Legal y Cumplimiento',
    icon: '⚖️',
    description: 'Contratos, NDAs, cumplimiento normativo e investigación legal.',
    useCases: [
      {
        id: 'legal-contracts',
        title: 'Revisión de Contratos y NDAs',
        role: 'Abogado Corporativo Especialista en Contratos',
        task: 'Analizar NDAs o contratos comparándolos contra plantilla estándar, resaltando desviaciones y riesgos.',
        context: 'Revisión rápida de acuerdos antes de firma.',
        format: 'Lista de hallazgos con nivel de riesgo (Alto/Medio/Bajo) + Resumen ejecutivo',
        constraints: 'Identificar cláusulas faltantes críticas\nSeñalar ambigüedades\nNo dar asesoramiento legal definitivo',
        tone: 'Profesional y Corporativo'
      },
      {
        id: 'legal-research',
        title: 'Investigación Legal y Citación',
        role: 'Asistente de Investigación Legal',
        task: 'Buscar estatutos y jurisprudencia relevante, asegurando citas precisas y verificadas.',
        context: 'Preparación de caso o memo legal que requiere fundamentación jurídica.',
        format: 'Lista de casos relevantes con citas exactas',
        constraints: 'Solo citar fuentes verificables\nIndicar jurisdicción\nNo inventar casos',
        tone: 'Académico y Formal'
      },
      {
        id: 'legal-compliance',
        title: 'Verificación de Políticas de Privacidad',
        role: 'Oficial de Cumplimiento Normativo',
        task: 'Revisar políticas de privacidad o DPAs contra regulaciones (GDPR, CCPA) y planificar correcciones.',
        context: 'Auditoría de cumplimiento antes de lanzamiento o inspección regulatoria.',
        format: 'Lista de verificación con gaps identificados + Plan de acción',
        constraints: 'Referenciar artículos específicos de regulaciones\nPriorizar por severidad de incumplimiento',
        tone: 'Profesional y Corporativo'
      }
    ]
  },
  {
    id: 'business',
    name: 'Negocios, Ventas y Finanzas',
    icon: '💼',
    description: 'Análisis financiero, estrategia, ventas y gestión de RFPs.',
    useCases: [
      {
        id: 'biz-portfolio',
        title: 'Revisión de Portafolios de Clientes',
        role: 'Asesor Financiero Certificado',
        task: 'Generar cartas de revisión de portafolio con resúmenes de rendimiento y perspectivas de mercado.',
        context: 'Comunicación trimestral con clientes sobre el estado de sus inversiones.',
        format: 'Carta personalizada con secciones: Rendimiento, Perspectivas, Recomendaciones',
        constraints: 'No prometer retornos específicos\nIncluir disclaimers de riesgo\nBasarse solo en datos proporcionados',
        tone: 'Profesional y Corporativo'
      },
      {
        id: 'biz-fraud',
        title: 'Detección de Fraude en Transacciones',
        role: 'Analista de Seguridad Financiera',
        task: 'Analizar transacciones para identificar patrones sospechosos y marcar posibles fraudes.',
        context: 'Revisión de actividad reciente en plataforma de pagos.',
        format: 'Reporte de riesgo con transacciones marcadas y nivel de sospecha',
        constraints: 'Explicar razones de cada marcación\nMinimizar falsos positivos\nEscalar casos críticos',
        tone: 'Directo y Conciso'
      },
      {
        id: 'biz-rfp',
        title: 'Gestión de RFPs (Solicitudes de Propuesta)',
        role: 'Gerente de Desarrollo de Negocios',
        task: 'Investigar empresa solicitante y resumir RFP identificando presupuesto, necesidades y plazos.',
        context: 'Recepción de RFP que requiere análisis rápido antes de decisión de participar.',
        format: 'Resumen ejecutivo: Empresa, Necesidades Clave, Presupuesto, Fechas Críticas',
        constraints: 'Identificar dealbreakers\nEvaluar fit con capacidades propias',
        tone: 'Profesional y Corporativo'
      },
      {
        id: 'biz-objections',
        title: 'Entrenamiento en Manejo de Objeciones',
        role: 'Coach de Ventas Consultivas',
        task: 'Generar escenarios de práctica y listas de objeciones comunes con respuestas sugeridas.',
        context: 'Entrenamiento de equipo de ventas para nuevo producto o mercado.',
        format: 'Lista de objeciones + Scripts de respuesta + Ejercicios de role-play',
        constraints: 'Adaptar a industria específica\nIncluir objeciones de precio, timing y competencia',
        tone: 'Persuasivo y de Ventas'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing y Contenidos',
    icon: '📢',
    description: 'Campañas, copywriting, análisis competitivo y repurposing.',
    useCases: [
      {
        id: 'mkt-competitive',
        title: 'Análisis Competitivo y Estrategia',
        role: 'Gerente de Marketing Estratégico',
        task: 'Investigar competidores, analizar precios, fortalezas/debilidades y redactar estrategia competitiva.',
        context: 'Planeación estratégica anual o lanzamiento de nuevo producto.',
        format: 'Informe con secciones: Panorama Competitivo, Análisis FODA, Recomendaciones',
        constraints: 'Usar fuentes públicas verificables\nIncluir posicionamiento diferenciado',
        tone: 'Profesional y Corporativo'
      },
      {
        id: 'mkt-branding',
        title: 'Desarrollo de Identidad Visual',
        role: 'Director Creativo / Brand Strategist',
        task: 'Brainstorming de logotipos, eslóganes y nombres considerando estilo y audiencia objetivo.',
        context: 'Creación de marca para startup o rebranding de empresa establecida.',
        format: 'Lista de 5-10 opciones con rationale para cada una',
        constraints: 'Verificar disponibilidad de dominio\nConsiderar implicaciones culturales',
        tone: 'Inspirador'
      },
      {
        id: 'mkt-repurpose',
        title: 'Reutilización de Contenido (Repurposing)',
        role: 'Especialista en Marketing de Contenidos',
        task: 'Convertir informes técnicos en publicaciones de blog, hilos de Twitter o emails, adaptando tono.',
        context: 'Maximizar ROI de contenido existente distribuyéndolo en múltiples canales.',
        format: 'Múltiples versiones del mismo contenido optimizadas por canal',
        constraints: 'Mantener mensaje core\nAdaptar longitud y formato a cada plataforma',
        tone: 'Persuasivo y de Ventas'
      },
      {
        id: 'mkt-nurturing',
        title: 'Campañas de Nurturing (Email)',
        role: 'Marketing Automation Specialist',
        task: 'Crear secuencias de correos para nutrir leads después de descarga de recurso.',
        context: 'Lead generation activo que requiere secuencia automatizada para conversión.',
        format: 'Serie de 3-5 emails con timing sugerido',
        constraints: 'Incluir CTAs claros\nPersonalizar según comportamiento\nCumplir con GDPR',
        tone: 'Amigable y Cercano'
      }
    ]
  },
  {
    id: 'hr',
    name: 'Recursos Humanos',
    icon: '👥',
    description: 'Reclutamiento, capacitación, encuestas y comunicaciones internas.',
    useCases: [
      {
        id: 'hr-jd',
        title: 'Redacción de Descripciones de Puesto',
        role: 'Reclutador Senior / Talent Acquisition',
        task: 'Crear descripciones de trabajo atractivas especificando responsabilidades y requisitos.',
        context: 'Apertura de posición que necesita publicarse en job boards.',
        format: 'Job Description estructurada: Resumen, Responsabilidades, Requisitos, Beneficios',
        constraints: 'Lenguaje inclusivo\nEvitar requisitos excesivos\nDestacar cultura empresarial',
        tone: 'Amigable y Cercano'
      },
      {
        id: 'hr-interview',
        title: 'Generación de Preguntas de Entrevista',
        role: 'Especialista en Selección de Talento',
        task: 'Crear listas de preguntas (técnicas, conductuales, situacionales) basadas en el rol.',
        context: 'Preparación de panel de entrevistas para evaluar candidatos consistentemente.',
        format: 'Lista categorizada de preguntas con criterios de evaluación',
        constraints: 'Incluir preguntas STAR\nEvitar preguntas discriminatorias',
        tone: 'Profesional y Corporativo'
      },
      {
        id: 'hr-onboarding',
        title: 'Planes de Aprendizaje Individualizados',
        role: 'Gerente de Capacitación y Desarrollo',
        task: 'Crear planes de onboarding y desarrollo personalizados organizados por día/semana.',
        context: 'Nuevo empleado que necesita rampup estructurado.',
        format: 'Cronograma con recursos, contactos y checkpoints',
        constraints: 'Incluir tanto hard skills como soft skills\nAsignar mentores',
        tone: 'Amigable y Cercano'
      },
      {
        id: 'hr-surveys',
        title: 'Análisis de Encuestas de Empleados',
        role: 'HR Business Partner',
        task: 'Resumir resultados de encuestas de satisfacción identificando temas clave y mejoras.',
        context: 'Encuesta anual de clima laboral completada.',
        format: 'Dashboard ejecutivo con insights y plan de acción',
        constraints: 'Mantener anonimato\nPriorizar acciones de alto impacto',
        tone: 'Profesional y Corporativo'
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operaciones y Cadena de Suministro',
    icon: '📦',
    description: 'Gestión de inventario, evaluación de proveedores y logística.',
    useCases: [
      {
        id: 'ops-supplier',
        title: 'Evaluación de Riesgos de Proveedores',
        role: 'Gerente de Cadena de Suministro',
        task: 'Análisis integral de riesgos para proveedores y estrategias de mitigación.',
        context: 'Due diligence de proveedor crítico o diversificación de supply chain.',
        format: 'Matriz de riesgos (Financiero, Operacional, Reputacional, Geopolítico)',
        constraints: 'Incluir scoring cuantitativo\nRecomendar acciones concretas',
        tone: 'Profesional y Corporativo'
      },
      {
        id: 'ops-inventory',
        title: 'Gestión de Inventario y Pedidos',
        role: 'Coordinador de Operaciones',
        task: 'Verificar estado de pedidos, gestionar carritos y procesar devoluciones.',
        context: 'Operación diaria de e-commerce o almacén.',
        format: 'Reporte de status + Acciones pendientes',
        constraints: 'Actualizar sistemas en tiempo real\nNotificar excepciones',
        tone: 'Directo y Conciso'
      },
      {
        id: 'ops-shifts',
        title: 'Gestión de Turnos y Tareas',
        role: 'Supervisor de Primera Línea',
        task: 'Crear checklists para apertura/cierre y notas de traspaso de turno.',
        context: 'Operación 24/7 que requiere continuidad entre turnos.',
        format: 'Checklist + Handoff notes',
        constraints: 'Incluir issues pendientes\nEscalar urgencias',
        tone: 'Directo y Conciso'
      }
    ]
  },
  {
    id: 'education',
    name: 'Educación',
    icon: '📚',
    description: 'Tutoría, generación de material y evaluaciones.',
    useCases: [
      {
        id: 'edu-socratic',
        title: 'Tutoría Socrática',
        role: 'Tutor Virtual Especializado',
        task: 'Guiar estudiantes a través de problemas complejos con preguntas sin dar respuesta directa.',
        context: 'Estudiante necesita desarrollar pensamiento crítico, no solo memorizar.',
        format: 'Diálogo socrático estructurado',
        constraints: 'No revelar respuesta\nHacer preguntas guía progresivas\nValidar razonamiento',
        tone: 'Amigable y Cercano'
      },
      {
        id: 'edu-material',
        title: 'Generación de Material de Estudio',
        role: 'Diseñador Instruccional',
        task: 'Crear quizzes, flashcards o guías de estudio a partir de notas de clase.',
        context: 'Preparación para examen o refuerzo de aprendizaje.',
        format: 'Quiz con respuestas + Explicaciones',
        constraints: 'Variar dificultad\nCubrir todos los temas clave\nIncluir explicaciones pedagógicas',
        tone: 'Académico y Formal'
      },
      {
        id: 'edu-tutor-rag',
        title: 'Tutor Personalizado con Libros de Texto',
        role: 'Asistente de Enseñanza Virtual',
        task: 'Responder preguntas de estudiantes usando libros de texto cargados como contexto.',
        context: 'Estudiante estudia fuera de horario y necesita soporte inmediato.',
        format: 'Respuesta + Referencia a sección del libro',
        constraints: 'Citar páginas específicas\nAdaptar explicación al nivel del estudiante\nOfrecer ejemplos adicionales',
        tone: 'Amigable y Cercano'
      }
    ]
  }
];

export const SAFETY_TIPS = [
  {
    title: "Mitigación de Alucinaciones",
    text: "Instruye a la IA para que se base únicamente en los datos proporcionados si buscas hechos concretos. Si no sabe, que lo admita."
  },
  {
    title: "Verificación Humana",
    text: "Los LLMs son copilotos, no pilotos automáticos. Verifica siempre datos críticos, fechas y cálculos."
  },
  {
    title: "Privacidad de Datos",
    text: "Evita compartir información personal sensible (PII), contraseñas o secretos comerciales en los prompts."
  },
  {
    title: "Sesgo Inherente",
    text: "Recuerda que los modelos pueden reflejar sesgos culturales o sociales presentes en sus datos de entrenamiento."
  }
];

