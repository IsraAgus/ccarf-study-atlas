(() => {
  const D = {
    parallel:["Parallel tool use","https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use"],
    structured:["Structured outputs","https://platform.claude.com/docs/en/build-with-claude/structured-outputs"],
    memory:["Claude Code memory","https://code.claude.com/docs/en/memory"],
    skills:["Claude Code skills","https://code.claude.com/docs/en/skills"],
    subagents:["Claude Code subagents","https://code.claude.com/docs/en/sub-agents"]
  };
  const T=(family,lessonId,domain,questionEN,questionES,options,correct,wrongEN,wrongES,rationaleEN,rationaleES,ruleEN,ruleES,doc)=>({
    family,lessonId,domain,type:"multiple",selectCount:2,questionEN,questionES,
    options:options.map(([en,es])=>({en,es})),correct,wrongReasonEN:wrongEN,wrongReasonES:wrongES,
    rationaleEN,rationaleES,ruleEN,ruleES,doc:{label:doc[0],url:doc[1]}
  });
  window.CCARF_TEMPLATE_BANK=(window.CCARF_TEMPLATE_BANK||[]).concat([
    T("MULTI_PARALLEL","d1-orchestration","D1",
      "Claude emits multiple tool calls in one turn. Which two statements correctly guide execution? Select two.",
      "Claude emite múltiples llamadas a tools en un turno. ¿Qué dos afirmaciones guían correctamente la ejecución? Selecciona dos.",
      [
        ["Independent read-only calls can usually run concurrently.","Llamadas read-only independientes normalmente pueden ejecutarse concurrentemente."],
        ["Calls with ordering requirements or shared side effects may need sequential execution.","Llamadas con requisitos de orden o efectos compartidos pueden necesitar ejecución secuencial."],
        ["Every tool_use block must always execute strictly in the order returned.","Todo bloque tool_use siempre debe ejecutarse estrictamente en el orden devuelto."],
        ["Parallel calls require merging the tools into one schema first.","Las llamadas paralelas requieren fusionar primero las tools en un solo schema."]
      ],[0,1],["","","The API does not require universal sequential execution; strategy depends on tool semantics.","Parallel execution does not require merging tool definitions."],["","","La API no exige ejecución secuencial universal; la estrategia depende de la semántica de las tools.","La ejecución paralela no requiere fusionar definiciones de tools."],
      "Execution order is an application decision. Independent calls can run concurrently, while shared-state or order-sensitive actions may need sequencing.",
      "El orden de ejecución es una decisión de la aplicación. Llamadas independientes pueden correr concurrentemente; acciones con estado compartido u orden pueden requerir secuencia.",
      "Parallelize independence; preserve required ordering.","Paraleliza independencia; preserva el orden requerido.",D.parallel),

    T("MULTI_CLAUDEMD","d3-code","D3",
      "A team wants consistent project standards across developers and CI. Which two configuration practices align best? Select two.",
      "Un equipo quiere estándares de proyecto consistentes entre desarrolladores y CI. ¿Qué dos prácticas de configuración se alinean mejor? Selecciona dos.",
      [
        ["Commit shared project standards in a repository-level CLAUDE.md.","Versionar estándares compartidos en un CLAUDE.md a nivel repositorio."],
        ["Keep always-loaded CLAUDE.md content focused and concise, moving task-specific material to better-scoped mechanisms.","Mantener el CLAUDE.md siempre cargado enfocado y conciso, moviendo material task-specific a mecanismos mejor scoped."],
        ["Store team standards only in each developer's user-level CLAUDE.md.","Guardar estándares del equipo sólo en el CLAUDE.md user-level de cada desarrollador."],
        ["Use CLAUDE.md as the tool-permission enforcement file.","Usar CLAUDE.md como archivo de enforcement de permisos de tools."]
      ],[0,1],["","","User-level instructions are personal and do not reliably propagate to CI or teammates.","CLAUDE.md is context and guidance, not the permission enforcement surface."],["","","Las instrucciones user-level son personales y no se propagan confiablemente a CI ni compañeros.","CLAUDE.md es contexto y guidance, no la superficie de enforcement de permisos."],
      "Project-level instructions should travel with the repository, and concise always-loaded context improves reliability.",
      "Las instrucciones de proyecto deben viajar con el repositorio y un contexto siempre cargado conciso mejora confiabilidad.",
      "Shared and always needed means project CLAUDE.md; keep it scoped.","Compartido y siempre necesario significa CLAUDE.md de proyecto; mantenlo scoped.",D.memory),

    T("MULTI_STRUCTURED","d4-structured","D4",
      "Which two statements about structured outputs are correct? Select two.",
      "¿Qué dos afirmaciones sobre structured outputs son correctas? Selecciona dos.",
      [
        ["JSON outputs can guarantee that the response conforms to the supported schema shape.","JSON outputs pueden garantizar que la respuesta cumpla la forma soportada del schema."],
        ["Schema conformance does not by itself guarantee that extracted facts are semantically correct or present in the source.","La conformidad con schema no garantiza por sí sola que los hechos extraídos sean semánticamente correctos o estén presentes en la fuente."],
        ["A valid schema removes the need to handle source documents with missing business data.","Un schema válido elimina la necesidad de manejar documentos con datos de negocio faltantes."],
        ["Structured output guarantees the correct business interpretation for every ambiguous case.","Structured output garantiza la interpretación de negocio correcta en todo caso ambiguo."]
      ],[0,1],["","","Missing source data remains a semantic condition even when the JSON shape is valid.","Schema constraints control form, not every business judgment."],["","","Datos faltantes en la fuente siguen siendo una condición semántica aunque el JSON sea válido.","Las restricciones de schema controlan forma, no todo juicio de negocio."],
      "Structured outputs solve parseability and schema-shape problems; semantic grounding and business correctness still require appropriate validation and prompting.",
      "Structured outputs resuelven parseabilidad y forma del schema; grounding semántico y exactitud de negocio aún requieren validación y prompting apropiados.",
      "Validated shape and validated meaning are different layers.","Forma validada y significado validado son capas distintas.",D.structured),

    T("MULTI_SKILL_PERMISSIONS","d3-code","D3",
      "A Claude Code skill uses allowed-tools. Which two statements are correct? Select two.",
      "Una skill de Claude Code usa allowed-tools. ¿Qué dos afirmaciones son correctas? Selecciona dos.",
      [
        ["Listed tools are pre-approved for the turn that invokes the skill.","Las tools listadas quedan pre-aprobadas durante el turno que invoca la skill."],
        ["Unlisted tools can still be callable under the normal permission system.","Tools no listadas pueden seguir disponibles bajo el sistema normal de permisos."],
        ["The grant persists for the entire session as long as the skill text remains in context.","El grant persiste toda la sesión mientras el texto de la skill siga en contexto."],
        ["Omitting a tool from allowed-tools is equivalent to a deny rule.","Omitir una tool de allowed-tools equivale a una regla deny."]
      ],[0,1],["","","The permission grant clears on the next user message even though skill content can remain in context.","Omission is not a deny; use a blocking control when blocking is required."],["","","El grant de permisos se limpia con el siguiente mensaje user aunque el contenido de la skill pueda permanecer en contexto.","Omitir no equivale a deny; usa un control de bloqueo cuando se requiera bloqueo."],
      "allowed-tools is a turn-scoped pre-approval mechanism, not a persistent restrictive allowlist.",
      "allowed-tools es un mecanismo de pre-aprobación turn-scoped, no una allowlist restrictiva persistente.",
      "Pre-approve is not the same as restrict.","Pre-aprobar no es lo mismo que restringir.",D.skills),

    T("MULTI_RELIABILITY","d5-context","D5",
      "A long-running workflow must survive summarization while remaining auditable. Which two data-handling choices are strongest? Select two.",
      "Un workflow de larga duración debe sobrevivir a summarization y seguir siendo auditable. ¿Qué dos decisiones de manejo de datos son más fuertes? Selecciona dos.",
      [
        ["Persist exact IDs, dates, amounts, and statuses in structured state outside lossy summaries.","Persistir IDs, fechas, montos y estados exactos en estado estructurado fuera de resúmenes con pérdida."],
        ["Preserve provenance that maps important claims or findings back to their sources.","Preservar provenance que mapee claims o hallazgos importantes a sus fuentes."],
        ["Rely only on progressively shorter natural-language summaries as the canonical database.","Depender sólo de resúmenes cada vez más cortos como base de datos canónica."],
        ["Drop source metadata after synthesis to reduce tokens.","Eliminar metadata de fuentes después de la síntesis para reducir tokens."]
      ],[0,1],["","","Lossy summaries are not a reliable canonical store for exact state.","Discarding provenance removes auditability and conflict-resolution context."],["","","Resúmenes con pérdida no son un almacén canónico confiable para estado exacto.","Descartar provenance elimina auditabilidad y contexto para resolver conflictos."],
      "Reliability improves when exact operational state and provenance are preserved independently from conversational summaries.",
      "La confiabilidad mejora cuando estado operacional exacto y provenance se preservan independientemente de resúmenes conversacionales.",
      "Summaries compress narrative; structured state preserves invariants.","Los resúmenes comprimen narrativa; estado estructurado preserva invariantes.",D.subagents)
  ]);
})();