(() => {
  const scenarios = {
    "customer-support": {
      prefix:"SUP",
      en:"You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests such as returns, billing disputes, and account issues, and connects to backend systems through MCP tools.",
      es:"Estás construyendo un agente de resolución de soporte al cliente usando Claude Agent SDK. El agente maneja solicitudes ambiguas como devoluciones, disputas de facturación y problemas de cuenta, y se conecta a sistemas backend mediante herramientas MCP."
    },
    "code-generation": {
      prefix:"CODE",
      en:"You are using Claude Code for code generation, refactoring, debugging, and documentation across a production repository. The team needs safe, repeatable workflows that preserve project conventions.",
      es:"Estás usando Claude Code para generación de código, refactoring, debugging y documentación en un repositorio de producción. El equipo necesita workflows seguros y repetibles que preserven las convenciones del proyecto."
    },
    "multi-agent-research": {
      prefix:"RES",
      en:"You are building a multi-agent research system using the Claude Agent SDK. A coordinator delegates to specialized subagents for search, document analysis, synthesis, and report generation.",
      es:"Estás construyendo un sistema de investigación multiagente usando Claude Agent SDK. Un coordinador delega en subagentes especializados para búsqueda, análisis documental, síntesis y generación de reportes."
    },
    "developer-productivity": {
      prefix:"DEV",
      en:"You are building developer productivity tooling with Claude Agent SDK and Claude Code. The system explores unfamiliar codebases, automates repetitive work, and integrates built-in tools and MCP servers.",
      es:"Estás construyendo herramientas de productividad para desarrolladores con Claude Agent SDK y Claude Code. El sistema explora codebases desconocidos, automatiza trabajo repetitivo e integra herramientas built-in y servidores MCP."
    },
    "claude-code-ci": {
      prefix:"CI",
      en:"You are integrating Claude Code into a CI/CD pipeline for automated reviews, test generation, and pull-request feedback. Runs must be reliable, non-interactive, and machine-consumable.",
      es:"Estás integrando Claude Code en un pipeline CI/CD para reviews automatizados, generación de pruebas y feedback en pull requests. Las ejecuciones deben ser confiables, no interactivas y consumibles por máquinas."
    },
    "structured-extraction": {
      prefix:"EXT",
      en:"You are building a structured data extraction system using Claude. It extracts information from unstructured documents, validates outputs, handles edge cases, and feeds downstream systems.",
      es:"Estás construyendo un sistema de extracción de datos estructurados con Claude. Extrae información de documentos no estructurados, valida outputs, maneja edge cases y alimenta sistemas downstream."
    }
  };

  const existing = window.CCARF_QUESTION_BANK || [];
  const templates = window.CCARF_TEMPLATE_BANK || [];
  const known = new Set(existing.map(q => q.id));
  const generated = [];

  for (const [scenarioId, scenario] of Object.entries(scenarios)) {
    for (const template of templates) {
      const id = scenario.prefix + "-" + template.family;
      if (known.has(id)) continue;
      generated.push({
        ...template,
        id,
        scenarioId,
        scenarioEN:scenario.en,
        scenarioES:scenario.es,
        generatedVariant:true
      });
      known.add(id);
    }
  }

  window.CCARF_SCENARIOS = Object.fromEntries(
    Object.entries(scenarios).map(([id, value]) => [id,{id,...value}])
  );
  window.CCARF_QUESTION_BANK = existing.concat(generated);
  window.CCARF_BANK_META = {
    baseQuestions: existing.length,
    templateFamilies: templates.length,
    generatedQuestions: generated.length,
    totalQuestions: window.CCARF_QUESTION_BANK.length,
    scenarioCount: Object.keys(scenarios).length
  };
})();