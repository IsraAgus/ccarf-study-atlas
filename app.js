const lessons = [
  {
    id:'overview', group:'Start here / Inicio', title:'Study strategy / Estrategia', short:'Strategy', image:'assets/strategy.svg',
    candidate:true, official:true,
    heroES:'Aprender por dominio. Practicar por escenario.', heroEN:'Learn by domain. Practise by scenario.',
    introES:'La preparación combina cuatro capas: insights del candidato que aprobó para entender traps y patrones de decisión; documentación oficial de Anthropic para la verdad técnica vigente; labs para demostrar comprensión; y simulacros para entrenar velocidad y resistencia a distractores.',
    introEN:'Preparation combines four layers: passed-candidate insights for exam traps and decision patterns; official Anthropic documentation for current technical truth; labs to prove understanding; and mock exams to train speed and distractor resistance.',
    concepts:[
      ['01','Candidate insights','Exam traps + decision patterns','Trampas del examen + patrones de decisión'],
      ['02','Anthropic docs','Current definitions + behavior','Definiciones + comportamiento vigente'],
      ['03','Labs','Build it to prove it','Construir para demostrar comprensión'],
      ['04','Mock exams','Speed + distractor resistance','Velocidad + resistencia a distractores']
    ],
    ruleES:'Candidato = cómo pensar ante la pregunta. Anthropic = cómo funciona realmente la tecnología.',
    ruleEN:'Candidate = how to think during the exam. Anthropic = how the technology actually works.',
    trapES:'No memorices una recomendación del candidato como si fuera una API contract. Conserva el patrón de decisión y verifica la implementación actual en Anthropic.',
    trapEN:'Do not memorize a candidate recommendation as an API contract. Keep the decision pattern and verify current implementation in Anthropic docs.',
    question:'A recommendation from the passed candidate conflicts with current Anthropic syntax. What should you preserve?',
    options:['The old syntax exactly','The decision principle, then update the implementation from official docs','Only the official docs and ignore the exam insight','Whichever option is shorter'],
    answer:1,
    answerES:'Conserva el principio que el insight intenta evaluar y actualiza la mecánica usando documentación oficial.',
    answerEN:'Preserve the principle the insight is testing, and update the mechanics using official documentation.'
  },
  {
    id:'foundations', group:'Start here / Inicio', title:'Foundation map / Mapa base', short:'Foundations', image:'assets/foundations.svg', official:true,
    heroES:'Cuatro piezas. Responsabilidades distintas.', heroEN:'Four pieces. Different responsibilities.',
    introES:'Antes de entrar a los dominios, separa mentalmente Claude API, Claude Code, Claude Agent SDK y MCP. El examen combina estas piezas dentro de escenarios, por lo que confundir sus responsabilidades produce respuestas plausibles pero incorrectas.',
    introEN:'Before entering the domains, mentally separate Claude API, Claude Code, Claude Agent SDK, and MCP. The exam combines these pieces inside scenarios, so mixing their responsibilities produces plausible but incorrect answers.',
    concepts:[
      ['01','Claude API','Direct model interaction','Interacción directa con el modelo'],
      ['02','Claude Code','Agentic coding environment','Entorno agéntico de programación'],
      ['03','Agent SDK','Programmable agent harness','Arnés programable para agentes'],
      ['04','MCP','Standardized external context/tools','Contexto y herramientas externas estandarizadas']
    ],
    ruleES:'Pregúntate siempre: ¿quién decide, quién ejecuta y dónde vive el estado?', ruleEN:'Always ask: who decides, who executes, and where does state live?',
    trapES:'“Claude” no es una sola capa. Una pregunta puede cambiar completamente según hable de Messages API, Claude Code o un MCP server.', trapEN:'“Claude” is not one layer. An answer can change completely depending on whether the question concerns the Messages API, Claude Code, or an MCP server.',
    question:'Which concept is specifically about a standardized protocol for exposing external tools and context?',options:['Claude API','Claude Code','MCP','Prompt caching'],answer:2,
    answerES:'MCP estandariza cómo aplicaciones y agentes descubren e interactúan con herramientas/contexto expuesto por servidores.',answerEN:'MCP standardizes how applications and agents discover and interact with tools/context exposed by servers.'
  },
  {
    id:'d1-loop', group:'Domain 1 · 27%', title:'Agentic loop / Bucle agéntico', short:'Agentic loop', image:'assets/agentic-loop.svg', candidate:true, official:true,
    heroES:'El estado del workflow viene de señales estructuradas, no de adivinar el texto.', heroEN:'Workflow state comes from structured signals, not guesses about prose.',
    introES:'Para client tools, tu aplicación conduce el ciclo: envía la solicitud, inspecciona stop_reason, ejecuta tool_use, devuelve tool_result y repite hasta que el modelo deje de pedir herramientas. Anthropic documenta el while loop basado en stop_reason como la forma canónica.',
    introEN:'For client tools, your application drives the cycle: send the request, inspect stop_reason, execute tool_use, return tool_result, and repeat until the model stops requesting tools. Anthropic documents a stop_reason-driven while loop as the canonical shape.',
    concepts:[
      ['01','stop_reason','Why generation stopped','Por qué terminó esa generación'],
      ['02','tool_use','Claude requests an action','Claude solicita una acción'],
      ['03','tool_result','Your app returns the result','Tu aplicación devuelve el resultado'],
      ['04','end_turn','Natural turn completion','Terminación natural del turno']
    ],
    ruleES:'Mientras stop_reason == "tool_use", ejecuta herramientas y continúa la conversación.',ruleEN:'While stop_reason == "tool_use", run the tools and continue the conversation.',
    trapES:'No termines porque Claude escribió “I’m done”, porque apareció texto, ni uses un iteration cap arbitrario como señal primaria de completitud.',trapEN:'Do not terminate because Claude wrote “I’m done”, because text appeared, or because an arbitrary iteration cap was reached as the primary completion signal.',
    question:'Claude returns a text block saying “Let me verify that” and also requests get_customer. What should control the loop?',
    options:['Presence of assistant text','A fixed limit of 5 loops','The stop_reason and structured tool blocks','A regex looking for “verify”'],answer:2,
    answerES:'La presencia de texto no implica finalización. Usa stop_reason y procesa los bloques tool_use.',answerEN:'The presence of text does not imply completion. Use stop_reason and process the tool_use blocks.'
  },
  {
    id:'d1-orchestration', group:'Domain 1 · 27%', title:'Multi-agent orchestration', short:'Orchestration', image:'assets/orchestration.svg', candidate:true, official:true,
    heroES:'Coordinación central, contexto explícito.',heroEN:'Central coordination, explicit context.',
    introES:'El candidato enfatiza un modelo hub-and-spoke: un coordinator descompone, delega y sintetiza. El insight de examen más importante es no asumir memoria compartida: un subagent necesita recibir explícitamente la información que requiera.',
    introEN:'The candidate emphasizes a hub-and-spoke model: a coordinator decomposes, delegates, and synthesizes. The key exam insight is not to assume shared memory: a subagent needs the information it requires passed explicitly.',
    concepts:[['01','Coordinator','Decompose + route + aggregate','Descomponer + enrutar + agregar'],['02','Subagent','Specialized isolated worker','Trabajador especializado aislado'],['03','Context passing','Explicit inputs','Inputs explícitos'],['04','Parallelism','Independent work concurrently','Trabajo independiente concurrente']],
    ruleES:'Si un subagente necesita un dato, pásalo explícitamente en su contexto.',ruleEN:'If a subagent needs a fact, pass it explicitly in its context.',
    trapES:'Asumir que el subagent hereda automáticamente el historial completo del coordinator.',trapEN:'Assuming a subagent automatically inherits the coordinator’s full conversation history.',
    question:'A synthesis subagent produces unattributed claims although research agents found the sources. What should you inspect first?',options:['Model temperature','Context passed into synthesis','Add more web-search tools','Increase max_tokens'],answer:1,
    answerES:'Revisa si el coordinator pasó contenido y metadata de procedencia de forma estructurada.',answerEN:'Inspect whether the coordinator passed findings and provenance metadata in a structured form.'
  },
  {
    id:'d1-enforcement', group:'Domain 1 · 27%', title:'Enforcement, hooks & gates', short:'Enforcement', image:'assets/enforcement.svg', candidate:true, official:true,
    heroES:'Guidance orienta. Enforcement bloquea.',heroEN:'Guidance influences. Enforcement blocks.',
    introES:'Para preferencias de bajo riesgo, una instrucción puede ser suficiente. Para invariantes financieros, seguridad o compliance, el insight del candidato es exigir una barrera programática —por ejemplo un hook o prerequisite gate— que impida físicamente la operación inválida.',
    introEN:'For low-stakes preferences, an instruction may be enough. For financial, security, or compliance invariants, the candidate insight is to require a programmatic barrier—such as a hook or prerequisite gate—that physically prevents the invalid operation.',
    concepts:[['01','Prompt guidance','Probabilistic influence','Influencia probabilística'],['02','Pre-execution hook','Intercept before action','Interceptar antes de ejecutar'],['03','Prerequisite gate','Block until condition is true','Bloquear hasta cumplir condición'],['04','Post-tool hook','Normalize/inspect result','Normalizar/inspeccionar resultado']],
    ruleES:'Si una sola violación sería inaceptable, no dependas sólo del prompt.',ruleEN:'If a single violation would be unacceptable, do not rely on prompt text alone.',
    trapES:'Elegir “enhance the system prompt” para una operación crítica porque parece más simple.',trapEN:'Choosing “enhance the system prompt” for a critical operation because it sounds simpler.',
    question:'Refunds sometimes occur before identity verification. Which mechanism best enforces the invariant?',options:['More few-shot examples','A stronger system prompt','A prerequisite gate before refund execution','A longer CLAUDE.md'],answer:2,
    answerES:'El gate hace imposible ejecutar el refund sin el requisito; las otras opciones sólo guían al modelo.',answerEN:'The gate makes the refund impossible without the prerequisite; the other options only influence the model.'
  },
  {
    id:'d2-tools', group:'Domain 2 · 18%', title:'Tool design & selection', short:'Tool design', image:'assets/tools-mcp.svg', candidate:true, official:true,
    heroES:'La descripción de una tool es parte de su interfaz.',heroEN:'A tool description is part of its interface.',
    introES:'Cuando herramientas similares se confunden, el candidato prioriza corregir sus descriptions y boundaries antes de agregar routing extra. Las herramientas deben tener propósito, inputs, restricciones y límites suficientemente claros para que Claude pueda diferenciarlas.',
    introEN:'When similar tools are confused, the candidate prioritizes fixing their descriptions and boundaries before adding routing complexity. Tools should have a clear purpose, inputs, constraints, and boundaries so Claude can distinguish them.',
    concepts:[['01','Purpose','What it does','Qué hace'],['02','Inputs','Shape + constraints','Forma + restricciones'],['03','Boundaries','When to use this vs another','Cuándo usar ésta vs otra'],['04','Errors','Structured recovery signal','Señal estructurada para recovery']],
    ruleES:'Corrige primero la interfaz ambigua; agrega routing sólo si la causa raíz persiste.',ruleEN:'Fix the ambiguous interface first; add routing only if the root cause remains.',
    trapES:'Sobrearquitectura: añadir classifier, examples o consolidación antes de corregir descriptions casi idénticas.',trapEN:'Overengineering: adding a classifier, examples, or consolidation before fixing nearly identical descriptions.',
    question:'get_customer and lookup_order are frequently confused and both have one-line generic descriptions. First intervention?',options:['Add a routing classifier','Expand the tool descriptions and boundaries','Merge both tools','Force every request through lookup_order'],answer:1,
    answerES:'La ambigüedad de la descripción es el root cause más directo.',answerEN:'The description ambiguity is the most direct root cause.'
  },
  {
    id:'d2-mcp', group:'Domain 2 · 18%', title:'MCP integration', short:'MCP', image:'assets/mcp.svg', candidate:true, official:true,
    heroES:'Un protocolo común para herramientas y contexto.',heroEN:'A common protocol for tools and context.',
    introES:'MCP permite conectar clientes con servidores que exponen capacidades y recursos. Para el examen interesa especialmente el scoping, compartir configuración a nivel proyecto, mantener secretos fuera del repositorio y decidir cuándo usar un servidor existente frente a construir uno específico.',
    introEN:'MCP connects clients to servers that expose capabilities and resources. For the exam, pay particular attention to scoping, sharing project-level configuration, keeping secrets out of the repository, and deciding when to use an existing server versus building a custom one.',
    concepts:[['01','Server','Exposes capabilities','Expone capacidades'],['02','Tools','Actions','Acciones'],['03','Resources','Inspectable context','Contexto consultable'],['04','Scope','Project vs personal','Proyecto vs personal']],
    ruleES:'Configuración compartida del equipo debe vivir en un scope compartible, no sólo en configuración personal.',ruleEN:'Team-shared configuration belongs in a shareable scope, not only personal configuration.',
    trapES:'Construir un custom MCP server de inmediato para una integración estándar sin evaluar opciones existentes.',trapEN:'Immediately building a custom MCP server for a standard integration without evaluating existing options.',
    question:'A team needs the same MCP configuration after cloning the repo. Where should shared config live conceptually?',options:['Only in each developer’s personal settings','In project-scoped, version-controlled configuration','Inside a prompt example','In the model output'],answer:1,
    answerES:'La configuración compartida debe ser project-scoped y versionable, manteniendo secrets como variables de entorno.',answerEN:'Shared configuration should be project-scoped and versionable, while secrets stay in environment variables.'
  },
  {
    id:'d3-code', group:'Domain 3 · 20%', title:'Claude Code configuration', short:'Claude Code config', image:'assets/claude-code.svg', candidate:true, official:true,
    heroES:'Pon las instrucciones donde corresponde.',heroEN:'Put instructions in the right scope.',
    introES:'El dominio distingue instrucciones personales, compartidas por proyecto y reglas condicionadas por path. El trap clásico del candidato es guardar un estándar de equipo únicamente en configuración de usuario: los compañeros que clonan el repo no lo reciben.',
    introEN:'This domain distinguishes personal instructions, shared project instructions, and path-conditioned rules. The classic candidate trap is storing a team standard only in user configuration: teammates who clone the repo do not receive it.',
    concepts:[['01','User scope','Personal behavior','Comportamiento personal'],['02','Project scope','Shared team standards','Estándares compartidos'],['03','Path rules','Load only for matching files','Cargar sólo en archivos coincidentes'],['04','Skills','On-demand workflows','Workflows bajo demanda']],
    ruleES:'Universal y compartido → project instructions. Condicionado por archivos → path rules. Bajo demanda → skill.',ruleEN:'Universal and shared → project instructions. File-conditioned → path rules. On-demand → skill.',
    trapES:'Duplicar CLAUDE.md en decenas de directorios para aplicar una convención a todos los test files.',trapEN:'Duplicating CLAUDE.md across dozens of directories to apply a convention to all test files.',
    question:'Tests are co-located across many directories and need one shared convention. Best fit?',options:['A CLAUDE.md copied into every folder','Path-specific rules using a glob','A personal skill only','A longer user-level CLAUDE.md'],answer:1,
    answerES:'Las reglas por path expresan el patrón una sola vez y se cargan sólo cuando corresponde.',answerEN:'Path rules express the pattern once and load only when relevant.'
  },
  {
    id:'d3-workflow', group:'Domain 3 · 20%', title:'Claude Code workflows & CI/CD', short:'Workflows & CI', image:'assets/ci.svg', candidate:true, official:true,
    heroES:'Explora cuando hay incertidumbre. Ejecuta directo cuando el scope es claro.',heroEN:'Explore when uncertain. Execute directly when scope is clear.',
    introES:'Plan mode es útil para tareas amplias o arquitectónicas; direct execution para cambios locales y bien entendidos. En automatización, el candidato destaca ejecución no interactiva y output estructurado para que CI pueda consumir resultados.',
    introEN:'Plan mode fits broad or architectural work; direct execution fits local, well-understood changes. In automation, the candidate highlights non-interactive execution and structured output so CI can consume results.',
    concepts:[['01','Plan mode','Investigate + design','Investigar + diseñar'],['02','Direct execution','Known, bounded change','Cambio conocido y acotado'],['03','Non-interactive','Automation-safe execution','Ejecución segura para automatización'],['04','Independent review','Fresh review context','Contexto fresco para revisión']],
    ruleES:'La complejidad y la incertidumbre deciden el workflow, no una preferencia fija por Plan Mode.',ruleEN:'Complexity and uncertainty choose the workflow, not a fixed preference for Plan Mode.',
    trapES:'Ejecutar Claude Code en CI de forma interactiva y dejar el job esperando input.',trapEN:'Running Claude Code interactively in CI and leaving the job waiting for input.',
    question:'A CI job hangs because Claude is waiting for interactive input. What class of fix is needed?',options:['More context','Non-interactive CLI execution','A bigger model','More subagents'],answer:1,
    answerES:'El workflow automatizado necesita modo no interactivo y output apto para máquinas.',answerEN:'The automated workflow needs non-interactive execution and machine-consumable output.'
  },
  {
    id:'d4-prompt', group:'Domain 4 · 20%', title:'Prompt engineering', short:'Prompt engineering', image:'assets/prompt.svg', candidate:true, official:true,
    heroES:'Sé explícito sobre criterios, no sólo sobre intención.',heroEN:'Be explicit about criteria, not just intent.',
    introES:'El material del candidato prioriza criterios concretos y ejemplos few-shot frente a instrucciones vagas como “be conservative”. El objetivo es reducir variabilidad y enseñar cómo resolver casos ambiguos.',
    introEN:'The candidate material prioritizes concrete criteria and few-shot examples over vague instructions such as “be conservative”. The goal is to reduce variance and teach how ambiguous cases should be handled.',
    concepts:[['01','Explicit criteria','Define report vs skip','Definir reportar vs omitir'],['02','Few-shot','Demonstrate ambiguous cases','Demostrar casos ambiguos'],['03','Examples','Show expected transformation','Mostrar transformación esperada'],['04','Calibration','Validate against labelled data','Validar contra datos etiquetados']],
    ruleES:'Si prosa adicional no arregla inconsistencia, muestra ejemplos concretos del comportamiento deseado.',ruleEN:'If more prose does not fix inconsistency, show concrete examples of the desired behavior.',
    trapES:'Usar “only high-confidence findings” sin definir qué constituye un finding válido.',trapEN:'Using “only high-confidence findings” without defining what counts as a valid finding.',
    question:'A reviewer classifies borderline issues inconsistently despite long instructions. Best next technique?',options:['Add even longer prose','Few-shot examples covering ambiguous cases','Raise max_tokens','Force every result to critical severity'],answer:1,
    answerES:'Los ejemplos atacan directamente la inconsistencia en decisiones ambiguas.',answerEN:'Examples directly address inconsistent judgment on ambiguous cases.'
  },
  {
    id:'d4-structured', group:'Domain 4 · 20%', title:'Structured output & validation', short:'Structured output', image:'assets/structured-output.svg', candidate:true, official:true,
    heroES:'Schema correctness no es truth correctness.',heroEN:'Schema correctness is not truth correctness.',
    introES:'Structured outputs restringen la forma del resultado y pueden garantizar JSON válido conforme al esquema. Eso no demuestra que los valores sean verdaderos, estén en el campo correcto o coincidan con la fuente. Por eso aparecen schema design, validación y retry con feedback.',
    introEN:'Structured outputs constrain result shape and can guarantee schema-valid JSON. That does not prove values are true, semantically correct, or grounded in the source. This is why schema design, validation, and retry with feedback matter.',
    concepts:[['01','JSON Schema','Machine contract','Contrato para máquinas'],['02','Nullable fields','Do not force fabrication','No forzar fabricación'],['03','Validation','Check semantic constraints','Verificar constraints semánticos'],['04','Retry feedback','Correct fixable errors','Corregir errores reparables']],
    ruleES:'Un schema evita errores estructurales; validación adicional detecta errores semánticos.',ruleEN:'A schema prevents structural errors; additional validation catches semantic errors.',
    trapES:'Creer que JSON válido garantiza totales correctos o evita valores inventados cuando un campo requerido no existe en la fuente.',trapEN:'Believing valid JSON guarantees correct totals or prevents fabrication when a required field is absent from the source.',
    question:'An extraction always returns valid JSON, but line items do not add up to the stated total. What failed?',options:['JSON syntax','Semantic validation','Tool discovery','MCP transport'],answer:1,
    answerES:'La estructura es válida; el error está en la semántica de los datos.',answerEN:'The structure is valid; the error is in data semantics.'
  },
  {
    id:'d5-context', group:'Domain 5 · 15%', title:'Context management & reliability', short:'Context & reliability', image:'assets/context.svg', candidate:true, official:true,
    heroES:'Resume narrativa. Preserva hechos críticos.',heroEN:'Summarize narrative. Preserve critical facts.',
    introES:'El candidato advierte que progressive summarization puede degradar IDs, fechas, cantidades y estados. Una estrategia robusta separa hechos transaccionales persistentes de la narrativa que sí puede compactarse.',
    introEN:'The candidate warns that progressive summarization can degrade IDs, dates, amounts, and statuses. A robust strategy separates persistent transactional facts from narrative that can be compacted.',
    concepts:[['01','Case facts','Exact persistent state','Estado persistente exacto'],['02','Summary','Compressed narrative','Narrativa comprimida'],['03','Error propagation','Failure + attempt + partial results','Fallo + intento + resultados parciales'],['04','Provenance','Claim ↔ source mapping','Claim ↔ source mapping']],
    ruleES:'Datos que deben seguir siendo exactos no deben depender únicamente de una summary libre.',ruleEN:'Data that must remain exact should not depend only on a free-form summary.',
    trapES:'Convertir “$247.83, order #8891, March 3” en “a recent refund request” y asumir que no se perdió información.',trapEN:'Turning “$247.83, order #8891, March 3” into “a recent refund request” and assuming no information was lost.',
    question:'A long-running support case keeps losing exact refund amounts after compaction. Best architectural response?',options:['Use a more emotional summary','Persist exact case facts separately from narrative summaries','Disable all summarization forever','Ask the customer to repeat everything each turn'],answer:1,
    answerES:'Los facts críticos se mantienen estructurados y se inyectan cuando hacen falta.',answerEN:'Critical facts remain structured and are injected when needed.'
  },
  {
    id:'scenarios', group:'Exam practice / Práctica', title:'Six exam scenarios / Seis escenarios', short:'Exam scenarios', image:'assets/scenarios.svg', candidate:true, official:true,
    heroES:'El escenario es el disfraz. El dominio es lo que realmente se evalúa.',heroEN:'The scenario is the disguise. The domain is what is actually being tested.',
    introES:'La preparación práctica debe invertir el orden del estudio: Scenario → problem signal → hidden domain → decision rule → distractors. El mismo concepto puede aparecer en escenarios distintos.',
    introEN:'Practice should invert the learning order: Scenario → problem signal → hidden domain → decision rule → distractors. The same concept can appear in multiple scenarios.',
    concepts:[['01','Customer Support','Agents + MCP + escalation','Agents + MCP + escalamiento'],['02','Code Generation','Claude Code workflows','Workflows de Claude Code'],['03','Multi-Agent Research','Coordinator + provenance','Coordinator + provenance'],['04','Developer Productivity','Codebase exploration + tools','Exploración + herramientas'],['05','Claude Code CI','Automation + review','Automatización + revisión'],['06','Structured Extraction','Schemas + validation','Schemas + validación']],
    ruleES:'Aprende por dominio; practica por escenario.',ruleEN:'Learn by domain; practise by scenario.',
    trapES:'Asociar un concepto a un solo escenario y no reconocerlo cuando cambia el contexto narrativo.',trapEN:'Associating a concept with one scenario and failing to recognize it when the narrative context changes.',
    question:'A question describes a refund workflow but the real issue is ambiguous tool descriptions. Which domain should drive the reasoning?',options:['Only customer support','Tool Design & MCP Integration','Only Context Management','Claude Code CI/CD'],answer:1,
    answerES:'El escenario es Customer Support, pero el problema técnico subyacente pertenece a Tool Design.',answerEN:'The scenario is Customer Support, but the underlying technical problem belongs to Tool Design.'
  },
  {
    id:'plan', group:'Exam practice / Práctica', title:'14-day sprint / Sprint de 14 días', short:'14-day plan', image:'assets/plan.svg', candidate:true, official:true,
    heroES:'14 días para cubrir. 24 días para convertir conocimiento en rendimiento.',heroEN:'14 days to cover. 24 days to convert knowledge into performance.',
    introES:'El objetivo no es terminar teoría el día previo al examen. Cerramos adquisición de contenido el 12 de octubre y reservamos el resto para retrieval practice, preguntas mezcladas, labs y simulacros completos.',
    introEN:'The goal is not to finish theory the day before the exam. We close content acquisition by October 12 and reserve the remaining time for retrieval practice, mixed questions, labs, and full mock exams.',
    concepts:[], ruleES:'Cada bloque termina con active recall o teach-back; leer no cuenta como dominio.',ruleEN:'Every block ends with active recall or teach-back; reading does not count as mastery.',
    trapES:'Confundir horas de estudio con aprendizaje. Mediremos decisiones correctas bajo presión.',trapEN:'Confusing study hours with learning. We measure correct decisions under pressure.',
    question:'What is the primary purpose of the post-bootcamp phase?',options:['Read the same documentation again','Practise retrieval, scenario recognition, distractor analysis, and timing','Add unrelated AI topics','Memorize every API parameter'],answer:1,
    answerES:'La fase posterior convierte conocimiento declarativo en desempeño de examen.',answerEN:'The later phase converts declarative knowledge into exam performance.'
  }
];

