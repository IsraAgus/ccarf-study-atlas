(() => {
  const S = {
    effectiveAgents: ["Anthropic Engineering — Building effective agents", "https://www.anthropic.com/engineering/building-effective-agents"],
    agentSdk: ["Claude Agent SDK — Overview", "https://code.claude.com/docs/en/agent-sdk/overview"],
    codeOverview: ["Claude Code — Overview", "https://code.claude.com/docs/en/overview"],
    toolOverview: ["Claude Platform — Tool use overview", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"],
    toolLoop: ["Claude Platform — How tool use works", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works"],
    toolCalls: ["Claude Platform — Handle tool calls", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls"],
    stopReasons: ["Claude Platform — Stop reasons and fallback", "https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons"],
    defineTools: ["Claude Platform — Define tools", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools"],
    strictTools: ["Claude Platform — Strict tool use", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use"],
    subagents: ["Claude Code — Subagents", "https://code.claude.com/docs/en/sub-agents"],
    hooks: ["Claude Code — Hooks reference", "https://code.claude.com/docs/en/hooks"],
    mcp: ["Claude Code — MCP", "https://code.claude.com/docs/en/mcp"],
    mcpConnector: ["Claude Platform — MCP connector", "https://platform.claude.com/docs/en/agents-and-tools/mcp-connector"],
    memory: ["Claude Code — Memory / CLAUDE.md", "https://code.claude.com/docs/en/memory"],
    skills: ["Claude Code — Skills", "https://code.claude.com/docs/en/skills"],
    workflows: ["Claude Code — Common workflows", "https://code.claude.com/docs/en/common-workflows"],
    cli: ["Claude Code — CLI reference", "https://code.claude.com/docs/en/cli-reference"],
    prompt: ["Claude Platform — Prompting best practices", "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"],
    structured: ["Claude Platform — Structured outputs", "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"],
    context: ["Claude Platform — Context windows", "https://platform.claude.com/docs/en/build-with-claude/context-windows"],
    contextEditing: ["Claude Platform — Context editing", "https://platform.claude.com/docs/en/build-with-claude/context-editing"],
    compaction: ["Claude Platform — Compaction", "https://platform.claude.com/docs/en/build-with-claude/compaction"],
    citations: ["Claude Platform — Citations", "https://platform.claude.com/docs/en/build-with-claude/citations"]
  };

  const section = (titleES,titleEN,bodyES,bodyEN,bulletsES=[],bulletsEN=[],sources=[]) => ({
    titleES,titleEN,bodyES,bodyEN,bulletsES,bulletsEN,sources
  });

  window.CCARF_OFFICIAL_THEORY = {
    foundations: {
      leadES:"Este mapa separa las superficies oficiales de Anthropic que el examen mezcla en los escenarios. La diferencia principal no es “qué tan inteligente es Claude”, sino qué capa ejecuta el trabajo, qué herramientas controla y dónde vive la orquestación.",
      leadEN:"This map separates the official Anthropic surfaces that the exam mixes inside scenarios. The main distinction is not “how smart Claude is,” but which layer executes the work, which tools it controls, and where orchestration lives.",
      sections:[
        section(
          "Claude API / Messages API","Claude API / Messages API",
          [
            "La Claude API es la capa de bajo nivel para enviar mensajes al modelo y combinar capacidades como tool use, structured outputs, citations, files y context management. En tool use, la aplicación envía definiciones de herramientas junto con los mensajes; Claude decide si debe invocarlas según la solicitud y sus descripciones.",
            "Cuando la herramienta es client-side, Claude devuelve un bloque estructurado <code>tool_use</code>; tu aplicación ejecuta la función y devuelve un <code>tool_result</code>. Con server tools, la ejecución ocurre en infraestructura de Anthropic y el resultado puede regresar dentro de la misma interacción."
          ],
          [
            "The Claude API is the low-level surface for sending messages to the model and combining capabilities such as tool use, structured outputs, citations, files, and context management. With tool use, the application sends tool definitions alongside messages; Claude decides whether to invoke them from the user request and tool descriptions.",
            "For client-side tools, Claude returns a structured <code>tool_use</code> block; your application executes the function and returns a <code>tool_result</code>. Server tools execute on Anthropic infrastructure and their results can be returned within the interaction."
          ],[],[],[S.toolOverview]
        ),
        section(
          "Claude Code","Claude Code",
          [
            "Claude Code es una herramienta de coding agéntico. Puede leer el codebase, editar archivos, ejecutar comandos y conectarse a herramientas externas. Anthropic lo describe como un entorno que puede planear cambios, trabajar en múltiples archivos, ejecutar verificación y operar desde terminal, IDE, app o navegador.",
            "Claude Code agrega superficies propias de configuración: <code>CLAUDE.md</code>, rules, skills, hooks, permisos, sesiones, subagents y MCP. Por eso una pregunta de Claude Code puede parecerse a una pregunta de API, pero la respuesta correcta depende de esas primitivas específicas."
          ],
          [
            "Claude Code is an agentic coding tool. It can read a codebase, edit files, run commands, and connect to external tools. Anthropic describes it as an environment that can plan changes, work across multiple files, run verification, and operate from terminal, IDE, app, or browser.",
            "Claude Code adds its own configuration surfaces: <code>CLAUDE.md</code>, rules, skills, hooks, permissions, sessions, subagents, and MCP. That is why a Claude Code question can look like an API question while requiring a Claude Code-specific primitive."
          ],[],[],[S.codeOverview]
        ),
        section(
          "Claude Agent SDK","Claude Agent SDK",
          [
            "Anthropic define un agente en el SDK como una aplicación que completa una tarea planificando sus propios pasos y llamando herramientas. El Agent SDK expone programáticamente en Python y TypeScript el mismo agent loop, toolset y context management que impulsan Claude Code.",
            "La diferencia práctica es de integración: Claude Code es la interfaz de uso directo; el Agent SDK permite incrustar esas capacidades dentro de una aplicación propia, con control sobre tools, permisos, sesiones, hooks y orquestación."
          ],
          [
            "Anthropic defines an SDK agent as an application that completes a task by planning its own steps and calling tools. The Agent SDK exposes, programmatically in Python and TypeScript, the same agent loop, toolset, and context management that power Claude Code.",
            "The practical difference is integration: Claude Code is the direct-use interface; the Agent SDK embeds those capabilities inside your own application, with control over tools, permissions, sessions, hooks, and orchestration."
          ],[],[],[S.agentSdk]
        ),
        section(
          "MCP","MCP",
          [
            "Model Context Protocol es el mecanismo estándar que Anthropic usa para conectar Claude con herramientas y fuentes externas. En Claude Code, los servidores MCP pueden configurarse con diferentes scopes; en la API, el MCP connector puede conectarse a servidores remotos sin que tu aplicación implemente un cliente MCP separado.",
            "MCP no reemplaza al modelo ni al agent loop: expone capacidades. El cliente o harness sigue decidiendo cómo incorporar esas capacidades a la experiencia y qué permisos aplicar."
          ],
          [
            "Model Context Protocol is the standard mechanism Anthropic uses to connect Claude with external tools and data sources. In Claude Code, MCP servers can be configured at different scopes; in the API, the MCP connector can connect to remote MCP servers without your application implementing a separate MCP client.",
            "MCP does not replace the model or agent loop: it exposes capabilities. The client or harness still decides how those capabilities are integrated and which permissions apply."
          ],[],[],[S.mcp,S.mcpConnector]
        )
      ]
    },

    "d1-loop": {
      leadES:"El agentic loop es la mecánica que conecta razonamiento, herramientas y feedback del entorno. Para CCAR-F debes entender el ciclo como un protocolo de estado, no como una conversación informal.",
      leadEN:"The agentic loop is the mechanism connecting reasoning, tools, and environmental feedback. For CCAR-F, understand it as a state protocol, not as an informal conversation.",
      sections:[
        section(
          "1. El ciclo de una client tool","1. Client-tool round trip",
          [
            "Tu aplicación envía <code>messages</code> y definiciones de tools. Si Claude necesita una client tool, la respuesta contiene uno o más bloques <code>tool_use</code> y normalmente <code>stop_reason: \"tool_use\"</code>. Tu código ejecuta la operación fuera de Anthropic y devuelve el resultado en un mensaje <code>user</code> con un bloque <code>tool_result</code> cuyo <code>tool_use_id</code> coincide con la llamada original.",
            "Ese resultado entra al contexto del siguiente turno. Claude puede entonces interpretar el output de la tool, decidir si necesita otra herramienta o producir una respuesta final."
          ],
          [
            "Your application sends <code>messages</code> and tool definitions. When Claude needs a client tool, the response contains one or more <code>tool_use</code> blocks and normally <code>stop_reason: \"tool_use\"</code>. Your code executes the operation outside Anthropic and returns the result in a <code>user</code> message containing a <code>tool_result</code> whose <code>tool_use_id</code> matches the original call.",
            "That result becomes context for the next turn. Claude can then interpret the tool output, decide whether another tool is needed, or produce a final response."
          ],[],[],[S.toolOverview,S.toolCalls]
        ),
        section(
          "2. <code>stop_reason</code> es estado estructurado","2. <code>stop_reason</code> is structured state",
          [
            "Toda respuesta exitosa de Messages API incluye <code>stop_reason</code>. Anthropic lo define como la razón por la que Claude terminó esa generación. <code>end_turn</code> significa terminación natural; <code>tool_use</code> significa que Claude está esperando que ejecutes una client tool; <code>pause_turn</code> puede aparecer cuando un loop de server tools alcanza su límite de iteraciones y debe continuarse.",
            "También existen estados como <code>max_tokens</code>, <code>refusal</code> y <code>model_context_window_exceeded</code>. Por tanto, una implementación robusta no trata todos los finales de generación como equivalentes."
          ],
          [
            "Every successful Messages API response includes <code>stop_reason</code>. Anthropic defines it as the reason Claude finished that generation. <code>end_turn</code> means natural completion; <code>tool_use</code> means Claude is waiting for you to execute a client tool; <code>pause_turn</code> can appear when a server-tool loop reaches its iteration limit and must be continued.",
            "Other states include <code>max_tokens</code>, <code>refusal</code>, and <code>model_context_window_exceeded</code>. A robust implementation therefore does not treat every generation stop as equivalent."
          ],[],[],[S.stopReasons]
        ),
        section(
          "3. Client tools vs server tools","3. Client tools vs server tools",
          [
            "La diferencia principal es dónde corre el código. Las client tools —incluyendo funciones que defines tú— se ejecutan en tu aplicación. Las server tools, como ciertas herramientas de búsqueda o ejecución proporcionadas por Anthropic, se ejecutan en infraestructura de Anthropic.",
            "Esta diferencia cambia quién debe devolver resultados. Con client tools, tu harness debe ejecutar y enviar <code>tool_result</code>. Con server tools, Anthropic administra la ejecución; tu aplicación sigue teniendo que manejar estados como <code>pause_turn</code> cuando corresponda."
          ],
          [
            "The main difference is where code runs. Client tools—including functions you define—run in your application. Server tools, such as certain Anthropic-provided search or execution tools, run on Anthropic infrastructure.",
            "This changes who returns results. With client tools, your harness must execute and send <code>tool_result</code>. With server tools, Anthropic manages execution; your application still needs to handle states such as <code>pause_turn</code> when applicable."
          ],[],[],[S.toolOverview,S.stopReasons]
        )
      ]
    },

    "d1-orchestration": {
      leadES:"Anthropic separa dos ideas relacionadas: workflows con topología programada y agentes que deciden dinámicamente cómo avanzar. Subagents y orchestrator-workers sirven para aislar trabajo, especializar instrucciones y controlar el contexto.",
      leadEN:"Anthropic separates two related ideas: workflows with programmed topology and agents that dynamically decide how to proceed. Subagents and orchestrator-workers isolate work, specialize instructions, and control context.",
      sections:[
        section(
          "1. Workflow fijo vs descomposición dinámica","1. Fixed workflow vs dynamic decomposition",
          [
            "En <em>Building effective agents</em>, Anthropic define workflows como sistemas donde LLMs y tools siguen paths predefinidos, mientras que los agents dirigen dinámicamente su proceso y uso de herramientas. Prompt chaining encaja cuando una tarea puede descomponerse limpiamente en subtareas fijas.",
            "El patrón orchestrator-workers es distinto: un LLM central descompone dinámicamente la tarea, delega a workers y sintetiza resultados. Anthropic lo recomienda cuando no puedes predecir por adelantado qué subtareas harán falta."
          ],
          [
            "In <em>Building effective agents</em>, Anthropic defines workflows as systems where LLMs and tools follow predefined paths, while agents dynamically direct their own process and tool usage. Prompt chaining fits tasks that can be cleanly decomposed into fixed subtasks.",
            "The orchestrator-workers pattern is different: a central LLM dynamically breaks down the task, delegates to workers, and synthesizes results. Anthropic recommends it when the required subtasks cannot be predicted in advance."
          ],[],[],[S.effectiveAgents]
        ),
        section(
          "2. Aislamiento de contexto","2. Context isolation",
          [
            "Claude Code documenta que cada subagent corre en su propia context window, con system prompt, herramientas y permisos propios. Esto evita que búsquedas grandes, logs o lecturas de archivos saturen la conversación principal.",
            "La consecuencia práctica es que un subagent no debe tratarse como si compartiera automáticamente todo el historial del agente principal. El task que se le delega debe contener la información necesaria o permitirle obtenerla con sus herramientas."
          ],
          [
            "Claude Code documents that each subagent runs in its own context window with its own system prompt, tools, and permissions. This prevents large searches, logs, or file reads from flooding the main conversation.",
            "The practical consequence is that a subagent should not be treated as if it automatically shared the main agent's full history. The delegated task must contain the necessary information or give the subagent tools to obtain it."
          ],[],[],[S.subagents]
        ),
        section(
          "3. Paralelización","3. Parallelization",
          [
            "Anthropic distingue <em>sectioning</em> —dividir en subtareas independientes que corren en paralelo— y <em>voting</em> —ejecutar varias veces una tarea para obtener perspectivas o intentos diversos. El beneficio aparece cuando las subtareas son independientes o cuando múltiples perspectivas aumentan la confianza.",
            "No toda tarea debe paralelizarse: si hay dependencias, shared state u orden obligatorio, la orquestación debe preservar esas restricciones."
          ],
          [
            "Anthropic distinguishes <em>sectioning</em>—splitting work into independent subtasks run in parallel—from <em>voting</em>—running the same task multiple times for diverse perspectives or attempts. The benefit appears when subtasks are independent or multiple perspectives increase confidence.",
            "Not every task should be parallelized: dependencies, shared state, or required ordering must still be preserved by the orchestration."
          ],[],[],[S.effectiveAgents]
        )
      ]
    },

    "d1-enforcement": {
      leadES:"En Claude Code, instrucciones y enforcement son capas distintas. <code>CLAUDE.md</code> entra al contexto y guía; hooks y permission decisions pueden intervenir programáticamente antes de una acción.",
      leadEN:"In Claude Code, instructions and enforcement are different layers. <code>CLAUDE.md</code> enters context and guides behavior; hooks and permission decisions can intervene programmatically before an action.",
      sections:[
        section(
          "1. Guidance no es enforcement","1. Guidance is not enforcement",
          [
            "Anthropic describe <code>CLAUDE.md</code> como contexto cargado al inicio de la sesión. La propia documentación aclara que son instrucciones en contexto, no configuración enforced. Su redacción afecta qué tan confiablemente Claude las sigue.",
            "Por eso una regla crítica que deba bloquear físicamente una acción necesita una capa diferente a la simple instrucción textual."
          ],
          [
            "Anthropic describes <code>CLAUDE.md</code> as context loaded at the start of the session. The documentation explicitly notes that these are contextual instructions, not enforced configuration. How they are written affects how reliably Claude follows them.",
            "Therefore, a critical rule that must physically block an action needs a different layer than text guidance alone."
          ],[],[],[S.memory]
        ),
        section(
          "2. PreToolUse","2. PreToolUse",
          [
            "Los hooks de Claude Code permiten ejecutar lógica en puntos concretos del lifecycle. <code>PreToolUse</code> ocurre antes de procesar una llamada a herramienta y puede influir o bloquear la ejecución.",
            "Cuando varios hooks producen decisiones diferentes, Anthropic documenta la precedencia <code>deny &gt; defer &gt; ask &gt; allow</code>. Una decisión <code>deny</code> puede devolver una razón a Claude y, opcionalmente, interrumpir la ejecución."
          ],
          [
            "Claude Code hooks let you run logic at specific lifecycle points. <code>PreToolUse</code> runs before a tool call is processed and can influence or block execution.",
            "When multiple hooks return different decisions, Anthropic documents the precedence <code>deny &gt; defer &gt; ask &gt; allow</code>. A <code>deny</code> decision can return a reason to Claude and can optionally interrupt execution."
          ],[],[],[S.hooks]
        ),
        section(
          "3. Gate programático","3. Programmatic gate",
          [
            "El patrón general es separar la decisión del modelo del permiso efectivo de ejecución. El modelo puede proponer una acción; la aplicación, hook o permission layer puede validar precondiciones antes de permitirla.",
            "Esto también mejora observabilidad: la aplicación sabe si una acción fue permitida, denegada o diferida, en vez de inferir si una instrucción fue respetada."
          ],
          [
            "The general pattern is to separate the model's decision from effective execution permission. The model may propose an action; the application, hook, or permission layer can validate prerequisites before allowing it.",
            "This also improves observability: the application knows whether an action was allowed, denied, or deferred rather than inferring whether an instruction was obeyed."
          ],[],[],[S.hooks,S.memory]
        )
      ]
    },

    "d2-tools": {
      leadES:"Para Anthropic, una tool no es sólo una función: su definición es una interfaz que el modelo debe entender correctamente. Nombre, description, parámetros y schema forman parte del contrato.",
      leadEN:"For Anthropic, a tool is not just a function: its definition is an interface the model must understand correctly. Name, description, parameters, and schema are part of the contract.",
      sections:[
        section(
          "1. Selección de tools","1. Tool selection",
          [
            "Claude decide cuándo llamar una herramienta a partir de la solicitud del usuario y de la descripción de la tool. Una descripción ambigua hace más difícil que el modelo diferencie capacidades parecidas.",
            "Anthropic recomienda tratar la definición de tools con la misma atención de prompt engineering que el prompt general: propósito claro, ejemplos o edge cases cuando ayuden, requisitos de input y límites claros frente a otras tools."
          ],
          [
            "Claude decides when to call a tool from the user's request and the tool's description. An ambiguous description makes it harder for the model to distinguish similar capabilities.",
            "Anthropic recommends treating tool definitions with the same prompt-engineering attention as the overall prompt: clear purpose, examples or edge cases when useful, input requirements, and clear boundaries from other tools."
          ],[],[],[S.toolOverview,S.effectiveAgents,S.defineTools]
        ),
        section(
          "2. Inputs estructurados","2. Structured inputs",
          [
            "Las custom tools declaran un <code>input_schema</code>. Ese schema define qué argumentos espera la aplicación. Con strict tool use, Anthropic puede garantizar la validación del nombre y los inputs de la herramienta contra el schema soportado.",
            "Esto resuelve una clase concreta de error: argumentos malformados o incompatibles con el contrato. No sustituye la lógica de negocio que decide si la llamada era apropiada."
          ],
          [
            "Custom tools declare an <code>input_schema</code>. That schema defines what arguments the application expects. With strict tool use, Anthropic can guarantee validation of the tool name and inputs against the supported schema.",
            "This solves a specific class of error: malformed arguments or inputs incompatible with the contract. It does not replace the business logic that determines whether the call was appropriate."
          ],[],[],[S.strictTools,S.structured]
        ),
        section(
          "3. Resultados y errores","3. Results and errors",
          [
            "Después de una client tool, el resultado debe volver a Claude como <code>tool_result</code>. La documentación de Anthropic permite marcar un resultado como error para que Claude pueda razonar sobre recovery.",
            "Un error de ejecución y un resultado exitoso vacío no significan lo mismo. Preservar esa diferencia le da al modelo información útil para decidir si reintenta, cambia de estrategia o continúa."
          ],
          [
            "After a client tool runs, its output must return to Claude as a <code>tool_result</code>. Anthropic's tool-call documentation supports marking a tool result as an error so Claude can reason about recovery.",
            "An execution failure and a successful empty result do not mean the same thing. Preserving that distinction gives the model useful information for deciding whether to retry, change strategy, or continue."
          ],[],[],[S.toolCalls]
        )
      ]
    },

    "d2-mcp": {
      leadES:"MCP organiza integraciones externas mediante servidores y tools, y Claude Code añade scopes para controlar dónde se carga una configuración y si se comparte con el equipo.",
      leadEN:"MCP organizes external integrations through servers and tools, and Claude Code adds scopes controlling where configuration loads and whether it is shared with the team.",
      sections:[
        section(
          "1. Qué aporta MCP","1. What MCP provides",
          [
            "MCP permite a Claude Code y a la Claude API conectarse con servicios externos mediante un contrato estándar. Un servidor puede exponer tools y otras capacidades; el cliente decide cuáles habilitar y bajo qué permisos.",
            "En la API, el MCP connector permite conectarse directamente a servidores MCP remotos sin implementar un cliente MCP separado. La configuración incluye la definición del servidor y el toolset habilitado."
          ],
          [
            "MCP lets Claude Code and the Claude API connect to external services through a standard contract. A server can expose tools and other capabilities; the client decides which are enabled and under what permissions.",
            "In the API, the MCP connector can connect directly to remote MCP servers without implementing a separate MCP client. Configuration includes the server definition and enabled toolset."
          ],[],[],[S.mcp,S.mcpConnector]
        ),
        section(
          "2. Scopes en Claude Code","2. Claude Code scopes",
          [
            "Claude Code documenta tres scopes de MCP. <strong>Local</strong>: sólo el proyecto actual, privado para ti y almacenado en <code>~/.claude.json</code> bajo ese proyecto. <strong>Project</strong>: sólo el proyecto actual, compartido con el equipo mediante <code>.mcp.json</code> en la raíz. <strong>User</strong>: todos tus proyectos, privado para tu usuario.",
            "Para nombres duplicados, la precedencia documentada es local, luego project, luego user. Esto permite, por ejemplo, sobrescribir localmente una definición compartida sin modificar el archivo versionado."
          ],
          [
            "Claude Code documents three MCP scopes. <strong>Local</strong>: current project only, private to you, stored in <code>~/.claude.json</code> under that project. <strong>Project</strong>: current project only, shared with the team through root-level <code>.mcp.json</code>. <strong>User</strong>: all your projects, private to your user.",
            "For duplicate names, documented precedence is local, then project, then user. This allows a developer, for example, to locally override a shared definition without changing the version-controlled file."
          ],[],[],[S.mcp]
        ),
        section(
          "3. Configuración compartida","3. Shared configuration",
          [
            "Anthropic indica que los project-scoped servers deben almacenarse en <code>.mcp.json</code> y versionarse para que el equipo reciba las mismas tools y servicios.",
            "Los datos específicos de cada máquina o secretos no deben confundirse con la parte compartida del contrato. El scope y la configuración deben elegirse según quién necesita la integración y si debe viajar con el repositorio."
          ],
          [
            "Anthropic states that project-scoped servers are stored in <code>.mcp.json</code> and can be checked into version control so the team receives the same tools and services.",
            "Machine-specific data or secrets should not be confused with the shared part of the contract. Scope and configuration should be chosen according to who needs the integration and whether it should travel with the repository."
          ],[],[],[S.mcp]
        )
      ]
    },

    "d3-code": {
      leadES:"Claude Code tiene varias superficies de instrucciones. La decisión correcta depende de alcance, persistencia y momento de carga.",
      leadEN:"Claude Code has several instruction surfaces. The correct choice depends on scope, persistence, and when the content should load.",
      sections:[
        section(
          "1. <code>CLAUDE.md</code> y memoria de proyecto","1. <code>CLAUDE.md</code> and project memory",
          [
            "<code>CLAUDE.md</code> se carga al inicio de cada sesión y consume context window. Anthropic recomienda instrucciones específicas, concisas y bien estructuradas; la documentación actual sugiere apuntar a menos de 200 líneas por archivo.",
            "Los archivos descubiertos a lo largo del árbol de directorios se concatenan en contexto. <code>CLAUDE.local.md</code> permite notas personales específicas del proyecto y se carga después del <code>CLAUDE.md</code> del mismo nivel."
          ],
          [
            "<code>CLAUDE.md</code> loads at the start of every session and consumes context-window tokens. Anthropic recommends specific, concise, well-structured instructions; current docs suggest targeting under 200 lines per file.",
            "Files discovered along the directory tree are concatenated into context. <code>CLAUDE.local.md</code> supports personal project-specific notes and loads after the same-level <code>CLAUDE.md</code>."
          ],[],[],[S.memory]
        ),
        section(
          "2. Path-specific rules","2. Path-specific rules",
          [
            "Las reglas dentro de <code>.claude/rules/</code> pueden usar frontmatter <code>paths</code> con glob patterns. Cuando existe <code>paths</code>, la regla sólo aplica cuando Claude trabaja con archivos que coinciden con esos patrones.",
            "Esto permite mantener convenciones especializadas —por ejemplo para APIs, tests o componentes— fuera del contexto global hasta que realmente son relevantes."
          ],
          [
            "Rules under <code>.claude/rules/</code> can use <code>paths</code> frontmatter with glob patterns. When <code>paths</code> is present, the rule applies only when Claude works with matching files.",
            "This keeps specialized conventions—for APIs, tests, or components—out of global context until they are actually relevant."
          ],[],[],[S.memory]
        ),
        section(
          "3. Skills","3. Skills",
          [
            "Una skill empaqueta instrucciones para una tarea o workflow reusable. En una sesión regular, la descripción de la skill puede estar disponible para que Claude sepa que existe, mientras que el contenido completo de <code>SKILL.md</code> se carga cuando la skill se invoca.",
            "<code>argument-hint</code> muestra al usuario los argumentos esperados durante autocomplete. <code>allowed-tools</code> pre-aprueba las tools listadas durante el turno que invoca la skill; no restringe las tools no listadas y el grant se limpia con el siguiente mensaje del usuario.",
            "<code>context: fork</code> ejecuta una skill en un contexto de subagent separado, útil cuando la tarea debe aislarse del contexto principal."
          ],
          [
            "A skill packages instructions for a reusable task or workflow. In a regular session, the skill description can be available so Claude knows it exists, while the full <code>SKILL.md</code> content loads when the skill is invoked.",
            "<code>argument-hint</code> shows expected arguments during autocomplete. <code>allowed-tools</code> pre-approves listed tools for the turn that invokes the skill; it does not restrict unlisted tools and the grant clears on the next user message.",
            "<code>context: fork</code> runs a skill in a separate subagent context, useful when the task should be isolated from the main context."
          ],[],[],[S.skills]
        )
      ]
    },

    "d3-workflow": {
      leadES:"Claude Code ofrece modos de trabajo distintos para exploración, ejecución interactiva y automatización. El criterio central es cuánto control necesitas antes de modificar estado.",
      leadEN:"Claude Code offers different modes for exploration, interactive execution, and automation. The core criterion is how much control you need before mutating state.",
      sections:[
        section(
          "1. Plan mode","1. Plan mode",
          [
            "En plan mode, Claude puede leer archivos y proponer un plan, pero no realiza edits hasta que lo apruebas. Anthropic lo presenta como el modo adecuado cuando quieres revisar la estrategia antes de que los cambios toquen disco.",
            "Esto separa exploración/diseño de mutación. No significa que toda tarea deba comenzar en plan mode: es una herramienta de control para tareas donde conviene revisar el enfoque antes de editar."
          ],
          [
            "In plan mode, Claude can read files and propose a plan but does not edit until you approve. Anthropic presents it as the right mode when you want to review the approach before changes touch disk.",
            "This separates exploration/design from mutation. It does not mean every task must begin in plan mode; it is a control mechanism for work where reviewing the approach before editing is valuable."
          ],[],[],[S.workflows]
        ),
        section(
          "2. Sesiones y continuidad","2. Sessions and continuity",
          [
            "Claude Code guarda conversaciones y permite continuar o reanudar sesiones. Esto evita reexplicar contexto en tareas que abarcan varias sesiones.",
            "La continuidad de conversación no debe confundirse con actualización automática de realidad externa: si archivos, APIs o datos cambiaron desde la sesión anterior, deben volver a consultarse cuando sean relevantes."
          ],
          [
            "Claude Code saves conversations and lets you continue or resume sessions, avoiding repeated context explanation for tasks spanning multiple sittings.",
            "Conversation continuity should not be confused with automatic refresh of external reality: files, APIs, or data that changed since the prior session need to be read again when relevant."
          ],[],[],[S.workflows]
        ),
        section(
          "3. CI y ejecución no interactiva","3. CI and non-interactive execution",
          [
            "<code>claude -p</code> ejecuta una consulta en print mode y termina sin abrir una sesión interactiva. Para automatización, el CLI puede emitir <code>text</code>, <code>json</code> o <code>stream-json</code>.",
            "<code>--json-schema</code> permite obtener JSON validado contra un schema al finalizar el workflow en print mode. Esto es útil cuando un pipeline necesita un contrato machine-readable en vez de parsear texto libre."
          ],
          [
            "<code>claude -p</code> runs a query in print mode and exits without opening an interactive session. For automation, the CLI can emit <code>text</code>, <code>json</code>, or <code>stream-json</code>.",
            "<code>--json-schema</code> returns JSON validated against a schema after the workflow completes in print mode. This is useful when a pipeline needs a machine-readable contract instead of parsing free-form text."
          ],[],[],[S.cli]
        )
      ]
    },

    "d4-prompt": {
      leadES:"El prompting efectivo en Claude parte de instrucciones claras, contexto suficiente y ejemplos bien elegidos. La meta no es hacer el prompt más largo, sino reducir ambigüedad sobre la tarea y el output esperado.",
      leadEN:"Effective prompting with Claude starts with clear instructions, sufficient context, and well-chosen examples. The goal is not a longer prompt; it is less ambiguity about the task and expected output.",
      sections:[
        section(
          "1. Claridad y especificidad","1. Clarity and specificity",
          [
            "Anthropic recomienda instrucciones claras y explícitas. Debes especificar el formato, restricciones y criterios relevantes en vez de esperar que Claude infiera normas internas que no conoce.",
            "Cuando el orden o la completitud importan, la documentación recomienda usar pasos numerados o bullets. También puede ayudar explicar el motivo detrás de una regla cuando ese contexto permite generalizar correctamente."
          ],
          [
            "Anthropic recommends clear, explicit instructions. Specify the desired format, constraints, and relevant criteria instead of expecting Claude to infer internal norms it has not been given.",
            "When order or completeness matters, the documentation recommends numbered steps or bullets. Explaining the reason behind a rule can also help when that context enables correct generalization."
          ],[],[],[S.prompt]
        ),
        section(
          "2. Few-shot / multishot","2. Few-shot / multishot",
          [
            "Anthropic describe los ejemplos como una de las formas más confiables de guiar formato, tono y estructura. Un pequeño conjunto bien construido mejora precisión y consistencia.",
            "Los ejemplos deben ser relevantes para el use case real, diversos para cubrir edge cases sin enseñar patrones accidentales y estructurados para que Claude los distinga claramente de las instrucciones. La guía actual recomienda 3–5 ejemplos como punto de partida."
          ],
          [
            "Anthropic describes examples as one of the most reliable ways to steer format, tone, and structure. A small set of well-crafted examples improves accuracy and consistency.",
            "Examples should be relevant to the real use case, diverse enough to cover edge cases without teaching accidental patterns, and structured so Claude can distinguish them from instructions. Current guidance recommends 3–5 examples as a starting point."
          ],[],[],[S.prompt]
        ),
        section(
          "3. Qué deben enseñar los ejemplos","3. What examples should teach",
          [
            "Un ejemplo útil muestra la transformación o decisión que quieres que Claude generalice. Por eso la diversidad importa: si todos los ejemplos representan el mismo caso fácil, el modelo recibe poca información sobre cómo actuar en los límites.",
            "El objetivo de few-shot no es crear una base exhaustiva de frases posibles, sino mostrar patrones representativos de comportamiento esperado."
          ],
          [
            "A useful example demonstrates the transformation or decision you want Claude to generalize. Diversity matters because examples that all show the same easy case provide little information about boundary behavior.",
            "The goal of few-shot prompting is not an exhaustive catalog of possible phrasings; it is to demonstrate representative patterns of desired behavior."
          ],[],[],[S.prompt]
        )
      ]
    },

    "d4-structured": {
      leadES:"Structured outputs separa dos problemas: que el output tenga una forma válida y que el contenido sea correcto. Anthropic garantiza el primero bajo las condiciones soportadas; la semántica sigue requiriendo una buena tarea, fuentes y validación.",
      leadEN:"Structured outputs separates two problems: valid output shape and correct content. Anthropic guarantees the former under supported conditions; semantics still depend on the task, sources, and validation.",
      sections:[
        section(
          "1. JSON outputs","1. JSON outputs",
          [
            "Con <code>output_config.format</code> y un JSON Schema soportado, Claude devuelve JSON válido que coincide con el schema. Esto elimina errores de parsing y asegura tipos/campos requeridos dentro de las limitaciones documentadas.",
            "El flujo es: definir schema, enviarlo como formato y leer el response text block como JSON estructurado. Los SDK helpers pueden mapearlo a tipos del lenguaje."
          ],
          [
            "With <code>output_config.format</code> and a supported JSON Schema, Claude returns valid JSON matching the schema. This removes parsing errors and guarantees field types/required fields within documented limitations.",
            "The flow is: define the schema, send it as the output format, and read the response text block as structured JSON. SDK helpers can map it into language-native types."
          ],[],[],[S.structured]
        ),
        section(
          "2. Strict tool use","2. Strict tool use",
          [
            "Structured outputs también incluye <code>strict: true</code> para custom tools. Esta opción garantiza validación de nombres e inputs de tool contra el schema soportado.",
            "Es un contrato estructural en el límite de la tool: evita que inputs inválidos lleguen a tu código, pero no decide por sí solo si la tool elegida era la correcta para el caso de negocio."
          ],
          [
            "Structured outputs also includes <code>strict: true</code> for custom tools. This guarantees validation of tool names and inputs against the supported schema.",
            "It is a structural contract at the tool boundary: it prevents invalid inputs from reaching your code, but does not by itself determine whether that tool was the correct business choice."
          ],[],[],[S.structured,S.strictTools]
        ),
        section(
          "3. Límites importantes","3. Important limits",
          [
            "Anthropic documenta excepciones donde el output puede no coincidir con el schema, por ejemplo una <code>refusal</code> o cuando la generación se corta por <code>max_tokens</code>.",
            "Además, schema compliance significa que la estructura es válida; no aporta evidencia nueva que no exista en la fuente. Si el task es extracción, la exactitud factual debe seguir evaluándose contra el documento o sistema de origen."
          ],
          [
            "Anthropic documents exceptions where output may not match the schema, such as a <code>refusal</code> or generation cut off by <code>max_tokens</code>.",
            "Schema compliance also means the structure is valid; it does not create evidence that was absent from the source. For extraction tasks, factual accuracy still needs to be evaluated against the source document or system."
          ],[],[],[S.structured]
        )
      ]
    },

    "d5-context": {
      leadES:"Context management trata el context window como un recurso finito. Anthropic recomienda mantener lo relevante, retirar material viejo cuando ya no aporta y usar compaction o memoria persistente para workflows largos.",
      leadEN:"Context management treats the context window as a finite resource. Anthropic recommends keeping relevant information, removing stale material when it no longer helps, and using compaction or persistent memory for long-running workflows.",
      sections:[
        section(
          "1. El context window es working memory","1. The context window is working memory",
          [
            "Anthropic define el context window como el texto que el modelo puede consultar al generar una respuesta. Incluye conversación, instrucciones, herramientas y otros bloques que formen parte de la solicitud.",
            "Más contexto no siempre es mejor: la documentación actual advierte que, al crecer el número de tokens, precisión y recall pueden degradarse. Por eso los workflows largos necesitan una estrategia de context management."
          ],
          [
            "Anthropic defines the context window as the text the model can reference while generating a response. It includes conversation, instructions, tools, and other blocks included in the request.",
            "More context is not always better: current docs warn that accuracy and recall can degrade as token count grows. Long-running workflows therefore need an explicit context-management strategy."
          ],[],[],[S.context]
        ),
        section(
          "2. Context editing","2. Context editing",
          [
            "Context editing permite limpiar selectivamente contenido antiguo. Para agentic workflows con mucho tool use, Anthropic ofrece tool-result clearing: cuando el contexto supera un threshold, puede eliminar resultados viejos que ya no se necesitan y reemplazarlos por placeholders.",
            "El cliente mantiene su historial completo; la edición ocurre server-side antes de que el prompt llegue a Claude. Esto permite reducir lo que el modelo ve sin obligar a tu aplicación a reescribir su propio historial."
          ],
          [
            "Context editing selectively clears older content. For agentic workflows with heavy tool use, Anthropic provides tool-result clearing: once context passes a threshold, older results that are no longer needed can be removed and replaced with placeholders.",
            "The client keeps its full history; editing happens server-side before the prompt reaches Claude. This reduces what the model sees without forcing your application to rewrite its own stored history."
          ],[],[],[S.contextEditing]
        ),
        section(
          "3. Compaction","3. Compaction",
          [
            "Compaction reemplaza turnos antiguos por un resumen generado por Claude en el servidor. La finalidad es mantener conversaciones o tareas largas dentro del context window y reducir el active context.",
            "La documentación actual distingue compaction on-demand y compaction por threshold. También permite conservar turnos recientes word-for-word en configuraciones compatibles. Si el resumen por defecto omite algo que una etapa futura necesita, Anthropic permite personalizar el summarization prompt."
          ],
          [
            "Compaction replaces older turns with a server-generated summary. Its purpose is to keep long conversations or agent tasks inside the context window while reducing active context.",
            "Current docs distinguish on-demand compaction from threshold-based compaction. Compatible flows can also keep recent turns word-for-word. If the default summary drops information a later stage needs, Anthropic allows customizing the summarization prompt."
          ],[],[],[S.compaction]
        ),
        section(
          "4. Preservar información importante","4. Preserving important information",
          [
            "Anthropic documenta que context editing puede combinarse con memory: antes de limpiar resultados, Claude puede recibir una advertencia para guardar información esencial en almacenamiento persistente y consultarla después bajo demanda.",
            "Para workflows que cruzan sesiones, Anthropic también recomienda diseñar artefactos de estado que permitan recuperar contexto rápidamente en una sesión nueva. La idea es no depender de que todo el historial siga activo para conservar información importante."
          ],
          [
            "Anthropic documents that context editing can be combined with memory: before clearing tool results, Claude can receive a warning to save essential information to persistent storage and retrieve it later on demand.",
            "For workflows spanning sessions, Anthropic also recommends designing state artifacts so context can be recovered quickly in a new session. The idea is not to depend on the entire historical conversation remaining active in order to preserve important information."
          ],[],[],[S.context,S.contextEditing]
        )
      ]
    }
  };
})();