(() => {
  const generator = window.CCARF_EXAM_GENERATOR;
  if (!generator) return;

  let session = null;
  let timerId = null;

  function profile() {
    return localStorage.getItem("ccarf-profile") || "you";
  }

  function langText(es,en) {
    return '<span class="es-only">'+es+'</span><span class="en-only">'+en+'</span>';
  }

  function sameSet(a,b) {
    const aa=[...(a||[])].sort((x,y)=>x-y);
    const bb=[...(b||[])].sort((x,y)=>x-y);
    return aa.length===bb.length && aa.every((v,i)=>v===bb[i]);
  }

  function injectLauncher() {
    if (document.getElementById("mock60Btn")) return;
    const controls=document.getElementById("practiceControls") || document.querySelector(".top-actions");
    if (!controls) return;
    const btn=document.createElement("button");
    btn.id="mock60Btn";
    btn.className="mock-launch-btn";
    btn.textContent="Mock 60";
    btn.onclick=startNewExam;
    controls.appendChild(btn);
  }

  function startNewExam() {
    const exam=generator.generate({profile:profile(),count:60,scenarioCount:4});
    session={
      exam,
      index:0,
      answers:{},
      flagged:new Set(),
      startedAt:Date.now(),
      endsAt:Date.now()+120*60*1000,
      finished:false
    };
    openOverlay();
    startTimer();
  }

  function openOverlay() {
    document.getElementById("mockExamOverlay")?.remove();
    const overlay=document.createElement("div");
    overlay.id="mockExamOverlay";
    overlay.className="mock-overlay";
    overlay.innerHTML='<div class="mock-shell"><header class="mock-header"></header><main class="mock-main"></main><footer class="mock-footer"></footer></div>';
    document.body.appendChild(overlay);
    render();
  }

  function startTimer() {
    clearInterval(timerId);
    timerId=setInterval(()=>{
      if (!session || session.finished) return clearInterval(timerId);
      if (Date.now() >= session.endsAt) {
        finishExam(true);
        return;
      }
      updateTimer();
    },1000);
    updateTimer();
  }

  function updateTimer() {
    const el=document.getElementById("mockTimer");
    if (!el || !session) return;
    const remaining=Math.max(0,session.endsAt-Date.now());
    const total=Math.ceil(remaining/1000);
    const h=Math.floor(total/3600);
    const m=Math.floor((total%3600)/60);
    const s=total%60;
    el.textContent=(h?String(h).padStart(2,"0")+":":"")+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  }

  function currentQuestion() {
    return session.exam.questions[session.index];
  }

  function saveCurrentSelection() {
    const q=currentQuestion();
    const selected=[...document.querySelectorAll('#mockExamOverlay input[name="mock-answer"]:checked')].map(x=>Number(x.value));
    if (selected.length) session.answers[q.id]=selected;
    else delete session.answers[q.id];
  }

  function answerInputs(q) {
    const saved=session.answers[q.id] || [];
    const type=q.type==="multiple"?"checkbox":"radio";
    return q.options.map((o,i)=>
      '<label class="mock-option">'+
      '<input type="'+type+'" name="mock-answer" value="'+i+'" '+(saved.includes(i)?"checked":"")+'>'+
      '<span class="mock-choice"></span>'+
      '<span><strong>'+String.fromCharCode(65+i)+'.</strong> <span class="en-only">'+o.en+'</span><span class="es-only">'+o.es+'</span></span>'+
      '</label>'
    ).join("");
  }

  function renderQuestion() {
    const q=currentQuestion();
    const main=document.querySelector("#mockExamOverlay .mock-main");
    const isFlagged=session.flagged.has(q.id);
    const multi=q.type==="multiple"
      ? '<div class="mock-select-note">'+langText("Selecciona exactamente "+q.selectCount+".","Select exactly "+q.selectCount+".")+'</div>'
      : "";

    main.innerHTML=
      '<div class="mock-question-number">Question '+(session.index+1)+'</div>'+
      '<div class="mock-scenario"><strong>SCENARIO:</strong><p class="en-only">'+q.scenarioEN+'</p><p class="es-only">'+q.scenarioES+'</p></div>'+
      '<div class="mock-question"><strong>QUESTION:</strong><p class="en-only">'+q.questionEN+'</p><p class="es-only">'+q.questionES+'</p>'+multi+'</div>'+
      '<div class="mock-options">'+answerInputs(q)+'</div>'+
      '<button id="mockFlagBtn" class="mock-flag '+(isFlagged?"active":"")+'">'+(isFlagged?"★ ":"☆ ")+langText("Marcada para revisar","Flagged for review")+'</button>';

    main.querySelectorAll('input[name="mock-answer"]').forEach(input=>{
      input.onchange=()=>{
        const selected=[...main.querySelectorAll('input[name="mock-answer"]:checked')];
        if (q.type==="multiple" && selected.length>q.selectCount) {
          input.checked=false;
        }
        saveCurrentSelection();
        renderFooter();
      };
    });

    document.getElementById("mockFlagBtn").onclick=()=>{
      if (session.flagged.has(q.id)) session.flagged.delete(q.id);
      else session.flagged.add(q.id);
      renderQuestion();
      renderFooter();
      applyLang();
    };
  }

  function renderHeader() {
    const header=document.querySelector("#mockExamOverlay .mock-header");
    const answered=Object.keys(session.answers).length;
    header.innerHTML=
      '<div><strong>CCAR-F Mock Exam</strong><div class="mock-version">'+session.exam.versionId+' · '+session.exam.scenarioIds.length+' scenarios</div></div>'+
      '<div class="mock-progress"><strong>'+(session.index+1)+'/60</strong><span>'+answered+' answered · '+session.flagged.size+' flagged</span></div>'+
      '<div id="mockTimer" class="mock-timer"></div>'+
      '<button id="mockExitBtn" class="mock-exit">'+langText("Salir","Exit")+'</button>';
    document.getElementById("mockExitBtn").onclick=()=>{
      if (confirm(state.lang==="en"?"Exit this mock exam? Your in-progress answers will be discarded.":"¿Salir de este simulacro? Las respuestas en progreso se descartarán.")) {
        clearInterval(timerId);
        document.getElementById("mockExamOverlay")?.remove();
        session=null;
      }
    };
    updateTimer();
  }

  function renderFooter() {
    const footer=document.querySelector("#mockExamOverlay .mock-footer");
    const q=currentQuestion();
    const answered=Boolean(session.answers[q.id]);
    footer.innerHTML=
      '<button id="mockPrev" '+(session.index===0?"disabled":"")+'>'+langText("← Anterior","← Previous")+'</button>'+
      '<div class="mock-mini-progress">'+Object.keys(session.answers).length+'/60 '+langText("respondidas","answered")+'</div>'+
      (session.index<59
        ? '<button id="mockNext">'+langText("Siguiente →","Next →")+'</button>'
        : '<button id="mockFinish" class="primary">'+langText("Finalizar examen","Finish exam")+'</button>');

    const prev=document.getElementById("mockPrev");
    if (prev) prev.onclick=()=>{ saveCurrentSelection(); session.index--; render(); };

    const next=document.getElementById("mockNext");
    if (next) next.onclick=()=>{ saveCurrentSelection(); session.index++; render(); };

    const finish=document.getElementById("mockFinish");
    if (finish) finish.onclick=()=>{
      saveCurrentSelection();
      const unanswered=60-Object.keys(session.answers).length;
      const message=unanswered
        ? (state.lang==="en"?"Finish with "+unanswered+" unanswered questions?":"¿Finalizar con "+unanswered+" preguntas sin responder?")
        : (state.lang==="en"?"Finish and review results?":"¿Finalizar y revisar resultados?");
      if (confirm(message)) finishExam(false);
    };
  }

  function render() {
    if (!session || session.finished) return;
    renderHeader();
    renderQuestion();
    renderFooter();
    applyLang();
  }

  function finishExam(autoFinished) {
    if (!session || session.finished) return;
    saveCurrentSelection();
    session.finished=true;
    clearInterval(timerId);

    let correct=0;
    const wrong=[];
    for (const q of session.exam.questions) {
      const selected=session.answers[q.id] || [];
      if (sameSet(selected,q.correct)) correct++;
      else wrong.push({q,selected});
    }

    const attemptsKey="ccarf-mock-attempts-"+profile();
    let attempts=[];
    try { attempts=JSON.parse(localStorage.getItem(attemptsKey)||"[]"); } catch {}
    attempts.push({
      versionId:session.exam.versionId,
      seed:session.exam.seed,
      score:correct,
      total:60,
      completedAt:new Date().toISOString(),
      autoFinished
    });
    localStorage.setItem(attemptsKey,JSON.stringify(attempts.slice(-30)));

    const header=document.querySelector("#mockExamOverlay .mock-header");
    const main=document.querySelector("#mockExamOverlay .mock-main");
    const footer=document.querySelector("#mockExamOverlay .mock-footer");

    header.innerHTML=
      '<div><strong>CCAR-F Mock Review</strong><div class="mock-version">'+session.exam.versionId+'</div></div>'+
      '<div class="mock-score">'+correct+'/60 · '+Math.round(correct/60*100)+'%</div>';

    main.innerHTML=
      '<section class="mock-results-summary"><h2>'+langText("Revisión del simulacro","Mock review")+'</h2>'+
      '<p>'+langText("El modo examen muestra únicamente los errores, por qué la selección fue incorrecta y cuál era la respuesta correcta.","Exam review shows only missed questions, why the selected answer was wrong, and the correct answer.")+'</p></section>'+
      (wrong.length ? wrong.map((item,index)=>wrongCard(item,index)).join("") :
        '<div class="mock-perfect">'+langText("No hubo respuestas incorrectas.","No incorrect answers.")+'</div>');

    footer.innerHTML=
      '<button id="mockCloseReview">'+langText("Volver al Atlas","Back to Atlas")+'</button>'+
      '<button id="mockNewVersion" class="primary">'+langText("Nueva versión aleatoria","New random version")+'</button>';

    document.getElementById("mockCloseReview").onclick=()=>{
      document.getElementById("mockExamOverlay")?.remove();
      session=null;
    };
    document.getElementById("mockNewVersion").onclick=startNewExam;
    applyLang();
  }

  function wrongCard({q,selected},index) {
    const chosenWrong=selected.filter(i=>!q.correct.includes(i));
    const reasonsEN=chosenWrong.map(i=>q.wrongReasonEN[i]).filter(Boolean);
    const reasonsES=chosenWrong.map(i=>q.wrongReasonES[i]).filter(Boolean);
    const missing=q.correct.filter(i=>!selected.includes(i));

    return '<article class="mock-review-card">'+
      '<div class="mock-review-kicker">Missed question '+(index+1)+' · '+q.domain+'</div>'+
      '<p class="en-only"><strong>QUESTION:</strong> '+q.questionEN+'</p>'+
      '<p class="es-only"><strong>QUESTION:</strong> '+q.questionES+'</p>'+
      '<p class="en-only"><strong>Why your answer was wrong:</strong> '+(reasonsEN.join(" ") || (missing.length?"You did not select every required correct option.":"The selected answer set did not match the required decision."))+'</p>'+
      '<p class="es-only"><strong>Por qué estuvo mal:</strong> '+(reasonsES.join(" ") || (missing.length?"No seleccionaste todas las opciones correctas requeridas.":"El conjunto seleccionado no coincidió con la decisión requerida."))+'</p>'+
      '<p class="en-only"><strong>Correct answer:</strong> '+q.correct.map(i=>String.fromCharCode(65+i)+". "+q.options[i].en).join(" · ")+'</p>'+
      '<p class="es-only"><strong>Respuesta correcta:</strong> '+q.correct.map(i=>String.fromCharCode(65+i)+". "+q.options[i].es).join(" · ")+'</p>'+
      '</article>';
  }

  const originalRender=window.render;
  if (typeof originalRender==="function") {
    window.render=function(...args) {
      const result=originalRender.apply(this,args);
      injectLauncher();
      return result;
    };
  }
  injectLauncher();
})();