(() => {
  function sourcePill(source) {
    return '<a class="official-source-pill" href="' + source[1] + '" target="_blank" rel="noopener">' +
      '<span>Anthropic</span><strong>' + source[0] + '</strong><b>↗</b></a>';
  }

  function theoryHTML(lessonId) {
    const theory = window.CCARF_OFFICIAL_THEORY?.[lessonId];
    if (!theory) return "";

    return '<section class="official-theory section" id="official-theory">' +
      '<div class="theory-heading">' +
        '<div>' +
          '<div class="theory-kicker">Official Anthropic theory / Teoría oficial de Anthropic</div>' +
          '<h3><span class="es-only">Explicación conceptual detallada</span><span class="en-only">Detailed conceptual explanation</span></h3>' +
          '<p class="section-lead es-only">' + theory.leadES + '</p>' +
          '<p class="section-lead en-only">' + theory.leadEN + '</p>' +
        '</div>' +
        '<div class="theory-trust-badge">' +
          '<strong>100%</strong>' +
          '<span class="es-only">basado en fuentes oficiales de Anthropic</span>' +
          '<span class="en-only">based on official Anthropic sources</span>' +
        '</div>' +
      '</div>' +
      '<div class="theory-stack">' +
        theory.sections.map((s,index) =>
          '<article class="theory-card">' +
            '<div class="theory-index">' + String(index + 1).padStart(2,"0") + '</div>' +
            '<div class="theory-card-body">' +
              '<h4 class="es-only">' + s.titleES + '</h4>' +
              '<h4 class="en-only">' + s.titleEN + '</h4>' +
              '<div class="theory-copy es-only">' +
                s.bodyES.map(p => '<p>' + p + '</p>').join('') +
                (s.bulletsES?.length ? '<ul>' + s.bulletsES.map(x => '<li>' + x + '</li>').join('') + '</ul>' : '') +
              '</div>' +
              '<div class="theory-copy en-only">' +
                s.bodyEN.map(p => '<p>' + p + '</p>').join('') +
                (s.bulletsEN?.length ? '<ul>' + s.bulletsEN.map(x => '<li>' + x + '</li>').join('') + '</ul>' : '') +
              '</div>' +
              '<div class="official-source-row">' +
                s.sources.map(sourcePill).join('') +
              '</div>' +
            '</div>' +
          '</article>'
        ).join('') +
      '</div>' +
      '<div class="theory-boundary-note">' +
        '<span class="es-only"><strong>Separación de fuentes:</strong> esta sección contiene únicamente teoría derivada de documentación oficial de Anthropic. Los “Exam traps” del candidato aparecen aparte y no se usan como fuente técnica aquí.</span>' +
        '<span class="en-only"><strong>Source boundary:</strong> this section contains only theory derived from official Anthropic documentation. Candidate “Exam traps” appear separately and are not used as technical sources here.</span>' +
      '</div>' +
    '</section>';
  }

  function injectTheory() {
    const current = typeof state !== "undefined" ? state.current : null;
    if (!current) return;

    const html = theoryHTML(current);
    if (!html) return;

    document.getElementById("official-theory")?.remove();

    const content = document.getElementById("content");
    if (!content) return;

    const conceptGrid = content.querySelector(".card-grid");
    const conceptSection = conceptGrid?.closest(".section");
    const toolbar = content.querySelector(".toolbar-card");

    const holder = document.createElement("div");
    holder.innerHTML = html;
    const node = holder.firstElementChild;

    if (conceptSection) conceptSection.after(node);
    else if (toolbar) toolbar.after(node);
    else content.prepend(node);
  }

  const previousRender = window.render;
  if (typeof previousRender === "function") {
    window.render = function officialTheoryRender(...args) {
      const result = previousRender.apply(this,args);
      injectTheory();
      return result;
    };
  }

  injectTheory();
})();