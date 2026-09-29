(() => {
  const D = {
    loop:["Tool use lifecycle","https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works"],
    handle:["Handle tool calls","https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls"],
    stop:["Stop reasons and fallback","https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons"],
    parallel:["Parallel tool use","https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use"],
    tools:["Tool use overview","https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"],
    structured:["Structured outputs","https://platform.claude.com/docs/en/build-with-claude/structured-outputs"],
    prompt:["Prompting best practices","https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"],
    memory:["Claude Code memory","https://code.claude.com/docs/en/memory"],
    mcp:["Claude Code MCP","https://code.claude.com/docs/en/mcp"],
    skills:["Claude Code skills","https://code.claude.com/docs/en/skills"],
    hooks:["Claude Code hooks","https://code.claude.com/docs/en/hooks"],
    cli:["Claude Code CLI reference","https://code.claude.com/docs/en/cli-reference"],
    subagents:["Claude Code subagents","https://code.claude.com/docs/en/sub-agents"]
  };

  const T = (family, lessonId, domain, questionEN, questionES, options, correct, wrongEN, wrongES, rationaleEN, rationaleES, ruleEN, ruleES, doc, type="single", selectCount=null) => ({
    family, lessonId, domain, type, ...(selectCount ? {selectCount} : {}),
    questionEN, questionES,
    options: options.map(([en,es]) => ({en,es})),
    correct, wrongReasonEN:wrongEN, wrongReasonES:wrongES,
    rationaleEN, rationaleES, ruleEN, ruleES,
    doc:{label:doc[0],url:doc[1]}
  });

  window.CCARF_TEMPLATE_BANK = [
    T("LOOP_TOOL_RESULT","d1-loop","D1",
      "A client-executed tool finishes successfully. What must the application do before Claude can reason over that result?",
      "Una herramienta ejecutada por el cliente termina correctamente. ¿Qué debe hacer la aplicación antes de que Claude pueda razonar sobre ese resultado?",
      [
        ["Return a tool_result block tied to the original tool_use ID in the next user message.","Devolver un bloque tool_result ligado al ID de tool_use original en el siguiente mensaje user."],
        ["Write the result into the tool description for the next turn.","Escribir el resultado dentro de la descripción de la herramienta para el siguiente turno."],
        ["Do nothing because client-tool output is injected automatically.","No hacer nada porque la salida de client tools se inyecta automáticamente."],
        ["Convert the result into a new system prompt.","Convertir el resultado en un nuevo system prompt."]
      ],[0],
      ["","Tool definitions describe capabilities, not runtime results.","Client tools run outside Anthropic's servers; the result must be returned explicitly.","System prompts are not the tool-result transport contract."],
      ["","Las definiciones de herramientas describen capacidades, no resultados de ejecución.","Las client tools se ejecutan fuera de los servidores de Anthropic; el resultado debe devolverse explícitamente.","Los system prompts no son el contrato para transportar resultados de tools."],
      "For client tools, Claude emits tool_use, your code executes the operation, and the next request returns tool_result linked by tool_use_id.",
      "Para client tools, Claude emite tool_use, tu código ejecuta la operación y la siguiente solicitud devuelve tool_result ligado por tool_use_id.",
      "Client tool execution is external; return results explicitly through tool_result.",
      "La ejecución de client tools es externa; devuelve resultados explícitamente mediante tool_result.",D.handle),

    T("LOOP_STOP_REASON","d1-loop","D1",
      "Claude returns prose plus a tool call in the same response. Which signal should control whether the agent loop continues?",
      "Claude devuelve prosa y una llamada a herramienta en la misma respuesta. ¿Qué señal debe controlar si el agent loop continúa?",
      [
        ["Whether any text block is present.","Si existe algún bloque de texto."],
        ["The response stop_reason and structured tool blocks.","El stop_reason de la respuesta y los bloques estructurados de tools."],
        ["A regex that looks for phrases such as 'done' or 'complete'.","Un regex que busque frases como 'done' o 'complete'."],
        ["A fixed maximum of five iterations as the primary completion rule.","Un máximo fijo de cinco iteraciones como regla primaria de completitud."]
      ],[1],
      ["Text can coexist with tool_use, so text presence is not lifecycle state.","","Natural-language phrasing is not a reliable structured lifecycle signal.","Iteration caps can be defensive guardrails, not the primary definition of successful completion."],
      ["El texto puede coexistir con tool_use, por lo que su presencia no representa el estado del lifecycle.","","El lenguaje natural no es una señal estructurada confiable del lifecycle.","Los límites de iteraciones pueden ser guardrails defensivos, no la definición primaria de completitud exitosa."],
      "Messages API responses expose stop_reason specifically so applications can decide whether to execute tools, use the response, continue, or handle another stop condition.",
      "Las respuestas de Messages API exponen stop_reason específicamente para que la aplicación decida si ejecuta tools, usa la respuesta, continúa o maneja otra condición.",
      "Use structured lifecycle state, not prose, to control the loop.",
      "Usa estado estructurado del lifecycle, no prosa, para controlar el loop.",D.stop),

    T("PARALLEL_READS","d1-orchestration","D1",
      "Claude requests several independent read-only lookups that do not share state. What execution strategy is generally appropriate?",
      "Claude solicita varias consultas read-only independientes que no comparten estado. ¿Qué estrategia de ejecución es generalmente apropiada?",
      [
        ["Run them concurrently to reduce latency, then return all results.","Ejecutarlas concurrentemente para reducir latencia y luego devolver todos los resultados."],
        ["Force them to run one at a time because tool_use blocks are always sequential.","Forzarlas a ejecutarse una por una porque los bloques tool_use siempre son secuenciales."],
        ["Merge them into one tool definition before execution.","Fusionarlas en una sola definición de herramienta antes de ejecutarlas."],
        ["Discard all but the first call and let Claude retry.","Descartar todas excepto la primera y dejar que Claude reintente."]
      ],[0],
      ["","The API can return several tool_use blocks; independent calls need not be serialized.","Parallel execution does not require redesigning the tool interface.","Dropping valid calls adds unnecessary extra turns and loses requested work."],
      ["","La API puede devolver varios bloques tool_use; llamadas independientes no tienen que serializarse.","La ejecución paralela no requiere rediseñar la interfaz de tools.","Descartar llamadas válidas agrega turnos innecesarios y pierde trabajo solicitado."],
      "Anthropic allows multiple tool calls in one assistant turn. Independent read-only operations are usually safe to execute concurrently; side effects or ordering constraints may require sequencing.",
      "Anthropic permite varias llamadas a tools en un turno. Operaciones read-only independientes suelen poder ejecutarse concurrentemente; efectos secundarios u orden pueden requerir secuencia.",
      "Parallelize independent work; serialize shared-state or order-sensitive actions.",
      "Paraleliza trabajo independiente; serializa acciones con estado compartido o dependencias de orden.",D.parallel),

    T("ENFORCE_CRITICAL","d1-enforcement","D1",
      "A business invariant must never be violated even if the model ignores an instruction. Which design best enforces it?",
      "Una invariante de negocio nunca debe violarse aunque el modelo ignore una instrucción. ¿Qué diseño la hace cumplir mejor?",
      [
        ["Add more emphatic language to CLAUDE.md.","Agregar lenguaje más enfático a CLAUDE.md."],
        ["Add a programmatic prerequisite gate or PreToolUse enforcement before the sensitive action.","Agregar un prerequisite gate programático o enforcement PreToolUse antes de la acción sensible."],
        ["Add more examples of correct behavior only.","Agregar más ejemplos de comportamiento correcto."],
        ["Use a longer reasoning prompt before the action.","Usar un prompt de razonamiento más largo antes de la acción."]
      ],[1],
      ["CLAUDE.md is context and guidance, not an enforcement boundary.","","Examples influence behavior probabilistically; they do not make an invalid action impossible.","More reasoning can improve judgment but still does not enforce the invariant in code."],
      ["CLAUDE.md es contexto y guidance, no una barrera de enforcement.","","Los ejemplos influyen probabilísticamente; no hacen imposible una acción inválida.","Más razonamiento puede mejorar el juicio, pero no impone la invariante en código."],
      "Critical restrictions should be implemented through hooks, permissions, or application logic that can block execution.",
      "Restricciones críticas deben implementarse mediante hooks, permisos o lógica de aplicación que pueda bloquear ejecución.",
      "If one violation is unacceptable, enforce the invariant outside model discretion.",
      "Si una sola violación es inaceptable, impón la invariante fuera de la discreción del modelo.",D.hooks),

    T("TOOL_DESCRIPTIONS","d2-tools","D2",
      "Two tools have overlapping one-line descriptions and Claude repeatedly selects the wrong one. What should be changed first?",
      "Dos herramientas tienen descripciones de una línea que se traslapan y Claude elige repetidamente la incorrecta. ¿Qué debe cambiarse primero?",
      [
        ["Add a separate routing classifier before every request.","Agregar un classifier de routing antes de cada solicitud."],
        ["Clarify each tool's purpose, boundaries, inputs, and when to prefer it over the other tool.","Aclarar propósito, límites, inputs y cuándo preferir cada herramienta sobre la otra."],
        ["Force one tool with tool_choice for all requests.","Forzar una herramienta con tool_choice para todas las solicitudes."],
        ["Merge both operations into a single broad tool.","Fusionar ambas operaciones en una sola herramienta amplia."]
      ],[1],
      ["A router adds architecture before correcting the ambiguous interface that caused the misselection.","","Forcing one tool removes valid model choice and will be wrong for requests requiring the other tool.","Merging unrelated responsibilities usually reduces clarity rather than fixing selection boundaries."],
      ["Un router agrega arquitectura antes de corregir la interfaz ambigua que causó la selección incorrecta.","","Forzar una tool elimina elección válida y será incorrecto para solicitudes que requieren la otra.","Fusionar responsabilidades distintas suele reducir claridad en vez de corregir límites de selección."],
      "Claude uses tool descriptions to map a request to available capabilities. Clear purpose and boundaries are part of the tool interface.",
      "Claude usa las descripciones de tools para mapear una solicitud a capacidades disponibles. Propósito y límites claros forman parte de la interfaz.",
      "Fix an ambiguous tool interface before adding routing complexity.",
      "Corrige una interfaz de tool ambigua antes de agregar complejidad de routing.",D.tools),

    T("TOOL_ERROR_SIGNAL","d2-tools","D2",
      "A client tool fails with a recoverable backend error. How should the harness communicate the failure to Claude?",
      "Una client tool falla con un error recuperable del backend. ¿Cómo debe comunicar el harness el fallo a Claude?",
      [
        ["Return a tool_result marked as an error with useful failure details.","Devolver un tool_result marcado como error con detalles útiles del fallo."],
        ["Pretend the tool returned an empty successful result.","Fingir que la herramienta devolvió un resultado exitoso vacío."],
        ["Hide the error and ask Claude to call another tool without context.","Ocultar el error y pedir a Claude que llame otra tool sin contexto."],
        ["Put the stack trace into the next system prompt only.","Poner el stack trace únicamente en el siguiente system prompt."]
      ],[0],
      ["","An empty result and an execution failure have different semantics and recovery strategies.","Suppressing the failure deprives Claude of the information needed to decide whether to retry or change strategy.","The tool-result channel is the appropriate place to report the tool outcome."],
      ["","Un resultado vacío y un fallo de ejecución tienen semánticas y estrategias de recuperación distintas.","Suprimir el fallo priva a Claude de información necesaria para decidir si reintenta o cambia estrategia.","El canal de tool_result es el lugar adecuado para reportar el resultado de la tool."],
      "Tool results can signal errors so Claude can reason about recovery. Preserve the distinction between 'no data' and 'tool failed'.",
      "Los tool results pueden señalar errores para que Claude razone sobre recovery. Conserva la distinción entre 'sin datos' y 'la tool falló'.",
      "Represent failures explicitly; do not collapse failure into an empty success.",
      "Representa fallos explícitamente; no conviertas un fallo en éxito vacío.",D.handle),

    T("TOOL_REQUIRED_CALL","d2-tools","D2",
      "The application must guarantee that Claude calls a particular tool on this turn instead of optionally answering from prose. What is the appropriate mechanism?",
      "La aplicación debe garantizar que Claude llame una herramienta específica en este turno en lugar de responder opcionalmente con prosa. ¿Cuál es el mecanismo apropiado?",
      [
        ["Rely only on a system instruction asking Claude to use the tool.","Confiar sólo en una instrucción del system prompt pidiendo usar la tool."],
        ["Use tool_choice to require the tool call when the API/model configuration supports that mode.","Usar tool_choice para requerir la llamada cuando la configuración de API/modelo soporte ese modo."],
        ["Rename the tool so it sorts first alphabetically.","Renombrar la tool para que aparezca primero alfabéticamente."],
        ["Increase max_tokens so Claude has more room to decide.","Aumentar max_tokens para que Claude tenga más espacio para decidir."]
      ],[1],
      ["Prompting can influence selection but does not provide the same API-level requirement.","","Tool ordering by name is not a guarantee of invocation.","Output token budget is unrelated to requiring a specific tool call."],
      ["El prompting puede influir la selección, pero no proporciona el mismo requisito a nivel API.","","El orden alfabético de tools no garantiza su invocación.","El presupuesto de tokens no está relacionado con requerir una llamada específica."],
      "When a call must be required rather than merely encouraged, use the API's tool-choice mechanism instead of relying only on natural-language prompting.",
      "Cuando una llamada debe ser requerida y no sólo incentivada, usa el mecanismo de tool choice de la API en vez de depender sólo de prompting.",
      "Guidance influences; tool_choice can require.",
      "Guidance influye; tool_choice puede requerir.",D.tools),

    T("STRICT_TOOL_SCHEMA","d4-structured","D4",
      "Downstream code breaks when Claude occasionally supplies malformed tool parameters. The tool input schema already captures the required shape. What is the most direct fix?",
      "El código downstream falla cuando Claude ocasionalmente envía parámetros malformados a una tool. El input schema ya captura la forma requerida. ¿Cuál es la corrección más directa?",
      [
        ["Enable strict tool use for that custom tool.","Habilitar strict tool use para esa herramienta personalizada."],
        ["Add a prose reminder to return valid JSON.","Agregar un recordatorio en prosa para devolver JSON válido."],
        ["Retry every call three times regardless of whether it is valid.","Reintentar cada llamada tres veces aunque sea válida."],
        ["Move the schema into CLAUDE.md instead of the tool definition.","Mover el schema a CLAUDE.md en vez de la definición de la tool."]
      ],[0],
      ["","A reminder does not guarantee schema conformance.","Blind retries add cost and do not address the schema-conformance cause.","The tool definition is where the callable input contract belongs."],
      ["","Un recordatorio no garantiza conformidad con el schema.","Retries ciegos agregan costo y no atacan la causa de conformidad.","La definición de la tool es donde debe vivir el contrato de inputs."],
      "Strict tool use constrains custom tool inputs to the declared schema, preventing malformed parameter shapes from reaching downstream code.",
      "Strict tool use restringe los inputs de tools al schema declarado, evitando formas malformadas que rompan código downstream.",
      "Schema problem → enforce the schema at the tool boundary.",
      "Problema de schema → impón el schema en el límite de la tool.",D.structured),

    T("MCP_PROJECT_SECRET","d2-mcp","D2",
      "A team must commit one shared MCP server configuration while keeping each developer's token out of version control. Which design fits?",
      "Un equipo debe versionar una configuración MCP compartida manteniendo el token de cada desarrollador fuera del repositorio. ¿Qué diseño encaja?",
      [
        ["Put the server in project .mcp.json and reference a token through an environment-variable placeholder.","Colocar el servidor en el .mcp.json del proyecto y referenciar el token mediante una variable de entorno."],
        ["Paste the token directly into .mcp.json because the repository is private.","Pegar el token directamente en .mcp.json porque el repositorio es privado."],
        ["Put the token inside CLAUDE.md so every session can read it.","Poner el token dentro de CLAUDE.md para que cada sesión pueda leerlo."],
        ["Store the entire server only in each user's private configuration and document the setup manually.","Guardar todo el servidor sólo en configuración privada de cada usuario y documentar el setup manualmente."]
      ],[0],
      ["","Repository privacy does not make committed credentials an appropriate secret-management mechanism.","CLAUDE.md enters model context and is not a secret store.","User-only configuration fails the requirement that the shared server definition travel with the project."],
      ["","Que el repo sea privado no convierte credenciales versionadas en un mecanismo adecuado de secrets.","CLAUDE.md entra al contexto del modelo y no es un secret store.","Configuración sólo de usuario no cumple con que la definición compartida viaje con el proyecto."],
      "Project-scoped MCP configuration lives in .mcp.json and can use environment-variable expansion so shared structure is versioned without committing secrets.",
      "La configuración MCP project-scoped vive en .mcp.json y puede usar expansión de variables para versionar estructura compartida sin guardar secrets.",
      "Version shared configuration; inject secrets from the environment.",
      "Versiona configuración compartida; inyecta secrets desde el entorno.",D.mcp),

    T("MCP_SCOPE_PRECEDENCE","d2-mcp","D2",
      "A developer wants to test an experimental MCP server in one project on one machine without changing the team's shared project definition. The server has the same name as the shared one. Which scope should override it?",
      "Un desarrollador quiere probar un servidor MCP experimental en un proyecto y una sola máquina sin cambiar la definición compartida del equipo. El servidor tiene el mismo nombre que el compartido. ¿Qué scope debe sobrescribirlo?",
      [
        ["Local scope, because it has higher precedence than project and user scope.","Local scope, porque tiene mayor precedencia que project y user scope."],
        ["User scope, because user configuration always overrides local project-specific configuration.","User scope, porque la configuración de usuario siempre sobrescribe configuración local del proyecto."],
        ["Project scope, editing .mcp.json and reverting it later.","Project scope, editando .mcp.json y revirtiéndolo después."],
        ["A CLAUDE.md instruction telling Claude to prefer the experimental server.","Una instrucción en CLAUDE.md diciendo a Claude que prefiera el servidor experimental."]
      ],[0],
      ["","Claude Code MCP precedence is local, then project, then user for duplicate server names.","Editing the shared project file changes the team-level definition and creates unnecessary version-control risk.","Server resolution follows MCP configuration precedence, not natural-language preference instructions."],
      ["","La precedencia MCP de Claude Code es local, luego project y luego user para nombres duplicados.","Editar el archivo compartido cambia la definición del equipo y crea riesgo innecesario de control de versiones.","La resolución de servidores sigue precedencia de configuración MCP, no preferencias en lenguaje natural."],
      "For duplicate MCP server names, Claude Code uses the highest-precedence configuration: local before project before user.",
      "Para nombres duplicados de servidores MCP, Claude Code usa la configuración de mayor precedencia: local antes que project y project antes que user.",
      "Temporary machine-specific override → local scope.",
      "Override temporal específico de máquina → local scope.",D.mcp),

    T("PROJECT_CLAUDEMD","d3-code","D3",
      "Testing conventions and architectural rules must apply to every teammate and CI runner after cloning the repository. Where should they live?",
      "Convenciones de testing y reglas arquitectónicas deben aplicar a todo compañero y runner CI después de clonar el repositorio. ¿Dónde deben vivir?",
      [
        ["A repository-level CLAUDE.md committed to version control.","Un CLAUDE.md a nivel repositorio versionado."],
        ["Each developer's ~/.claude/CLAUDE.md.","El ~/.claude/CLAUDE.md de cada desarrollador."],
        ["A private CLAUDE.local.md on one maintainer's machine.","Un CLAUDE.local.md privado en la máquina de un maintainer."],
        ["A one-time prompt pasted into the first session.","Un prompt de una sola vez pegado en la primera sesión."]
      ],[0],
      ["","User-level instructions are personal and do not travel with the repository.","CLAUDE.local.md is intentionally personal/project-local and typically gitignored.","A one-time prompt does not establish persistent shared project instructions."],
      ["","Las instrucciones user-level son personales y no viajan con el repositorio.","CLAUDE.local.md es intencionalmente personal del proyecto y normalmente se ignora en git.","Un prompt de una sola vez no establece instrucciones persistentes compartidas."],
      "Project CLAUDE.md files are intended for team-shared project instructions and are distributed through source control.",
      "Los CLAUDE.md de proyecto están diseñados para instrucciones compartidas por el equipo y se distribuyen mediante control de versiones.",
      "Shared team rule → project instructions, not user-local memory.",
      "Regla compartida del equipo → instrucciones de proyecto, no memoria personal.",D.memory),

    T("LOCAL_CLAUDEMD","d3-code","D3",
      "One engineer needs project-specific sandbox URLs and personal test preferences that should not be committed or shared. What is the best location?",
      "Un ingeniero necesita URLs de sandbox específicas del proyecto y preferencias personales de pruebas que no deben versionarse ni compartirse. ¿Cuál es la mejor ubicación?",
      [
        ["CLAUDE.local.md at the project root, kept out of version control.","CLAUDE.local.md en la raíz del proyecto, fuera de control de versiones."],
        ["The shared project CLAUDE.md.","El CLAUDE.md compartido del proyecto."],
        ["An organization-wide managed CLAUDE.md.","Un CLAUDE.md administrado a nivel organización."],
        ["The source code comments of the main application.","Comentarios en el código fuente de la aplicación principal."]
      ],[0],
      ["","Project CLAUDE.md is shared and would expose personal-only preferences to teammates.","Organization-wide instructions are too broad for personal project details.","Application code is not the configuration surface for personal Claude Code instructions."],
      ["","El CLAUDE.md de proyecto es compartido y expondría preferencias personales al equipo.","Las instrucciones de organización son demasiado amplias para detalles personales de un proyecto.","El código de la aplicación no es la superficie de configuración para instrucciones personales de Claude Code."],
      "CLAUDE.local.md provides project-specific personal instructions and should be gitignored.",
      "CLAUDE.local.md proporciona instrucciones personales específicas del proyecto y debe quedar ignorado por git.",
      "Personal + project-specific + not shared → CLAUDE.local.md.",
      "Personal + específico del proyecto + no compartido → CLAUDE.local.md.",D.memory),

    T("PATH_RULES","d3-code","D3",
      "A convention should load only when Claude works on files matching tests/**/*.test.ts across many directories. What mechanism best expresses this?",
      "Una convención debe cargarse sólo cuando Claude trabaja con archivos que coinciden con tests/**/*.test.ts en muchos directorios. ¿Qué mecanismo la expresa mejor?",
      [
        ["A path-scoped rule in .claude/rules with a paths glob.","Una regla path-scoped en .claude/rules con un glob en paths."],
        ["Copy the same CLAUDE.md into every test directory.","Copiar el mismo CLAUDE.md en cada directorio de tests."],
        ["Put the convention in the user's global CLAUDE.md.","Poner la convención en el CLAUDE.md global del usuario."],
        ["Turn it into an MCP server.","Convertirla en un servidor MCP."]
      ],[0],
      ["","Duplicating instructions across directories creates maintenance drift and is unnecessary when a path rule can express the pattern once.","User-level memory would load broadly rather than only for matching files.","MCP is for external tools/context, not conditional project instructions."],
      ["","Duplicar instrucciones en directorios crea drift de mantenimiento y es innecesario cuando una regla por path puede expresar el patrón una vez.","La memoria user-level se cargaría ampliamente en vez de sólo para archivos coincidentes.","MCP es para tools/contexto externo, no para instrucciones condicionales del proyecto."],
      "Claude Code rules can use paths frontmatter so instructions activate only for matching files.",
      "Las reglas de Claude Code pueden usar frontmatter paths para activarse sólo con archivos coincidentes.",
      "File-conditioned instruction → path-scoped rule.",
      "Instrucción condicionada por archivo → regla path-scoped.",D.memory),

    T("CLAUDEMD_IMPORT","d3-code","D3",
      "A shared review-criteria file must be loaded into context at session launch while remaining reusable by other tooling. How should project CLAUDE.md reference it?",
      "Un archivo compartido de criterios de review debe cargarse en contexto al iniciar la sesión y seguir siendo reutilizable por otras herramientas. ¿Cómo debe referenciarlo el CLAUDE.md del proyecto?",
      [
        ["Use @path/to/file outside code formatting so Claude Code imports the file.","Usar @ruta/al/archivo fuera de formato de código para que Claude Code importe el archivo."],
        ["Wrap @path/to/file in backticks so Claude Code expands it.","Encerrar @ruta/al/archivo en backticks para que Claude Code lo expanda."],
        ["Copy the file content into every subdirectory CLAUDE.md.","Copiar el contenido en cada CLAUDE.md de subdirectorio."],
        ["Reference it only in a comment because comments are injected into context automatically.","Referenciarlo sólo en un comentario porque los comentarios se inyectan automáticamente."]
      ],[0],
      ["","Backticks make the @path literal instead of importing the file.","Duplication is unnecessary and creates maintenance drift.","Block-level HTML comments are stripped from injected CLAUDE.md context."],
      ["","Los backticks hacen que @path sea literal en vez de importar el archivo.","La duplicación es innecesaria y crea drift de mantenimiento.","Los comentarios HTML de bloque se eliminan del contexto inyectado de CLAUDE.md."],
      "CLAUDE.md supports @path imports that are expanded into context at launch; code-formatted @paths remain literal.",
      "CLAUDE.md soporta imports @path que se expanden al contexto al iniciar; @paths en formato de código permanecen literales.",
      "Need shared external instruction content at launch → import it with @path.",
      "Necesitas contenido externo compartido al iniciar → impórtalo con @path.",D.memory),

    T("SKILL_VS_MEMORY","d3-code","D3",
      "A multi-step release procedure is needed only when engineers explicitly run that workflow, not in every session. Where should it live?",
      "Un procedimiento de release de varios pasos sólo se necesita cuando los ingenieros ejecutan explícitamente ese workflow, no en cada sesión. ¿Dónde debe vivir?",
      [
        ["A Claude Code skill invoked on demand.","Una skill de Claude Code invocada bajo demanda."],
        ["The root CLAUDE.md so it consumes context every session.","El CLAUDE.md raíz para que consuma contexto en cada sesión."],
        ["A user-level global rule for every project.","Una regla global user-level para todos los proyectos."],
        ["An MCP resource even though no external system is involved.","Un recurso MCP aunque no haya sistema externo involucrado."]
      ],[0],
      ["","CLAUDE.md is better for facts/instructions that should be present every session; task-specific procedures are better as skills.","The procedure is project-specific and on-demand, not a personal rule for all projects.","MCP is unnecessary when the need is an on-demand instruction workflow rather than external integration."],
      ["","CLAUDE.md es mejor para hechos/instrucciones que deben estar siempre presentes; procedimientos específicos encajan mejor como skills.","El procedimiento es específico del proyecto y bajo demanda, no una regla personal para todos los proyectos.","MCP es innecesario cuando la necesidad es un workflow de instrucciones y no integración externa."],
      "Anthropic recommends moving multi-step or task-specific procedures out of always-loaded CLAUDE.md context and into skills.",
      "Anthropic recomienda mover procedimientos multi-step o task-specific fuera del contexto siempre cargado de CLAUDE.md y colocarlos en skills.",
      "Always-needed fact → CLAUDE.md; on-demand procedure → skill.",
      "Hecho siempre necesario → CLAUDE.md; procedimiento bajo demanda → skill.",D.memory),

    T("SKILL_ARGUMENT_HINT","d3-code","D3",
      "Engineers repeatedly invoke a Claude Code skill without the file path and format it expects. Which frontmatter field most directly improves invocation discoverability?",
      "Los ingenieros invocan repetidamente una skill de Claude Code sin la ruta del archivo y el formato que espera. ¿Qué campo de frontmatter mejora directamente la discoverability de la invocación?",
      [
        ["argument-hint, so autocomplete shows the expected arguments.","argument-hint, para que autocomplete muestre los argumentos esperados."],
        ["allowed-tools, because it documents argument syntax.","allowed-tools, porque documenta la sintaxis de argumentos."],
        ["description, because it guarantees arguments are supplied.","description, porque garantiza que los argumentos se proporcionen."],
        ["context: fork, because it validates invocation arguments.","context: fork, porque valida los argumentos de invocación."]
      ],[0],
      ["","allowed-tools controls which tools are pre-approved during the invoking turn; it is not an argument hint.","description helps selection and understanding but does not surface the explicit autocomplete argument hint.","Forked context changes execution isolation, not the invocation argument contract."],
      ["","allowed-tools controla qué tools están pre-aprobadas durante el turno de invocación; no es un hint de argumentos.","description ayuda a selección y comprensión, pero no muestra el hint explícito de argumentos en autocomplete.","El contexto fork cambia aislamiento de ejecución, no el contrato de argumentos de invocación."],
      "In Claude Code skills, argument-hint is shown during autocomplete to communicate expected arguments.",
      "En skills de Claude Code, argument-hint aparece en autocomplete para comunicar argumentos esperados.",
      "Invocation confusion → improve the invocation contract.",
      "Confusión de invocación → mejora el contrato de invocación.",D.skills),

    T("SKILL_ALLOWED_TOOLS","d3-code","D3",
      "A skill lists Read, Grep, and Glob in allowed-tools. Which statement best describes that field?",
      "Una skill lista Read, Grep y Glob en allowed-tools. ¿Qué afirmación describe mejor ese campo?",
      [
        ["Those tools are pre-approved for the turn that invokes the skill; unlisted tools can still be callable under normal permissions.","Esas tools quedan pre-aprobadas durante el turno que invoca la skill; tools no listadas pueden seguir disponibles bajo permisos normales."],
        ["Those are the only tools Claude can use for the rest of the session.","Son las únicas tools que Claude puede usar durante el resto de la sesión."],
        ["The grant persists as long as the skill instructions remain in context.","El grant persiste mientras las instrucciones de la skill permanezcan en contexto."],
        ["Omitting a dangerous tool from allowed-tools permanently denies it.","Omitir una tool peligrosa de allowed-tools la bloquea permanentemente."]
      ],[0],
      ["","allowed-tools is not an allowlist that removes every unlisted tool, and its grant is not session-long.","The skill content can remain in context, but the permission grant clears on the next user message.","To deny a tool, use a blocking mechanism; omission from allowed-tools is not a deny."],
      ["","allowed-tools no es una allowlist que elimine toda tool no listada y su grant no dura toda la sesión.","El contenido de la skill puede permanecer en contexto, pero el grant de permisos se limpia con el siguiente mensaje user.","Para denegar una tool usa un mecanismo de bloqueo; omitirla de allowed-tools no equivale a deny."],
      "allowed-tools pre-approves listed tools for the invoking turn. It does not restrict unlisted tools, and the grant clears on the next user message.",
      "allowed-tools pre-aprueba las tools listadas durante el turno de invocación. No restringe tools no listadas y el grant se limpia con el siguiente mensaje user.",
      "Pre-approval is not restriction; allowed-tools is turn-scoped.",
      "Pre-aprobación no es restricción; allowed-tools es turn-scoped.",D.skills),

    T("PLAN_FIRST","d3-workflow","D3",
      "The requested change spans many files and two materially different architectures are both viable. What should happen before edits begin?",
      "El cambio solicitado abarca muchos archivos y existen dos arquitecturas materialmente distintas que son viables. ¿Qué debe ocurrir antes de comenzar a editar?",
      [
        ["Use plan mode or an equivalent read-only exploration phase to compare approaches before mutation.","Usar plan mode o una fase equivalente de exploración read-only para comparar enfoques antes de mutar."],
        ["Start editing a subset immediately and let the first implementation decide the architecture.","Comenzar editando un subconjunto y dejar que la primera implementación decida la arquitectura."],
        ["Compact the context before inspecting the repository.","Compactar el contexto antes de inspeccionar el repositorio."],
        ["Generate all changes in one monolithic prompt to minimize turns.","Generar todos los cambios en un prompt monolítico para minimizar turnos."]
      ],[0],
      ["","Editing before resolving architectural uncertainty creates rework risk and mixes exploration with mutation.","Compaction addresses context management, not the unresolved architectural decision.","A single large request does not address the need to investigate alternatives safely first."],
      ["","Editar antes de resolver incertidumbre arquitectónica crea riesgo de retrabajo y mezcla exploración con mutación.","Compaction aborda manejo de contexto, no la decisión arquitectónica no resuelta.","Una solicitud grande no resuelve la necesidad de investigar alternativas de forma segura primero."],
      "Broad, uncertain work benefits from an exploration/planning phase before edits; direct execution is better for bounded, understood changes.",
      "Trabajo amplio e incierto se beneficia de una fase de exploración/planeación antes de editar; ejecución directa encaja mejor en cambios acotados.",
      "High scope + unresolved architecture → plan first.",
      "Alcance alto + arquitectura no resuelta → planifica primero.",D.cli),

    T("NONINTERACTIVE_CLI","d3-workflow","D3",
      "An automated CI job hangs because Claude Code is waiting for interactive input. Which change addresses the workflow class directly?",
      "Un job automatizado de CI se queda colgado porque Claude Code espera input interactivo. ¿Qué cambio aborda directamente la clase de problema?",
      [
        ["Run Claude Code in print/non-interactive mode with -p and choose a machine-consumable output format as needed.","Ejecutar Claude Code en modo print/no interactivo con -p y usar un formato consumible por máquinas cuando corresponda."],
        ["Increase max_tokens so the prompt finishes faster.","Aumentar max_tokens para que el prompt termine más rápido."],
        ["Use a larger CLAUDE.md so Claude asks fewer questions.","Usar un CLAUDE.md más grande para que Claude haga menos preguntas."],
        ["Add another subagent to answer the interactive prompt.","Agregar otro subagente para responder el prompt interactivo."]
      ],[0],
      ["","Token budget does not convert an interactive workflow into an automation-safe one.","More instructions do not replace the need for non-interactive CLI execution.","A subagent is not the correct mechanism for satisfying terminal interactivity in CI."],
      ["","El presupuesto de tokens no convierte un workflow interactivo en uno seguro para automatización.","Más instrucciones no sustituyen la necesidad de ejecución no interactiva.","Un subagente no es el mecanismo correcto para resolver interactividad de terminal en CI."],
      "Claude Code -p/--print mode is designed for non-interactive execution, with machine-consumable output formats available.",
      "Claude Code -p/--print está diseñado para ejecución no interactiva, con formatos machine-readable disponibles.",
      "Automation workflow → non-interactive execution.",
      "Workflow automatizado → ejecución no interactiva.",D.cli),

    T("CLI_JSON_SCHEMA","d3-workflow","D3",
      "A CI consumer needs the completed Claude Code run to return a validated JSON shape instead of free-form text. Which CLI feature is designed for this?",
      "Un consumidor de CI necesita que la ejecución terminada de Claude Code devuelva una forma JSON validada en vez de texto libre. ¿Qué feature de CLI está diseñada para esto?",
      [
        ["Use -p with --json-schema for the expected output contract.","Usar -p con --json-schema para el contrato de output esperado."],
        ["Parse terminal prose with regex after the run.","Parsear la prosa de terminal con regex después de la ejecución."],
        ["Store the desired JSON shape only in CLAUDE.md.","Guardar la forma JSON deseada sólo en CLAUDE.md."],
        ["Use --output-format text and ask politely for JSON.","Usar --output-format text y pedir amablemente JSON."]
      ],[0],
      ["","Regex parsing free-form text is less reliable than an explicit structured-output contract.","CLAUDE.md guidance does not provide the CLI validated output contract.","Asking for JSON in text mode does not provide the same validation guarantee."],
      ["","Parsear texto libre con regex es menos confiable que un contrato estructurado explícito.","Guidance en CLAUDE.md no proporciona el contrato validado del CLI.","Pedir JSON en text mode no proporciona la misma garantía de validación."],
      "Claude Code print mode supports --json-schema to obtain validated JSON after the agent completes its workflow.",
      "Claude Code en print mode soporta --json-schema para obtener JSON validado después de completar el workflow.",
      "Machine contract needed → use structured CLI output, not prose parsing.",
      "Necesitas contrato para máquina → usa output estructurado del CLI, no parseo de prosa.",D.cli),

    T("STRUCTURED_FORMAT_NOT_TRUTH","d4-structured","D4",
      "An extractor now always returns JSON that matches the schema, but it occasionally invents a value that is absent from the source document. What does this show?",
      "Un extractor ahora siempre devuelve JSON que coincide con el schema, pero ocasionalmente inventa un valor ausente del documento fuente. ¿Qué demuestra esto?",
      [
        ["Schema conformance guarantees structure, not semantic truth or source grounding.","La conformidad con schema garantiza estructura, no verdad semántica ni grounding en la fuente."],
        ["The JSON schema is being ignored completely.","El JSON schema está siendo ignorado por completo."],
        ["Structured output guarantees both syntax and factual accuracy, so the source must contain the value.","Structured output garantiza sintaxis y exactitud factual, así que la fuente debe contener el valor."],
        ["The only possible fix is to remove structured output.","La única corrección posible es quitar structured output."]
      ],[0],
      ["","The output matching the schema shows the structural constraint is working.","Constrained decoding validates shape, not whether extracted facts exist in the source.","Removing structure would sacrifice parseability without addressing hallucinated semantics."],
      ["","Que el output coincida con el schema demuestra que la restricción estructural funciona.","Constrained decoding valida forma, no si los hechos existen en la fuente.","Quitar estructura sacrificaría parseabilidad sin resolver semántica inventada."],
      "Structured outputs guarantee parseable schema-compliant responses. You still need grounding or validation for semantic correctness.",
      "Structured outputs garantizan respuestas parseables y conformes al schema. Aún necesitas grounding o validación para exactitud semántica.",
      "Structure guarantee ≠ truth guarantee.",
      "Garantía de estructura ≠ garantía de verdad.",D.structured),

    T("MISSING_INFO","d4-structured","D4",
      "A required business field is genuinely absent from the source document. Repeated retries keep producing different guesses. What should the system do?",
      "Un campo de negocio requerido está genuinamente ausente del documento fuente. Retries repetidos producen distintas suposiciones. ¿Qué debe hacer el sistema?",
      [
        ["Represent the value as unknown/null according to the schema or escalate for review instead of retrying for nonexistent evidence.","Representar el valor como unknown/null según el schema o escalar a revisión en vez de reintentar buscando evidencia inexistente."],
        ["Keep retrying until two guesses match.","Seguir reintentando hasta que dos suposiciones coincidan."],
        ["Increase temperature to explore more possible values.","Aumentar temperature para explorar más valores posibles."],
        ["Remove the field from all downstream validation.","Eliminar el campo de toda validación downstream."]
      ],[0],
      ["","Agreement between repeated guesses does not create evidence that is absent from the source.","Higher randomness makes unsupported guessing less grounded.","Removing validation globally changes the contract instead of handling a legitimate missing-data case."],
      ["","Que dos guesses coincidan no crea evidencia ausente de la fuente.","Más aleatoriedad hace el guessing menos grounded.","Eliminar validación global cambia el contrato en vez de manejar explícitamente datos faltantes legítimos."],
      "Retries can fix transient or malformed output problems, but they cannot manufacture source evidence. Model missingness explicitly or route it for review.",
      "Retries pueden corregir problemas transitorios o de formato, pero no pueden fabricar evidencia de la fuente. Modela la ausencia explícitamente o envíala a revisión.",
      "Missing evidence is a data condition, not a retry strategy.",
      "Evidencia faltante es una condición de datos, no una estrategia de retry.",D.structured),

    T("FEWSHOT_AMBIGUITY","d4-prompt","D4",
      "Detailed prose instructions still produce inconsistent choices in a recurring ambiguous case. What prompt change is most targeted?",
      "Instrucciones detalladas en prosa aún producen decisiones inconsistentes en un caso ambiguo recurrente. ¿Qué cambio de prompt es más dirigido?",
      [
        ["Add representative few-shot examples that show the desired decision boundary and why plausible alternatives are rejected.","Agregar ejemplos few-shot representativos que muestren el límite de decisión deseado y por qué se rechazan alternativas plausibles."],
        ["Enumerate every phrasing seen in production so far.","Enumerar cada redacción vista en producción hasta ahora."],
        ["Use examples only for easy, unambiguous cases.","Usar ejemplos sólo para casos fáciles y no ambiguos."],
        ["Remove all examples to reduce context usage.","Eliminar todos los ejemplos para reducir uso de contexto."]
      ],[0],
      ["","Exhaustive phrase enumeration teaches surface matching and does not scale.","Easy examples do not demonstrate the boundary where the model is inconsistent.","Removing examples discards a useful mechanism for demonstrating the desired decision."],
      ["","Enumerar frases enseña matching superficial y no escala.","Ejemplos fáciles no demuestran el límite donde el modelo es inconsistente.","Eliminar ejemplos descarta un mecanismo útil para demostrar la decisión deseada."],
      "Few-shot examples are useful when they demonstrate how to resolve representative ambiguous cases, not merely memorize phrasings.",
      "Los few-shot son útiles cuando demuestran cómo resolver casos ambiguos representativos, no sólo memorizar redacciones.",
      "Teach the decision boundary, not a phrase lookup table.",
      "Enseña el límite de decisión, no una tabla de frases.",D.prompt),

    T("FIXED_VS_ADAPTIVE","d1-orchestration","D1",
      "A recurring workflow always performs the same ordered steps on the same classes of inputs. Which orchestration style is the better fit?",
      "Un workflow recurrente siempre realiza los mismos pasos ordenados sobre las mismas clases de inputs. ¿Qué estilo de orquestación encaja mejor?",
      [
        ["A fixed deterministic chain with validation gates between stages.","Una cadena determinista fija con gates de validación entre etapas."],
        ["A fully autonomous planner that rediscovers the task decomposition every run.","Un planner totalmente autónomo que redescubra la descomposición en cada ejecución."],
        ["One giant request with no intermediate validation.","Una solicitud gigante sin validación intermedia."],
        ["Randomly choose between fixed and dynamic decomposition each run.","Elegir aleatoriamente entre descomposición fija y dinámica en cada ejecución."]
      ],[0],
      ["","Adaptive planning adds variability and cost when the workflow shape is already known.","A monolithic request sacrifices stage-level observability and validation.","Random orchestration is not an architectural decision rule."],
      ["","Planeación adaptativa agrega variabilidad y costo cuando la forma del workflow ya es conocida.","Una solicitud monolítica sacrifica observabilidad y validación por etapa.","Orquestación aleatoria no es una regla arquitectónica."],
      "Use deterministic decomposition for stable workflows; reserve adaptive decomposition for tasks whose subtasks depend on runtime discoveries.",
      "Usa descomposición determinista para workflows estables; reserva descomposición adaptativa para tareas cuyos subtasks dependen de descubrimientos en runtime.",
      "Match autonomy to uncertainty.",
      "Ajusta autonomía a incertidumbre.",D.subagents),

    T("SUBAGENT_CONTEXT","d1-orchestration","D1",
      "A specialist subagent produces a weak result because it lacks facts that were present in the coordinator conversation. What is the first design issue to inspect?",
      "Un subagente especialista produce un resultado débil porque le faltan hechos presentes en la conversación del coordinador. ¿Qué problema de diseño debe revisarse primero?",
      [
        ["Whether the coordinator explicitly passed the required facts and provenance into the subagent context.","Si el coordinador pasó explícitamente los hechos requeridos y provenance al contexto del subagente."],
        ["Whether the subagent has a higher temperature.","Si el subagente tiene mayor temperature."],
        ["Whether every subagent uses the same name.","Si todos los subagentes usan el mismo nombre."],
        ["Whether the coordinator response contains more prose.","Si la respuesta del coordinador contiene más prosa."]
      ],[0],
      ["","Temperature does not recover information that was never provided to the subagent.","Agent names do not create shared memory.","More coordinator prose does not help unless the relevant context is actually supplied."],
      ["","Temperature no recupera información que nunca se proporcionó al subagente.","Los nombres de agentes no crean memoria compartida.","Más prosa del coordinador no ayuda si el contexto relevante no se entrega."],
      "Subagents operate with their own context. Information needed for the task should be passed explicitly rather than assumed to be shared.",
      "Los subagentes operan con contexto propio. La información necesaria debe pasarse explícitamente en vez de asumir memoria compartida.",
      "No assumed shared memory: pass required context explicitly.",
      "No asumas memoria compartida: pasa contexto requerido explícitamente.",D.subagents),

    T("PROVENANCE","d5-context","D5",
      "Several upstream sources disagree, and the final report must let a reviewer trace each important claim back to evidence. What should the coordinator preserve?",
      "Varias fuentes upstream están en conflicto y el reporte final debe permitir rastrear cada afirmación importante a su evidencia. ¿Qué debe preservar el coordinador?",
      [
        ["Structured provenance linking claims or findings to source identifiers and relevant metadata.","Provenance estructurado que vincule claims o hallazgos con identificadores de fuente y metadata relevante."],
        ["Only a prose summary that says 'sources disagree'.","Sólo un resumen en prosa que diga 'las fuentes discrepan'."],
        ["The URL of whichever source was fetched first.","La URL de la primera fuente recuperada."],
        ["A single confidence number with no source mapping.","Un único número de confidence sin mapeo a fuentes."]
      ],[0],
      ["","A prose note loses the claim-to-source relationship needed for auditability.","Fetch order is not a principled basis for choosing evidence.","A confidence scalar does not preserve which evidence supports or contradicts each claim."],
      ["","Una nota en prosa pierde la relación claim-fuente necesaria para auditabilidad.","El orden de fetch no es una base principiada para seleccionar evidencia.","Un escalar de confidence no conserva qué evidencia soporta o contradice cada claim."],
      "For reviewable systems, preserve source metadata and claim-to-source relationships so conflicting evidence can be surfaced rather than silently collapsed.",
      "Para sistemas revisables, preserva metadata de fuentes y relaciones claim-fuente para exponer evidencia conflictiva en vez de colapsarla silenciosamente.",
      "Auditability requires provenance, not just a summary.",
      "Auditabilidad requiere provenance, no sólo un resumen.",D.subagents),

    T("RESUME_REFRESH","d5-context","D5",
      "A previous session contains useful analysis, but a small subset of external files or records changed since that session. What is the safest reuse strategy?",
      "Una sesión previa contiene análisis útil, pero un pequeño subconjunto de archivos o registros externos cambió desde esa sesión. ¿Cuál es la estrategia de reutilización más segura?",
      [
        ["Resume useful context but explicitly re-read or re-fetch changed external state before relying on prior conclusions.","Reanudar el contexto útil pero volver a leer o recuperar explícitamente el estado externo modificado antes de confiar en conclusiones previas."],
        ["Assume session resumption automatically reconciles all external state.","Asumir que reanudar sesión reconcilia automáticamente todo estado externo."],
        ["Discard all prior analysis and always start from zero.","Descartar todo análisis previo y siempre comenzar desde cero."],
        ["Compact the session and treat the summary as proof the old external facts are still current.","Compactar la sesión y tratar el resumen como prueba de que los hechos externos siguen vigentes."]
      ],[0],
      ["","Session continuity does not automatically refresh facts that changed outside the conversation.","A full restart wastes valid context when only a bounded portion is stale.","Compaction reduces context size; it does not validate external freshness."],
      ["","La continuidad de sesión no refresca automáticamente hechos cambiados fuera de la conversación.","Reiniciar por completo desperdicia contexto válido cuando sólo una parte está stale.","Compaction reduce tamaño de contexto; no valida frescura externa."],
      "Reuse stable context while refreshing the external state known to have changed.",
      "Reutiliza contexto estable mientras refrescas el estado externo que sabes que cambió.",
      "Resume context; refresh changed reality.",
      "Reanuda contexto; refresca la realidad que cambió.",D.cli),

    T("EXACT_STATE","d5-context","D5",
      "A long-running case contains IDs, dates, monetary amounts, and status values that must remain exact while conversational history is summarized. How should the system handle them?",
      "Un caso de larga duración contiene IDs, fechas, montos y estados que deben permanecer exactos mientras el historial conversacional se resume. ¿Cómo debe manejarlos el sistema?",
      [
        ["Persist exact case facts in structured state separate from lossy conversational summaries.","Persistir hechos exactos del caso en estado estructurado separado de resúmenes conversacionales con pérdida."],
        ["Rely exclusively on progressively shorter natural-language summaries.","Depender exclusivamente de resúmenes en lenguaje natural cada vez más cortos."],
        ["Ask Claude to remember every value without storing them elsewhere.","Pedir a Claude que recuerde cada valor sin almacenarlos en otro lugar."],
        ["Round numeric values before summarization to reduce tokens.","Redondear valores numéricos antes de resumir para reducir tokens."]
      ],[0],
      ["","Summaries can omit or alter details; they are not the right canonical store for exact state.","Model context is not a durable structured database for exact business facts.","Rounding destroys required precision."],
      ["","Los resúmenes pueden omitir o alterar detalles; no son el lugar canónico para estado exacto.","El contexto del modelo no es una base estructurada durable para hechos exactos.","Redondear destruye la precisión requerida."],
      "Separate durable structured facts from narrative context so summarization can reduce tokens without corrupting exact state.",
      "Separa hechos estructurados durables del contexto narrativo para que resumir reduzca tokens sin corromper estado exacto.",
      "Exact business state deserves a structured source of truth.",
      "Estado de negocio exacto merece una fuente estructurada de verdad.",D.memory)
  ];
})();