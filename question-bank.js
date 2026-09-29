window.CCARF_QUESTION_BANK = [
  {
    id:"SUP-D4-FEWSHOT-01",
    scenarioId:"customer-support",
    scenarioEN:"You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to backend systems through custom Model Context Protocol (MCP) tools such as get_customer, lookup_order, process_refund, and escalate_to_human. Your target is high first-contact resolution while knowing when to escalate.",
    scenarioES:"Estás construyendo un agente de resolución de soporte al cliente usando Claude Agent SDK. El agente maneja solicitudes de alta ambigüedad como devoluciones, disputas de facturación y problemas de cuenta. Tiene acceso a sistemas backend mediante herramientas MCP personalizadas como get_customer, lookup_order, process_refund y escalate_to_human. El objetivo es maximizar la resolución en el primer contacto y escalar cuando corresponda.",
    lessonId:"d4-prompt", domain:"D4", type:"single",
    questionEN:"In testing, the request “my order arrived broken” sometimes triggers an immediate process_refund and sometimes a lookup_order investigation first. Detailed prompt instructions have not made the behavior consistent. What change most reliably improves consistency?",
    questionES:"En pruebas, la solicitud “mi pedido llegó roto” a veces activa process_refund inmediatamente y otras veces inicia primero una investigación con lookup_order. Instrucciones detalladas en el prompt no han logrado hacer consistente el comportamiento. ¿Qué cambio mejora la consistencia de forma más confiable?",
    options:[
      {en:"Add ten or more examples covering every request phrasing the team has logged so the agent can match new messages to prior cases.",es:"Agregar diez o más ejemplos que cubran cada redacción registrada para que el agente relacione mensajes nuevos con casos previos."},
      {en:"Add 3–5 examples of ambiguous requests, each showing the chosen tool sequence and the rationale for rejecting the plausible alternative.",es:"Agregar 3–5 ejemplos de solicitudes ambiguas, mostrando la secuencia de herramientas elegida y la razón para rechazar la alternativa plausible."},
      {en:"Add examples showing only the final tool call for each request type, keeping them short so they do not dilute the system prompt.",es:"Agregar ejemplos que muestren sólo la llamada final de herramienta para cada tipo de solicitud, manteniéndolos cortos para no diluir el system prompt."},
      {en:"Add examples of clear-cut requests only, since ambiguous cases would teach conflicting patterns.",es:"Agregar sólo ejemplos de solicitudes claras, porque los casos ambiguos enseñarían patrones conflictivos."}
    ],
    correct:[1],
    wrongReasonEN:[
      "Exhaustively enumerating phrasings encourages memorization and does not teach the underlying ambiguity-resolution rule.",
      "",
      "Showing only the final tool call omits the decision process that distinguishes two plausible sequences.",
      "The inconsistency occurs specifically in ambiguous cases; excluding them avoids the problem rather than teaching the desired behavior."
    ],
    wrongReasonES:[
      "Enumerar exhaustivamente redacciones fomenta memorización y no enseña la regla subyacente para resolver ambigüedad.",
      "",
      "Mostrar sólo la llamada final omite el proceso de decisión que distingue dos secuencias plausibles.",
      "La inconsistencia ocurre precisamente en casos ambiguos; excluirlos evita el problema en vez de enseñar el comportamiento deseado."
    ],
    rationaleEN:"Use a small set of representative few-shot examples focused on ambiguous cases. Each example should demonstrate not just the selected tool sequence, but why a plausible alternative is rejected. This teaches the decision boundary instead of memorizing phrasing.",
    rationaleES:"Usa un conjunto pequeño de ejemplos few-shot representativos centrados en casos ambiguos. Cada ejemplo debe demostrar no sólo la secuencia elegida, sino también por qué se rechaza una alternativa plausible. Así se enseña el límite de decisión en lugar de memorizar frases.",
    ruleEN:"When prose instructions fail on ambiguous judgments, demonstrate the desired decision boundary with targeted few-shot examples.",
    ruleES:"Cuando las instrucciones en prosa fallan en decisiones ambiguas, demuestra el límite de decisión con ejemplos few-shot dirigidos.",
    doc:{label:"Prompt engineering best practices",url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}
  },
  {
    id:"DEV-D1-TOOLRESULT-01",
    scenarioId:"developer-productivity",
    scenarioEN:"You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses built-in tools such as Read, Write, Bash, Grep, and Glob and can integrate with MCP servers.",
    scenarioES:"Estás construyendo herramientas de productividad para desarrolladores usando Claude Agent SDK. El agente ayuda a explorar codebases desconocidos, entender sistemas legacy, generar boilerplate y automatizar tareas repetitivas. Usa herramientas integradas como Read, Write, Bash, Grep y Glob y puede integrarse con servidores MCP.",
    lessonId:"d1-loop", domain:"D1", type:"single",
    questionEN:"The agent requests a Grep search across a legacy repository, and the harness executes it successfully. What must the harness do so the model can read the search results and choose its next action?",
    questionES:"El agente solicita una búsqueda Grep en un repositorio legacy y el harness la ejecuta correctamente. ¿Qué debe hacer el harness para que el modelo pueda leer los resultados y elegir su siguiente acción?",
    options:[
      {en:"Send the output back in a dedicated tool-role message that is separate from ordinary user and assistant content.",es:"Enviar el resultado en un mensaje con rol tool separado del contenido normal de user y assistant."},
      {en:"Attach the output to the Grep tool definition metadata so the model reads it when reevaluating available tools.",es:"Adjuntar el resultado al metadata de la definición de Grep para que el modelo lo lea al reevaluar las herramientas disponibles."},
      {en:"Do nothing extra because the API automatically injects the client-side Grep output into the model context.",es:"No hacer nada adicional porque la API inyecta automáticamente el resultado de Grep ejecutado por el cliente."},
      {en:"Append a tool_result block referencing the tool_use ID in a user message and send the updated history in the next request.",es:"Agregar un bloque tool_result que referencia el ID de tool_use dentro de un mensaje user y enviar el historial actualizado en la siguiente solicitud."}
    ],
    correct:[3],
    wrongReasonEN:[
      "The Messages API uses content blocks in conversation messages; a separate generic tool role is not the expected client-tool return pattern.",
      "Tool definitions describe capabilities. They are not where runtime tool outputs are returned.",
      "Client-side tool execution is external to the API. Its result must be explicitly returned to Claude.",
      ""
    ],
    wrongReasonES:[
      "La Messages API usa bloques de contenido dentro de mensajes; un rol tool genérico separado no es el patrón esperado para devolver resultados de client tools.",
      "Las definiciones de herramientas describen capacidades. No son el lugar donde se devuelven resultados de ejecución.",
      "La ejecución de client tools ocurre fuera de la API. El resultado debe devolverse explícitamente a Claude.",
      ""
    ],
    rationaleEN:"For a client tool, the application executes the requested action and then returns a tool_result block that references the corresponding tool_use ID. That result becomes new context for the next model turn.",
    rationaleES:"Para una client tool, la aplicación ejecuta la acción solicitada y después devuelve un bloque tool_result que referencia el ID de tool_use correspondiente. Ese resultado se convierte en nuevo contexto para el siguiente turno.",
    ruleEN:"Client tool execution is external; return results explicitly as tool_result tied to the original tool_use ID.",
    ruleES:"La ejecución de client tools es externa; devuelve los resultados explícitamente como tool_result ligado al ID de tool_use original.",
    doc:{label:"Handle tool calls",url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls"}
  },
  {
    id:"RES-D1-DECOMP-01",
    scenarioId:"multi-agent-research",
    scenarioEN:"You are building a multi-agent research system using the Claude Agent SDK. A coordinator delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
    scenarioES:"Estás construyendo un sistema de investigación multiagente usando Claude Agent SDK. Un coordinador delega en subagentes especializados: uno busca en la web, otro analiza documentos, otro sintetiza hallazgos y otro genera reportes. El sistema investiga temas y produce reportes completos con citas.",
    lessonId:"d1-orchestration", domain:"D1", type:"single",
    questionEN:"The team adds a weekly market-brief workflow: retrieve the same five sources, summarize each, and assemble a fixed-format report. The steps never vary across runs. Which decomposition approach best fits this workflow?",
    questionES:"El equipo agrega un workflow semanal de market brief: recuperar las mismas cinco fuentes, resumir cada una y ensamblar un reporte de formato fijo. Los pasos nunca cambian entre ejecuciones. ¿Qué enfoque de descomposición se ajusta mejor?",
    options:[
      {en:"Run an autonomous agent loop that decides its own steps each week and stops when it judges the brief complete.",es:"Ejecutar un agent loop autónomo que decida sus propios pasos cada semana y termine cuando considere completo el brief."},
      {en:"Implement a fixed prompt chain where each step consumes the previous step's output, with programmatic gates between steps.",es:"Implementar una cadena fija de prompts donde cada paso consuma la salida del anterior, con gates programáticos entre pasos."},
      {en:"Handle the entire brief in one comprehensive request so all summarization decisions share one context.",es:"Resolver todo el brief en una sola solicitud para que todas las decisiones de resumen compartan un único contexto."},
      {en:"Have the coordinator generate the subtask list dynamically at runtime based on what the initial retrieval reveals.",es:"Hacer que el coordinador genere dinámicamente la lista de subtareas en runtime según lo que revele la recuperación inicial."}
    ],
    correct:[1],
    wrongReasonEN:[
      "Autonomous decomposition adds unnecessary variability to a deterministic workflow.",
      "",
      "A single monolithic request reduces controllability and makes step-level validation harder.",
      "Dynamic decomposition is useful when task shape is uncertain; this workflow is explicitly stable."
    ],
    wrongReasonES:[
      "La descomposición autónoma agrega variabilidad innecesaria a un workflow determinista.",
      "",
      "Una solicitud monolítica reduce controlabilidad y dificulta la validación por etapa.",
      "La descomposición dinámica es útil cuando la forma de la tarea es incierta; aquí el workflow es explícitamente estable."
    ],
    rationaleEN:"When the sequence is fixed and predictable, a deterministic chain is more appropriate than adaptive agentic decomposition. Programmatic gates can validate each stage and keep the workflow reliable.",
    rationaleES:"Cuando la secuencia es fija y predecible, una cadena determinista es más apropiada que una descomposición agéntica adaptativa. Los gates programáticos permiten validar cada etapa y mantener confiabilidad.",
    ruleEN:"Match autonomy to uncertainty: fixed workflow → fixed chain; open-ended investigation → adaptive decomposition.",
    ruleES:"Ajusta la autonomía a la incertidumbre: workflow fijo → cadena fija; investigación abierta → descomposición adaptativa.",
    doc:{label:"Claude Code subagents",url:"https://code.claude.com/docs/en/sub-agents"}
  },
  {
    id:"CI-D3-CLAUDEMD-01",
    scenarioId:"claude-code-ci",
    scenarioEN:"You are integrating Claude Code into a Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need prompts and configuration that produce actionable feedback and minimize false positives.",
    scenarioES:"Estás integrando Claude Code en un pipeline de Integración Continua/Despliegue Continuo (CI/CD). El sistema ejecuta code reviews automáticos, genera casos de prueba y proporciona feedback sobre pull requests. Necesitas prompts y configuración que produzcan feedback accionable y minimicen falsos positivos.",
    lessonId:"d3-code", domain:"D3", type:"multiple", selectCount:2,
    questionEN:"CI-generated tests keep ignoring the team's fixture library, and review comments apply inconsistent criteria across pull requests. Which two configuration decisions best address this? Select two.",
    questionES:"Las pruebas generadas por CI siguen ignorando la biblioteca de fixtures del equipo y los comentarios de review aplican criterios inconsistentes entre pull requests. ¿Qué dos decisiones de configuración abordan mejor esto? Selecciona dos.",
    options:[
      {en:"Place the standards in each engineer's ~/.claude/CLAUDE.md so the conventions follow whoever triggered the pipeline build.",es:"Colocar los estándares en el ~/.claude/CLAUDE.md de cada ingeniero para que las convenciones sigan a quien activó el build."},
      {en:"Keep CLAUDE.md concise and focused because every run reads it and overly long files reduce instruction reliability.",es:"Mantener CLAUDE.md conciso y enfocado porque cada ejecución lo lee y archivos excesivamente largos reducen la confiabilidad de las instrucciones."},
      {en:"Document testing standards, fixture conventions, and review criteria in a repository-root CLAUDE.md committed to version control.",es:"Documentar estándares de testing, convenciones de fixtures y criterios de review en un CLAUDE.md en la raíz del repositorio versionado."},
      {en:"List the pipeline's required tool permissions inside CLAUDE.md so reviews are both guided and authorized from one file.",es:"Listar los permisos de herramientas requeridos por el pipeline dentro de CLAUDE.md para que los reviews queden guiados y autorizados desde un solo archivo."}
    ],
    correct:[1,2],
    wrongReasonEN:[
      "User-level instructions are personal and do not reliably propagate to every CI runner.",
      "",
      "",
      "CLAUDE.md guides behavior; it is not a substitute for tool permission configuration."
    ],
    wrongReasonES:[
      "Las instrucciones user-level son personales y no se propagan de forma confiable a todos los runners de CI.",
      "",
      "",
      "CLAUDE.md guía comportamiento; no sustituye la configuración de permisos de herramientas."
    ],
    rationaleEN:"Shared team standards belong in repository-level project instructions so every developer and CI runner receives them. Keeping the file focused improves instruction reliability. Tool authorization belongs in the permission system, not CLAUDE.md.",
    rationaleES:"Los estándares compartidos del equipo deben vivir en instrucciones a nivel repositorio para que los reciban desarrolladores y runners de CI. Mantener el archivo enfocado mejora la confiabilidad. La autorización de herramientas pertenece al sistema de permisos, no a CLAUDE.md.",
    ruleEN:"Shared standards → project CLAUDE.md; concise scope improves adherence; permissions are configured separately.",
    ruleES:"Estándares compartidos → CLAUDE.md de proyecto; un scope conciso mejora adherencia; los permisos se configuran por separado.",
    doc:{label:"Claude Code memory / CLAUDE.md",url:"https://code.claude.com/docs/en/memory"}
  },
  {
    id:"EXT-D4-SKILLARGS-01",
    scenarioId:"structured-extraction",
    scenarioEN:"You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates output using JSON schemas, maintains high accuracy, handles edge cases gracefully, and integrates with downstream systems.",
    scenarioES:"Estás construyendo un sistema de extracción de datos estructurados usando Claude. El sistema extrae información de documentos no estructurados, valida la salida mediante JSON Schema, mantiene alta precisión, maneja edge cases y se integra con sistemas downstream.",
    lessonId:"d3-code", domain:"D3", type:"single",
    questionEN:"The team's /extract-fields skill requires a source document path and a target schema name, but engineers keep invoking the skill without arguments and get empty or malformed extractions. Which SKILL.md frontmatter change best addresses this?",
    questionES:"La skill /extract-fields del equipo requiere una ruta al documento fuente y el nombre del schema objetivo, pero los ingenieros siguen invocándola sin argumentos y obtienen extracciones vacías o malformadas. ¿Qué cambio en el frontmatter de SKILL.md aborda mejor esto?",
    options:[
      {en:"Set allowed-tools so the read and extraction tools the skill relies on run without prompts.",es:"Configurar allowed-tools para que las herramientas de lectura y extracción se ejecuten sin prompts de autorización."},
      {en:"Document the required parameters and their defaults only in the skill's instruction body.",es:"Documentar los parámetros requeridos y sus defaults únicamente en el cuerpo de instrucciones de la skill."},
      {en:"Add argument-hint so the skill's expected arguments are shown to engineers when they invoke it.",es:"Agregar argument-hint para que los argumentos esperados por la skill se muestren a los ingenieros al invocarla."},
      {en:"Expand the description field so Claude can decide more precisely when the skill should be invoked.",es:"Expandir el campo description para que Claude decida con mayor precisión cuándo debe invocarse la skill."}
    ],
    correct:[2],
    wrongReasonEN:[
      "allowed-tools controls pre-approval for tools; it does not communicate required invocation arguments.",
      "Instruction-body documentation may help after invocation but does not surface the expected arguments at invocation time.",
      "",
      "description helps tool/skill selection, not the human-facing argument contract for an explicit slash-skill invocation."
    ],
    wrongReasonES:[
      "allowed-tools controla pre-aprobación de herramientas; no comunica los argumentos requeridos al invocar la skill.",
      "Documentarlo en el cuerpo puede ayudar después de invocar, pero no muestra los argumentos esperados en el momento de invocación.",
      "",
      "description ayuda a decidir cuándo usar la skill, no define el contrato visible de argumentos para una invocación explícita."
    ],
    rationaleEN:"argument-hint is intended to expose expected slash-command arguments to the user at invocation time. This directly addresses engineers invoking the skill without required inputs.",
    rationaleES:"argument-hint está pensado para mostrar al usuario los argumentos esperados por un slash command en el momento de la invocación. Eso ataca directamente el problema de invocar la skill sin inputs requeridos.",
    ruleEN:"Wrong invocation shape → fix the invocation contract, not tool permissions or selection descriptions.",
    ruleES:"Forma de invocación incorrecta → corrige el contrato de invocación, no permisos de tools ni descriptions de selección.",
    doc:{label:"Claude Code skills",url:"https://code.claude.com/docs/en/skills"}
  },
  {
    id:"CI-D5-SESSION-01",
    scenarioId:"claude-code-ci",
    scenarioEN:"You are integrating Claude Code into a CI/CD pipeline that performs automated code review and generates actionable pull-request feedback.",
    scenarioES:"Estás integrando Claude Code en un pipeline CI/CD que realiza code review automatizado y genera feedback accionable en pull requests.",
    lessonId:"d5-context", domain:"D5", type:"single",
    questionEN:"A nightly re-review job wants to reuse yesterday's review session after a developer pushes a few new commits touching a handful of files. Most prior analysis remains valid. How should the job proceed?",
    questionES:"Un job nocturno de re-review quiere reutilizar la sesión de review de ayer después de que un desarrollador sube algunos commits nuevos que modifican pocos archivos. La mayor parte del análisis previo sigue siendo válida. ¿Cómo debería proceder?",
    options:[
      {en:"Resume the prior session, supply the list of changed files, and instruct Claude to re-read those files before reusing earlier findings.",es:"Reanudar la sesión previa, proporcionar la lista de archivos modificados e indicar a Claude que vuelva a leerlos antes de reutilizar hallazgos anteriores."},
      {en:"Resume the prior session and compact its history first so outdated tool results are summarized away.",es:"Reanudar la sesión previa y compactar primero el historial para resumir los tool results desactualizados."},
      {en:"Resume the prior session with no additional input because resumption automatically reconciles saved tool results with current repository state.",es:"Reanudar la sesión sin input adicional porque la reanudación reconcilia automáticamente los tool results guardados con el estado actual del repo."},
      {en:"Discard the prior session and launch a completely fresh review that re-explores the entire repository.",es:"Descartar la sesión previa y lanzar un review completamente nuevo que re-explore todo el repositorio."}
    ],
    correct:[0],
    wrongReasonEN:[
      "",
      "Compaction does not itself refresh stale external state and may obscure which evidence must be revalidated.",
      "Resuming a session does not automatically refresh repository facts that have changed since prior tool calls.",
      "A full restart throws away valid prior context even though only a small subset changed."
    ],
    wrongReasonES:[
      "",
      "La compactación no refresca por sí sola estado externo stale y puede ocultar qué evidencia debe revalidarse.",
      "Reanudar una sesión no refresca automáticamente los hechos del repositorio que cambiaron desde las llamadas previas.",
      "Reiniciar desde cero descarta contexto válido aunque sólo haya cambiado un subconjunto pequeño."
    ],
    rationaleEN:"Reuse the prior session because most context remains useful, but explicitly refresh the changed files before relying on prior conclusions. Session continuity does not imply automatic reconciliation with external state.",
    rationaleES:"Reutiliza la sesión previa porque la mayor parte del contexto sigue siendo útil, pero refresca explícitamente los archivos modificados antes de confiar en conclusiones anteriores. Continuidad de sesión no implica reconciliación automática con estado externo.",
    ruleEN:"Resume stable context, refresh changed external state.",
    ruleES:"Reanuda contexto estable, refresca explícitamente el estado externo que cambió.",
    doc:{label:"Claude Code CLI reference",url:"https://code.claude.com/docs/en/cli-reference"}
  }
  ,{
    id:"CODE-D3-PLAN-01",
    scenarioId:"code-generation",
    scenarioEN:"You are using Claude Code for code generation, refactoring, debugging, and documentation across a production repository. The team wants Claude to make safe changes while preserving project conventions and avoiding premature edits when architecture is still uncertain.",
    scenarioES:"Estás usando Claude Code para generación de código, refactoring, debugging y documentación en un repositorio de producción. El equipo quiere que Claude haga cambios seguros, preserve las convenciones del proyecto y evite ediciones prematuras cuando la arquitectura todavía es incierta.",
    lessonId:"d3-workflow", domain:"D3", type:"single",
    questionEN:"An engineer must replace a deprecated messaging library across roughly 50 files. Two migration approaches are both viable but have different infrastructure implications. How should the work begin in Claude Code?",
    questionES:"Un ingeniero debe reemplazar una librería de mensajería obsoleta en aproximadamente 50 archivos. Dos enfoques de migración son viables, pero tienen implicaciones de infraestructura diferentes. ¿Cómo debería comenzar el trabajo en Claude Code?",
    options:[
      {en:"Enter plan mode so Claude explores the codebase read-only, compares the viable approaches, and proposes a migration plan before edits.",es:"Entrar en plan mode para que Claude explore el codebase en modo read-only, compare los enfoques viables y proponga un plan antes de editar."},
      {en:"Write a detailed upfront prompt naming every file to change, then run direct execution against that fixed specification.",es:"Escribir un prompt detallado que enumere cada archivo a modificar y ejecutar directamente contra esa especificación fija."},
      {en:"Begin direct execution on a small subset of files and let the emerging changes reveal which architecture fits.",es:"Comenzar ejecución directa sobre un pequeño subconjunto de archivos y dejar que los cambios revelen qué arquitectura encaja."},
      {en:"Use direct execution with /compact after every batch so growing context does not derail the migration.",es:"Usar ejecución directa con /compact después de cada lote para que el crecimiento del contexto no descarrile la migración."}
    ],
    correct:[0],
    wrongReasonEN:[
      "",
      "The architecture is not decided yet, so prescribing every file and implementation up front assumes facts that still need investigation.",
      "Editing before choosing between materially different architectures creates rework risk and mixes exploration with mutation.",
      "Compaction addresses context size, not the unresolved architectural choice that should be investigated before edits."
    ],
    wrongReasonES:[
      "",
      "La arquitectura todavía no está decidida, por lo que prescribir todos los archivos e implementación de antemano asume hechos que aún deben investigarse.",
      "Editar antes de elegir entre arquitecturas materialmente distintas aumenta el riesgo de retrabajo y mezcla exploración con mutación.",
      "La compactación aborda tamaño de contexto, no la decisión arquitectónica no resuelta que debe investigarse antes de editar."
    ],
    rationaleEN:"The task is broad and architecturally uncertain. Plan mode separates exploration and design from mutation, allowing Claude to inspect dependencies and compare approaches before making repository changes.",
    rationaleES:"La tarea es amplia y existe incertidumbre arquitectónica. Plan mode separa exploración y diseño de la mutación, permitiendo inspeccionar dependencias y comparar enfoques antes de modificar el repositorio.",
    ruleEN:"High scope + unresolved architecture → plan first. Bounded, well-understood change → direct execution.",
    ruleES:"Alcance alto + arquitectura no resuelta → planifica primero. Cambio acotado y bien entendido → ejecución directa.",
    doc:{label:"Claude Code common workflows",url:"https://code.claude.com/docs/en/common-workflows"}
  }

];