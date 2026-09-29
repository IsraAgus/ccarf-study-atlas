(() => {
  const bank = window.CCARF_QUESTION_BANK || [];
  if (!bank.length) return;

  const profileNames = {
    you: { es: "Tú", en: "You" },
    partner: { es: "Pareja", en: "Partner" }
  };

  let profile = localStorage.getItem("ccarf-profile") || "you";
  let mode = localStorage.getItem("ccarf-mode-" + profile) || "study";

  function key(name) {
    return "ccarf-" + name + "-" + profile;
  }

  function loadJSON(k, fallback) {
    try {
      return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function loadProfile() {
    const legacyCompleted = profile === "you" ? loadJSON("ccarf-completed", {}) : {};
    state.completed = loadJSON(key("completed"), legacyCompleted);
    state.current = localStorage.getItem(key("current")) || "overview";
    mode = localStorage.getItem("ccarf-mode-" + profile) || "study";
  }

  function saveProfile() {
    localStorage.setItem(key("completed"), JSON.stringify(state.completed));
    localStorage.setItem(key("current"), state.current);
    localStorage.setItem("ccarf-mode-" + profile, mode);
  }

  function lesson() {
    return lessons.find((x) => x.id === state.current) || lessons[0];
  }

  function questionsForLesson(l) {
    const exact = bank.filter((q) => q.lessonId === l.id);
    if (exact.length) return exact;
    return bank.filter((q) => q.domain && l.group.includes(q.domain));
  }

  function questionForLesson(l) {
    const list = questionsForLesson(l);
    if (!list.length) return null;
    const history = loadJSON(key("question-stats"), { byQuestion: {} }).byQuestion || {};
    return list.find((q) => !history[q.id]) || list[0];
  }

  function sameSet(a, b) {
    const aa = [...a].sort((x, y) => x - y);
    const bb = [...b].sort((x, y) => x - y);
    return aa.length === bb.length && aa.every((v, i) => v === bb[i]);
  }

  function injectControls() {
    if (document.getElementById("practiceControls")) return;
    const host = document.querySelector(".top-actions");
    if (!host) return;

    const wrap = document.createElement("div");
    wrap.id = "practiceControls";
    wrap.className = "practice-controls";
    wrap.innerHTML =
      '<div class="segmented" role="group" aria-label="Study profile">' +
      '<button data-profile="you">Tú</button>' +
      '<button data-profile="partner">Pareja</button>' +
      '</div>' +
      '<div class="segmented" role="group" aria-label="Practice mode">' +
      '<button data-mode="study">Study</button>' +
      '<button data-mode="exam">Exam</button>' +
      '</div>';

    host.prepend(wrap);

    wrap.querySelectorAll("[data-profile]").forEach((button) => {
      button.onclick = () => {
        saveProfile();
        profile = button.dataset.profile;
        localStorage.setItem("ccarf-profile", profile);
        loadProfile();
        render();
      };
    });

    wrap.querySelectorAll("[data-mode]").forEach((button) => {
      button.onclick = () => {
        mode = button.dataset.mode;
        saveProfile();
        render();
      };
    });
  }

  function refreshControls() {
    document.querySelectorAll("[data-profile]").forEach((button) => {
      button.classList.toggle("active", button.dataset.profile === profile);
      if (button.dataset.profile === "you") {
        button.textContent = state.lang === "en" ? profileNames.you.en : profileNames.you.es;
      }
      if (button.dataset.profile === "partner") {
        button.textContent = state.lang === "en" ? profileNames.partner.en : profileNames.partner.es;
      }
    });

    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === mode);
    });
  }

  function scenarioQuestionHTML(q) {
    const multiple = q.type === "multiple";
    const selectionHint = multiple
      ? '<div class="select-hint"><span class="es-only">Selecciona exactamente ' +
        q.selectCount +
        '.</span><span class="en-only">Select exactly ' +
        q.selectCount +
        '.</span></div>'
      : "";

    return (
      '<section class="section certification-question" data-qid="' +
      q.id +
      '">' +
      '<div class="question-meta">' +
      '<span class="mode-chip">' +
      (mode === "study" ? "Study Mode" : "Exam Mode") +
      '</span><span>' +
      q.domain +
      '</span><span>' +
      q.id +
      "</span></div>" +
      '<div class="scenario-block">' +
      '<div class="scenario-label">SCENARIO:</div>' +
      '<p class="en-only">' +
      q.scenarioEN +
      '</p><p class="es-only">' +
      q.scenarioES +
      "</p></div>" +
      '<div class="question-block">' +
      '<div class="question-label">QUESTION:</div>' +
      '<p class="en-only">' +
      q.questionEN +
      '</p><p class="es-only">' +
      q.questionES +
      "</p>" +
      selectionHint +
      "</div>" +
      '<div class="cert-options">' +
      q.options
        .map(
          (option, i) =>
            '<label class="cert-option">' +
            '<input type="' +
            (multiple ? "checkbox" : "radio") +
            '" name="' +
            q.id +
            '" value="' +
            i +
            '">' +
            '<span class="choice-mark"></span>' +
            '<span><strong>' +
            String.fromCharCode(65 + i) +
            '.</strong> <span class="en-only">' +
            option.en +
            '</span><span class="es-only">' +
            option.es +
            "</span></span></label>"
        )
        .join("") +
      "</div>" +
      '<div class="question-actions"><button class="submit-answer">Submit answer / Enviar respuesta</button></div>' +
      '<div class="question-feedback"></div>' +
      "</section>"
    );
  }

  function renderFeedback(q, selected, correct) {
    const box = document.querySelector(".certification-question .question-feedback");
    if (!box) return;

    if (mode === "exam") {
      if (correct) {
        box.innerHTML =
          '<div class="feedback-card ok"><strong class="es-only">Correcto.</strong><strong class="en-only">Correct.</strong></div>';
        return;
      }

      const selectedWrong = selected.filter((i) => !q.correct.includes(i));
      const reasonEN = selectedWrong.length
        ? selectedWrong.map((i) => q.wrongReasonEN[i]).filter(Boolean).join(" ")
        : "The selected answer set does not match the required architectural decision.";
      const reasonES = selectedWrong.length
        ? selectedWrong.map((i) => q.wrongReasonES[i]).filter(Boolean).join(" ")
        : "El conjunto seleccionado no coincide con la decisión arquitectónica requerida.";

      box.innerHTML =
        '<div class="feedback-card bad">' +
        '<strong>Incorrect / Incorrecto</strong>' +
        '<p class="en-only"><strong>Why:</strong> ' +
        reasonEN +
        '</p><p class="es-only"><strong>Por qué:</strong> ' +
        reasonES +
        "</p>" +
        '<p class="en-only"><strong>Correct answer:</strong> ' +
        q.correct.map((i) => String.fromCharCode(65 + i) + ". " + q.options[i].en).join(" · ") +
        '</p><p class="es-only"><strong>Respuesta correcta:</strong> ' +
        q.correct.map((i) => String.fromCharCode(65 + i) + ". " + q.options[i].es).join(" · ") +
        "</p></div>";
      return;
    }

    const wrongSelections = selected.filter((i) => !q.correct.includes(i));
    const missingCorrect = q.correct.filter((i) => !selected.includes(i));

    const wrongHTML = wrongSelections
      .map(
        (i) =>
          '<div class="distractor-reason"><strong>' +
          String.fromCharCode(65 + i) +
          '.</strong><span class="en-only">' +
          q.wrongReasonEN[i] +
          '</span><span class="es-only">' +
          q.wrongReasonES[i] +
          "</span></div>"
      )
      .join("");

    const missingHTML = missingCorrect.length
      ? '<p class="en-only"><strong>Missing correct choice:</strong> ' +
        missingCorrect.map((i) => String.fromCharCode(65 + i)).join(", ") +
        '</p><p class="es-only"><strong>Faltó seleccionar:</strong> ' +
        missingCorrect.map((i) => String.fromCharCode(65 + i)).join(", ") +
        "</p>"
      : "";

    box.innerHTML =
      '<div class="feedback-card ' +
      (correct ? "ok" : "bad") +
      '">' +
      '<strong>' +
      (correct ? "Correct / Correcto" : "Review the reasoning / Revisa el razonamiento") +
      "</strong>" +
      wrongHTML +
      missingHTML +
      '<p class="en-only"><strong>Correct answer:</strong> ' +
      q.correct.map((i) => String.fromCharCode(65 + i) + ". " + q.options[i].en).join(" · ") +
      '</p><p class="es-only"><strong>Respuesta correcta:</strong> ' +
      q.correct.map((i) => String.fromCharCode(65 + i) + ". " + q.options[i].es).join(" · ") +
      "</p>" +
      '<p class="en-only"><strong>Why:</strong> ' +
      q.rationaleEN +
      '</p><p class="es-only"><strong>Por qué:</strong> ' +
      q.rationaleES +
      "</p>" +
      '<p class="en-only"><strong>Decision rule:</strong> ' +
      q.ruleEN +
      '</p><p class="es-only"><strong>Regla de decisión:</strong> ' +
      q.ruleES +
      "</p>" +
      '<div class="feedback-links">' +
      '<a href="#concept-review"><span class="es-only">Repasar este concepto ↑</span><span class="en-only">Review this concept ↑</span></a>' +
      '<a target="_blank" rel="noopener" href="' +
      q.doc.url +
      '">' +
      q.doc.label +
      " ↗</a></div></div>";
  }

  function bindQuestion(q) {
    const root = document.querySelector(".certification-question");
    if (!root) return;

    const submit = root.querySelector(".submit-answer");
    submit.onclick = () => {
      const selected = [...root.querySelectorAll("input:checked")].map((x) => Number(x.value));

      if (!selected.length) {
        alert(state.lang === "en" ? "Select an answer first." : "Selecciona una respuesta primero.");
        return;
      }

      if (q.type === "multiple" && selected.length !== q.selectCount) {
        alert(
          state.lang === "en"
            ? "Select exactly " + q.selectCount + " answers."
            : "Selecciona exactamente " + q.selectCount + " respuestas."
        );
        return;
      }

      const correct = sameSet(selected, q.correct);
      root.querySelectorAll("input").forEach((input) => (input.disabled = true));

      root.querySelectorAll(".cert-option").forEach((option, i) => {
        if (q.correct.includes(i)) option.classList.add("correct");
        if (selected.includes(i) && !q.correct.includes(i)) option.classList.add("wrong");
      });

      const stats = loadJSON(key("question-stats"), {
        answered: 0,
        correct: 0,
        byQuestion: {}
      });

      stats.answered += 1;
      if (correct) stats.correct += 1;
      stats.byQuestion[q.id] = {
        selected,
        answer: q.correct,
        correct,
        mode,
        at: new Date().toISOString(),
        lessonId: q.lessonId,
        scenarioId: q.scenarioId
      };
      saveJSON(key("question-stats"), stats);

      renderFeedback(q, selected, correct);
      applyLang();
    };
  }

  loadProfile();

  const originalRender = render;
  render = function enhancedRender() {
    originalRender();
    injectControls();
    refreshControls();
    saveProfile();

    const hero = document.querySelector(".hero");
    if (hero) hero.id = "concept-review";

    const genericQuiz = document.querySelector(".exam-box")?.closest(".section");
    if (genericQuiz) genericQuiz.remove();

    const l = lesson();
    const q = questionForLesson(l);
    if (q) {
      const sections = [...document.querySelectorAll("#content > .section")];
      const sources = sections.find((section) =>
        section.querySelector("h3")?.textContent.includes("Sources")
      );
      const holder = document.createElement("div");
      holder.innerHTML = scenarioQuestionHTML(q);
      const node = holder.firstElementChild;
      if (sources) sources.before(node);
      else document.getElementById("content").appendChild(node);
      bindQuestion(q);
    }

    const complete = document.getElementById("completeCheck");
    if (complete) {
      complete.checked = Boolean(state.completed[l.id]);
      complete.onchange = (event) => {
        state.completed[l.id] = event.target.checked;
        saveProfile();
        renderNav(document.getElementById("searchInput").value);
        updateProgress();
      };
    }

    const toolbar = document.querySelector(".toolbar-card");
    if (toolbar && !toolbar.querySelector(".learner-note")) {
      const note = document.createElement("span");
      note.className = "learner-note";
      note.innerHTML =
        '<span class="es-only">Perfil: <strong>' +
        profileNames[profile].es +
        '</strong> · Modo: <strong>' +
        (mode === "study" ? "Estudio" : "Examen") +
        '</strong></span><span class="en-only">Profile: <strong>' +
        profileNames[profile].en +
        '</strong> · Mode: <strong>' +
        (mode === "study" ? "Study" : "Exam") +
        "</strong></span>";
      toolbar.appendChild(note);
    }

    applyLang();
  };

  const originalRenderNav = renderNav;
  renderNav = function enhancedRenderNav(filter = "") {
    originalRenderNav(filter);
    document.querySelectorAll(".nav-item").forEach((button) => {
      const original = button.onclick;
      button.onclick = (event) => {
        if (original) original(event);
        saveProfile();
      };
    });
  };

  const originalApplyLang = applyLang;
  applyLang = function enhancedApplyLang() {
    originalApplyLang();
    refreshControls();
  };

  const reset = document.getElementById("resetBtn");
  if (reset) {
    reset.onclick = () => {
      const message =
        state.lang === "en"
          ? "Reset progress for " + profileNames[profile].en + "?"
          : "¿Reiniciar el progreso de " + profileNames[profile].es + "?";
      if (!confirm(message)) return;

      state.completed = {};
      localStorage.removeItem(key("completed"));
      localStorage.removeItem(key("question-stats"));
      localStorage.removeItem(key("current"));
      render();
    };
  }

  render();
})();