const groupsOrder = ['Start here / Inicio','Domain 1 · 27%','Domain 2 · 18%','Domain 3 · 20%','Domain 4 · 20%','Domain 5 · 15%','Exam practice / Práctica'];
const state = {
  current: localStorage.getItem('ccarf-current') || 'overview',
  lang: localStorage.getItem('ccarf-lang') || 'bi',
  completed: JSON.parse(localStorage.getItem('ccarf-completed') || '{}'),
  timer:null, seconds:1500
};

const officialSources = [
  ['Tool use overview','https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview'],
  ['How tool use works','https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works'],
  ['Stop reasons','https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons'],
  ['Handle tool calls','https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls'],
  ['Claude Code subagents','https://code.claude.com/docs/en/sub-agents'],
  ['Claude Code hooks','https://code.claude.com/docs/en/hooks'],
  ['Claude Code memory / CLAUDE.md','https://code.claude.com/docs/en/memory'],
  ['Claude Code MCP','https://code.claude.com/docs/en/mcp'],
  ['Claude Code CLI reference','https://code.claude.com/docs/en/cli-reference'],
  ['Structured outputs','https://platform.claude.com/docs/en/build-with-claude/structured-outputs'],
  ['Message Batches API','https://platform.claude.com/docs/en/api/messages/batches']
];

