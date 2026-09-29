(() => {
  const profiles = {
    you: { es: 'Tú', en: 'You' },
    partner: { es: 'Pareja', en: 'Partner' }
  };

  let activeProfile = localStorage.getItem('ccarf-profile') || 'you';
  const profileKey = (name) => `ccarf-${name}-${activeProfile}`;

  function readJson(key, fallback = {}) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }

  function loadProfile() {
    const legacyCompleted = activeProfile === 'you' ? readJson('ccarf-completed', {}) : {};
    state.completed = readJson(profileKey('completed'), legacyCompleted);
    state.current = localStorage.getItem(profileKey('current')) || state.current || 'overview';
  }

  function saveProfileProgress() {
    localStorage.setItem(profileKey('completed'), JSON.stringify(state.completed));
    localStorage.setItem(profileKey('current'), state.current);
  }

  loadProfile();
  let practiceMode = localStorage.getItem(profileKey('mode')) || 'study';

  const sources = {
    overview: ['Anthropic certification', 'https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification'],
    foundations: ['Tool use overview', 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview'],
    'd1-loop': ['How tool use works', 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works'],
    'd1-orchestration': ['Claude Code subagents', 'https://code.claude.com/docs/en/sub-agents'],
    'd1-enforcement': ['Claude Code hooks', 'https://code.claude.com/docs/en/hooks'],
    'd2-tools': ['Tool use overview', 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview'],
    'd2-mcp': ['Claude Code MCP', 'https://code.claude.com/docs/en/mcp'],
    'd3-code': ['CLAUDE.md / memory', 'https://code.claude.com/docs/en/memory'],
    'd3-workflows': ['Claude Code CLI reference', 'https://code.claude.com/docs/en/cli-reference'],
    'd4-prompt': ['Prompt engineering best practices', 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices'],
    'd4-structured': ['Structured outputs', 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs'],
    'd5-context': ['Claude Code subagents', 'https://code.claude.com/docs/en/sub-agents'],
    scenarios: ['Anthropic certification', 'https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification'],
    plan: ['Anthropic certification', 'https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification']
  };

  const wrongReasons = {
    'd1-loop': {
      0: { es: 'La presencia de texto del assistant no es una señal de finalización. Una respuesta puede incluir texto y bloques tool_use en el mismo turno.', en: 'Assistant text is not a completion signal. A response may contain both text and tool_use blocks in the same turn.' },
      1: { es: 'Un límite fijo puede servir como guardrail operativo, pero no expresa que la tarea terminó correctamente. El lifecycle debe seguir las señales estructuradas de la API.', en: 'A fixed cap can be an operational guardrail, but it does not mean the task completed correctly. Lifecycle control should follow structured API signals.' },
      3: { es: 'Un regex sobre lenguaje natural vuelve a inferir estado desde prosa. stop_reason ya representa ese estado de forma estructurada.', en: 'A regex over natural language still infers state from prose. stop_reason already represents that state structurally.' }
    },
    'd1-enforcement': {
      0: { es: 'Few-shot mejora comportamiento, pero sigue siendo guidance probabilística. No impide físicamente que una operación crítica ocurra fuera de orden.', en: 'Few-shot examples improve behavior but remain probabilistic guidance. They do not physically prevent a critical action from occurring out of order.' },
      1: { es: 'Un system prompt puede reducir la frecuencia del fallo, pero no convierte el requisito en una garantía determinista.', en: 'A system prompt may reduce failure frequency, but it does not turn the requirement into a deterministic guarantee.' },
      3: { es: 'CLAUDE.md comunica instrucciones, no sustituye un control de ejecución. El problema requiere enforcement, no más contexto.', en: 'CLAUDE.md communicates instructions; it does not replace execution control. The problem requires enforcement, not more context.' }
    },
    'd2-tools': {
      0: { es: 'Agregar un classifier introduce complejidad antes de corregir la causa raíz: interfaces de tools ambiguas.', en: 'Adding a classifier introduces complexity before fixing the root cause: ambiguous tool interfaces.' },
      2: { es: 'Fusionar tools elimina separación de responsabilidades y no corrige necesariamente por qué Claude no distingue sus propósitos.', en: 'Merging tools removes separation of responsibilities and does not necessarily fix why Claude cannot distinguish their purposes.' },
      3: { es: 'Forzar siempre una tool sacrifica la capacidad de selección y puede ser incorrecto para solicitudes donde esa tool no aplica.', en: 'Always forcing one tool sacrifices selection ability and can be wrong for requests where that tool does not apply.' }
    },
    'd2-mcp': {
      0: { es: 'La configuración personal no viaja con el repositorio, así que no satisface un requisito de configuración compartida por el equipo.', en: 'Personal configuration does not travel with the repository, so it does not satisfy a team-shared configuration requirement.' },
      2: { es: 'Un prompt example no es un mecanismo de distribución de configuración MCP.', en: 'A prompt example is not a mechanism for distributing MCP configuration.' },
      3: { es: 'La salida del modelo no es una ubicación persistente ni versionable para configuración de infraestructura.', en: 'Model output is not a persistent or version-controlled location for infrastructure configuration.' }
    },
    'd3-code': {
      0: { es: 'Copiar instrucciones por muchos directorios duplica mantenimiento y no expresa bien una regla transversal basada en patrones de archivos.', en: 'Copying instructions across many directories duplicates maintenance and poorly represents a cross-cutting file-pattern rule.' },
      2: { es: 'Una skill es un workflow bajo demanda; no es la mejor forma de aplicar automáticamente una convención a todos los archivos coincidentes.', en: 'A skill is an on-demand workflow; it is not the best mechanism for automatically applying a convention to every matching file.' },
      3: { es: 'Una regla user-level es personal y siempre cargada; no modela de forma eficiente una convención compartida y condicionada por path.', en: 'A user-level rule is personal and broadly loaded; it does not efficiently model a shared path-conditioned convention.' }
    }
  };

  function currentLesson() {
    return lessons.find((x) => x.id === state.current) || lessons[0];
  }

  function reasonFor(lesson, selected) {
    const mapped = wrongReasons[lesson.id]?.[selected];
    if (mapped) return mapped;
    return {
      es: `${lesson.trapES} La opción seleccionada no resuelve de forma proporcional la causa raíz descrita en el escenario.`,
      en: `${lesson.trapEN} The selected option does not proportionately address the root cause described in the scenario.`
    };
  }

  function letter(i) { return String.fromCharCode(65 + i); }

  function feedbackMarkup(lesson, selected, answer, mode) {
    const correct = selected === answer;
    const why = reasonFor(lesson, selected);
    const source = sources[lesson.id] || sources.foundations;

    if (mode === 'exam') {
      if (correct) {
        return `<div class="mode-feedback exam-feedback correct-feedback"><strong class="es-only">Correcto.</strong><strong class="en-only">Correct.</strong></div>`;
      }
      return `<div class="mode-feedback exam-feedback wrong-feedback">
        <div class="feedback-title es-only">Incorrecto · respuesta correcta: ${letter(answer)}</div>
        <div class="feedback-title en-only">Incorrect · correct answer: ${letter(answer)}</div>
        <p class="es-only"><strong>Por qué estuvo mal:</strong> ${why.es}</p>
        <p class="en-only"><strong>Why it was wrong:</strong> ${why.en}</p>
        <p><strong>${letter(answer)}.</strong> ${lesson.options[answer]}</p>
      </div>`;
    }

    return `<div class="mode-feedback study-feedback ${correct ? 'correct-feedback' : 'wrong-feedback'}">
      <div class="feedback-title es-only">${correct ? 'Correcto: el razonamiento está alineado.' : 'Dónde estuvo el error'}</div>
      <div class="feedback-title en-only">${correct ? 'Correct: the reasoning is aligned.' : 'Where the reasoning failed'}</div>
      ${correct ? '' : `<p class="es-only"><strong>Causa del error:</strong> ${why.es}</p><p class="en-only"><strong>Cause of the error:</strong> ${why.en}</p><p class="es-only"><strong>Respuesta correcta:</strong> ${letter(answer)}. ${lesson.options[answer]}</p><p class="en-only"><strong>Correct answer:</strong> ${letter(answer)}. ${lesson.options[answer]}</p>`}
      <p class="es-only"><strong>Regla de decisión:</strong> ${lesson.ruleES}</p>
      <p class="en-only"><strong>Decision rule:</strong> ${lesson.ruleEN}</p>
      <p class="es-only"><strong>Explicación:</strong> ${lesson.answerES}</p>
      <p class="en-only"><strong>Explanation:</strong> ${lesson.answerEN}</p>
      <div class="feedback-actions">
        <a class="review-link internal-review" href="#concept-review"><span class="es-only">Repasar este concepto ↑</span><span class="en-only">Review this concept ↑</span></a>
        <a class="review-link official-review" href="${source[1]}" target="_blank" rel="noopener"><span class="es-only">Documentación oficial: ${source[0]} ↗</span><span class="en-only">Official docs: ${source[0]} ↗</span></a>
      </div>
    </div>`;
  }

  function injectControls() {
    if (document.getElementById('studyModeControls')) return;
    const topActions = document.querySelector('.top-actions');
    if (!topActions) return;
    const controls = document.createElement('div');
    controls.id = 'studyModeControls';
    controls.className = 'study-mode-controls';
    controls.innerHTML = `<div class="profile-control" role="group" aria-label="Study profile"><button class="profile-btn" data-profile="you">Tú</button><button class="profile-btn" data-profile="partner">Pareja</button></div><div class="mode-control" role="group" aria-label="Practice mode"><button class="practice-mode-btn" data-mode="study">Study</button><button class="practice-mode-btn" data-mode="exam">Exam</button></div>`;
    topActions.prepend(controls);

    controls.querySelectorAll('.profile-btn').forEach((btn) => btn.addEventListener('click', () => {
      saveProfileProgress();
      activeProfile = btn.dataset.profile;
      localStorage.setItem('ccarf-profile', activeProfile);
      loadProfile();
      practiceMode = localStorage.getItem(profileKey('mode')) || 'study';
      render();
    }));

    controls.querySelectorAll('.practice-mode-btn').forEach((btn) => btn.addEventListener('click', () => {
      practiceMode = btn.dataset.mode;
      localStorage.setItem(profileKey('mode'), practiceMode);
      render();
    }));
  }

  function refreshControls() {
    document.querySelectorAll('.profile-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.profile === activeProfile);
      if (btn.dataset.profile === 'you') btn.textContent = state.lang === 'en' ? profiles.you.en : profiles.you.es;
      if (btn.dataset.profile === 'partner') btn.textContent = state.lang === 'en' ? profiles.partner.en : profiles.partner.es;
    });
    document.querySelectorAll('.practice-mode-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === practiceMode));
  }

  const originalRender = render;
  render = function enhancedRender() {
    originalRender();
    injectControls();
    refreshControls();
    saveProfileProgress();

    const hero = document.querySelector('.hero');
    if (hero) hero.id = 'concept-review';

    const box = document.querySelector('.exam-box');
    if (box) {
      const heading = box.closest('.section')?.querySelector('h3');
      if (heading) heading.textContent = practiceMode === 'study' ? 'Study check / Comprobación de estudio' : 'Exam check / Comprobación de examen';
      box.dataset.mode = practiceMode;
      box.querySelector('.answer-explain')?.remove();
      box.querySelectorAll('.option').forEach((btn) => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
        btn.onclick = () => handleQuiz(btn);
      });
    }

    const complete = document.getElementById('completeCheck');
    if (complete) complete.onchange = (e) => {
      state.completed[state.current] = e.target.checked;
      saveProfileProgress();
      renderNav(document.getElementById('searchInput').value);
      updateProgress();
    };

    const marker = document.querySelector('.toolbar-card');
    if (marker && !marker.querySelector('.active-profile-note')) {
      const note = document.createElement('div');
      note.className = 'active-profile-note';
      note.innerHTML = `<span class="es-only">Perfil: <strong>${profiles[activeProfile].es}</strong> · Modo: <strong>${practiceMode === 'study' ? 'Estudio' : 'Examen'}</strong></span><span class="en-only">Profile: <strong>${profiles[activeProfile].en}</strong> · Mode: <strong>${practiceMode === 'study' ? 'Study' : 'Exam'}</strong></span>`;
      marker.appendChild(note);
    }
  };

  handleQuiz = function enhancedQuiz(btn) {
    const lesson = currentLesson();
    const box = btn.closest('.exam-box');
    const answer = Number(box.dataset.answer);
    const selected = Number(btn.dataset.i);
    const correct = selected === answer;
    box.querySelectorAll('.option').forEach((b, j) => {
      b.disabled = true;
      if (j === answer) b.classList.add('correct');
      if (j === selected && !correct) b.classList.add('wrong');
    });
    box.querySelector('.mode-feedback')?.remove();
    box.insertAdjacentHTML('beforeend', feedbackMarkup(lesson, selected, answer, practiceMode));

    const statsKey = profileKey('quiz-stats');
    const stats = readJson(statsKey, { answered: 0, correct: 0, byLesson: {} });
    stats.answered += 1;
    if (correct) stats.correct += 1;
    stats.byLesson[lesson.id] = { selected, answer, correct, mode: practiceMode, at: new Date().toISOString() };
    localStorage.setItem(statsKey, JSON.stringify(stats));
    applyLang();
  };

  const originalApplyLang = applyLang;
  applyLang = function enhancedApplyLang() {
    originalApplyLang();
    refreshControls();
  };

  const legacyReset = document.getElementById('resetBtn');
  if (legacyReset) legacyReset.onclick = () => {
    const msg = state.lang === 'en' ? `Reset progress for ${profiles[activeProfile].en}?` : `¿Reiniciar el progreso de ${profiles[activeProfile].es}?`;
    if (!confirm(msg)) return;
    state.completed = {};
    localStorage.removeItem(profileKey('completed'));
    localStorage.removeItem(profileKey('quiz-stats'));
    render();
  };

  render();
})();