function byId(id){return document.getElementById(id)}
function applyLang(){
  document.body.classList.remove('lang-es','lang-en','lang-bi');
  document.body.classList.add('lang-'+state.lang);
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===state.lang));
}
function renderNav(filter=''){
  const nav=byId('lessonNav'); nav.innerHTML='';
  groupsOrder.forEach(group=>{
    const items=lessons.filter(x=>x.group===group && (x.title+' '+x.short).toLowerCase().includes(filter.toLowerCase()));
    if(!items.length) return;
    const sec=document.createElement('div');sec.className='nav-section';
    sec.innerHTML=`<div class="nav-label">${group}</div>`;
    items.forEach(l=>{
      const btn=document.createElement('button');
      btn.className='nav-item '+(l.id===state.current?'active ':'')+(state.completed[l.id]?'done':'');
      btn.innerHTML=`<span class="nav-dot"></span><span>${l.short}</span>`;
      btn.onclick=()=>{state.current=l.id;localStorage.setItem('ccarf-current',l.id);render();document.querySelector('.sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'})};
      sec.appendChild(btn);
    }); nav.appendChild(sec);
  });
}
function conceptsHTML(l){
  if(!l.concepts.length) return '';
  return `<section class="section"><h3>Concept map / Mapa conceptual</h3><div class="card-grid">${l.concepts.map(c=>`<article class="concept-card"><div class="num">${c[0]}</div><h4>${c[1]}</h4><p class="en-only">${c[2]}</p><p class="es-only">${c[3]}</p></article>`).join('')}</div></section>`;
}
function roadmapHTML(){
  const rows=[['Day 1','Foundation map + cold diagnostic','Base + diagnóstico'],['Days 2–4','Domain 1 · Agentic Architecture','Domain 1 · Arquitectura agéntica'],['Days 5–6','Domain 2 · Tools & MCP','Domain 2 · Tools + MCP'],['Days 7–8','Domain 3 · Claude Code','Domain 3 · Claude Code'],['Days 9–10','Domain 4 · Prompt + Structured Output','Domain 4 · Prompt + salida estructurada'],['Days 11–12','Domain 5 · Context & Reliability','Domain 5 · Contexto + confiabilidad'],['Day 13','Integrated build','Proyecto integrador'],['Day 14','60-question timed mock','Simulacro cronometrado']];
  return `<section class="section"><h3>Bootcamp schedule / Calendario</h3><div class="roadmap">${rows.map((r,i)=>`<div class="roadmap-row"><div class="roadmap-day">${r[0]}</div><div><div class="roadmap-title en-only">${r[1]}</div><div class="roadmap-title es-only">${r[2]}</div></div><span class="weight">${i<6?'Learn':'Apply'}</span></div>`).join('')}</div></section>`;
}
function scenariosHTML(){
  const s=[
    ['Customer Support Resolution Agent','D1 · D2 · D5','Agent SDK, MCP tools, escalation, high-stakes workflow rules.'],
    ['Code Generation with Claude Code','D3 · D5','CLAUDE.md, rules, plan/direct execution, context.'],
    ['Multi-Agent Research System','D1 · D2 · D5','Coordinator, subagents, context passing, provenance.'],
    ['Developer Productivity with Claude','D1 · D2 · D3','Codebase exploration, built-in tools, MCP.'],
    ['Claude Code for Continuous Integration','D3 · D4','Non-interactive workflows, structured output, review.'],
    ['Structured Data Extraction','D4 · D5','Schemas, validation, retries, reliability.']
  ];
  return `<section class="section"><h3>Scenario bank / Banco de escenarios</h3><p class="section-lead es-only">Para practicar: identifica primero el problema técnico oculto, no el nombre del escenario.</p><p class="section-lead en-only">For practice: identify the hidden technical problem first, not the scenario name.</p><div class="scenario-grid">${s.map(x=>`<article class="scenario"><h4>${x[0]}</h4><p>${x[2]}</p><div class="chips"><span class="chip">${x[1]}</span></div></article>`).join('')}</div></section>`;
}
function sourcesHTML(l){
  return `<section class="section"><h3>Sources / Fuentes</h3><p class="section-lead es-only">Los insights de examen provienen de las notas del candidato que compartiste. La mecánica técnica se contrasta con documentación oficial de Anthropic.</p><p class="section-lead en-only">Exam insights come from the passed-candidate notes you provided. Technical mechanics are cross-checked against official Anthropic documentation.</p><div class="source-list">${officialSources.slice(0,l.id==='d1-loop'?4:officialSources.length).map(s=>`<div class="source-link"><a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a><span>Anthropic official ↗</span></div>`).join('')}</div></section>`;
}
function render(){
  const l=lessons.find(x=>x.id===state.current) || lessons[0];
  byId('pageTitle').textContent=l.short;
  const badges=`<div class="source-badges">${l.candidate?'<span class="badge candidate">Candidate insight</span>':''}${l.official?'<span class="badge official">Anthropic official</span>':''}</div>`;
  const quiz=`<section class="section"><h3>Quick check / Comprobación rápida</h3><div class="exam-box" data-answer="${l.answer}"><div class="question">${l.question}</div>${l.options.map((o,i)=>`<button class="option" data-i="${i}"><strong>${String.fromCharCode(65+i)}.</strong> ${o}</button>`).join('')}<div class="answer-explain"><p class="es-only"><strong>Explicación:</strong> ${l.answerES}</p><p class="en-only"><strong>Explanation:</strong> ${l.answerEN}</p></div></div></section>`;
  byId('content').innerHTML=`
    <section class="hero">
      <div class="hero-copy"><span class="kicker">${l.group}</span><h2 class="es-only">${l.heroES}</h2><h2 class="en-only">${l.heroEN}</h2><p class="es-only">${l.introES}</p><p class="en-only">${l.introEN}</p></div>
      <figure class="hero-visual"><img src="${l.image}" alt="Visual explanation for ${l.title}"/><figcaption class="visual-caption es-only">Visual de retención: usa la imagen para reconstruir el concepto sin leer tus notas.</figcaption><figcaption class="visual-caption en-only">Retention visual: use the image to reconstruct the concept without reading your notes.</figcaption></figure>
    </section>
    <div class="toolbar-card"><label class="complete-toggle"><input id="completeCheck" type="checkbox" ${state.completed[l.id]?'checked':''}/><span class="es-only">Marcar como dominado</span><span class="en-only">Mark as mastered</span></label>${badges}</div>
    ${conceptsHTML(l)}
    <section class="section bilingual-grid"><article class="lang-card es-only"><div class="lang-label">Regla mental · ES</div><p><strong>${l.ruleES}</strong></p></article><article class="lang-card en-only"><div class="lang-label">Mental rule · EN</div><p><strong>${l.ruleEN}</strong></p></article></section>
    <div class="callout trap"><strong>⚠ Exam trap</strong><p class="es-only">${l.trapES}</p><p class="en-only">${l.trapEN}</p></div>
    ${l.id==='d1-loop'?agentLoopDeepDive():''}
    ${l.id==='scenarios'?scenariosHTML():''}
    ${l.id==='plan'?roadmapHTML():''}
    ${quiz}
    ${sourcesHTML(l)}
  `;
  byId('completeCheck').onchange=e=>{state.completed[l.id]=e.target.checked;localStorage.setItem('ccarf-completed',JSON.stringify(state.completed));renderNav(byId('searchInput').value);updateProgress()};
  document.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>handleQuiz(btn));
  applyLang();renderNav(byId('searchInput').value);updateProgress();
}
function agentLoopDeepDive(){
  return `<section class="section"><h3>Lifecycle / Ciclo de vida</h3><div class="bilingual-grid"><article class="lang-card es-only"><div class="lang-label">ES</div><p><strong>1.</strong> Envías messages + tools a Claude.</p><p><strong>2.</strong> Claude devuelve <code>stop_reason: "tool_use"</code> y uno o más bloques <code>tool_use</code>.</p><p><strong>3.</strong> Tu aplicación ejecuta las client tools.</p><p><strong>4.</strong> Devuelves los resultados como <code>tool_result</code> dentro del historial.</p><p><strong>5.</strong> Repites mientras Claude siga pidiendo herramientas.</p></article><article class="lang-card en-only"><div class="lang-label">EN</div><p><strong>1.</strong> Send messages + tools to Claude.</p><p><strong>2.</strong> Claude returns <code>stop_reason: "tool_use"</code> plus one or more <code>tool_use</code> blocks.</p><p><strong>3.</strong> Your application executes client tools.</p><p><strong>4.</strong> Return results as <code>tool_result</code> blocks in conversation history.</p><p><strong>5.</strong> Repeat while Claude continues requesting tools.</p></article></div><pre>response = send(messages)\nwhile response.stop_reason == "tool_use":\n    calls = extract_tool_calls(response)\n    results = execute(calls)\n    messages += [response, tool_results(results)]\n    response = send(messages)\n\nhandle_final_or_other_stop_reason(response)</pre><div class="callout rule"><strong>Production note</strong><p class="es-only">La documentación actual también contempla otros stop reasons como <code>pause_turn</code>, <code>max_tokens</code>, <code>refusal</code> y <code>model_context_window_exceeded</code>. El examen insight sigue siendo: controla el lifecycle con señales estructuradas.</p><p class="en-only">Current docs also include stop reasons such as <code>pause_turn</code>, <code>max_tokens</code>, <code>refusal</code>, and <code>model_context_window_exceeded</code>. The exam insight remains: control lifecycle with structured signals.</p></div></section>`;
}
function handleQuiz(btn){
  const box=btn.closest('.exam-box');const answer=Number(box.dataset.answer);const i=Number(btn.dataset.i);
  box.querySelectorAll('.option').forEach((b,j)=>{b.disabled=true;if(j===answer)b.classList.add('correct');else if(j===i)b.classList.add('wrong')});
  box.querySelector('.answer-explain').classList.add('show');
}
function updateProgress(){const n=lessons.filter(x=>state.completed[x.id]).length;const p=Math.round(n/lessons.length*100);byId('progressBar').style.width=p+'%';byId('progressText').textContent=p+'%'}
function toggleTimer(){
  const b=byId('focusBtn');
  if(state.timer){clearInterval(state.timer);state.timer=null;b.classList.remove('running');b.textContent=formatTime(state.seconds)+' · Focus';return}
  if(state.seconds<=0)state.seconds=1500;b.classList.add('running');
  state.timer=setInterval(()=>{state.seconds--;b.textContent=formatTime(state.seconds)+' · Focus';if(state.seconds<=0){clearInterval(state.timer);state.timer=null;b.classList.remove('running');b.textContent='25:00 · Focus';showToast('Focus block complete / Bloque completado');state.seconds=1500}},1000)
}
function formatTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function showToast(t){const x=byId('timerToast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),4000)}

document.querySelectorAll('.lang-btn').forEach(b=>b.onclick=()=>{state.lang=b.dataset.lang;localStorage.setItem('ccarf-lang',state.lang);applyLang()});
byId('searchInput').oninput=e=>renderNav(e.target.value);
byId('focusBtn').onclick=toggleTimer;
byId('menuBtn').onclick=()=>byId('sidebar').classList.toggle('open');
byId('resetBtn').onclick=()=>{if(confirm('Reset study progress?')){state.completed={};localStorage.removeItem('ccarf-completed');render()}};
applyLang();render();
