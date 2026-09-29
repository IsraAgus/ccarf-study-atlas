(() => {
  const bank = window.CCARF_QUESTION_BANK || [];
  if (!bank.length) return;

  const profileNames = { you:{es:"Tú",en:"You"}, partner:{es:"Pareja",en:"Partner"} };
  let profile = localStorage.getItem("ccarf-profile") || "you";
  let mode = localStorage.getItem("ccarf-mode-"+profile) || "study";

  function key(name){ return "ccarf-"+name+"-"+profile; }
  function loadJSON(k,f){ try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch{return f} }
  function saveJSON(k,v){ localStorage.setItem(k,JSON.stringify(v)); }
  function lesson(){ return lessons.find(x=>x.id===state.current) || lessons[0]; }
  function questionForLesson(l){ return bank.find(q=>q.lessonId===l.id) || bank.find(q=>q.domain && l.group.includes(q.domain)); }
  function sameSet(a,b){ return a.length===b.length && [...a].sort().every((v,i)=>v===[...b].sort()[i]); }

  function controls(){
    if(document.getElementById("practiceControls")) return;
    const host=document.querySelector(".top-actions"); if(!host) return;
    const wrap=document.createElement("div"); wrap.id="practiceControls"; wrap.className="practice-controls";
    wrap.innerHTML='<div class="segmented"><button data-profile="you">Tú</button><button data-profile="partner">Pareja</button></div><div class="segmented"><button data-mode="study">Study</button><button data-mode="exam">Exam</button></div>';
    host.prepend(wrap);
    wrap.querySelectorAll("[data-profile]").forEach(b=>b.onclick=()=>{
      profile=b.dataset.profile; localStorage.setItem("ccarf-profile",profile); mode=localStorage.getItem("ccarf-mode-"+profile)||"study"; render();
    });
    wrap.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{
      mode=b.dataset.mode; localStorage.setItem("ccarf-mode-"+profile,mode); render();
    });
  }

  function refreshControls(){
    document.querySelectorAll("[data-profile]").forEach(b=>b.classList.toggle("active",b.dataset.profile===profile));
    document.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
  }

  function scenarioExamHTML(q){
    const multiple=q.type==="multiple";
    const hint=multiple?'<div class="select-hint"><span class="es-only">Selecciona '+q.selectCount+'.</span><span class="en-only">Select '+q.selectCount+'.</span></div>':'';
    return '<section class="section certification-question" data-qid="'+q.id+'">'+
      '<div class="question-meta"><span class="mode-chip">'+(mode==="study"?"Study Mode":"Exam Mode")+'</span><span>'+q.domain+'</span><span>'+q.id+'</span></div>'+
      '<div class="scenario-block"><div class="scenario-label">SCENARIO:</div><p class="en-only">'+q.scenarioEN+'</p><p class="es-only">'+q.scenarioES+'</p></div>'+
      '<div class="question-block"><div class="question-label">QUESTION:</div><p class="en-only">'+q.questionEN+'</p><p class="es-only">'+q.questionES+'</p>'+hint+'</div>'+
      '<div class="cert-options">'+q.options.map((o,i)=>'<label class="cert-option"><input type="'+(multiple?"checkbox":"radio")+'" name="'+q.id+'" value="'+i+'"><span class="choice-mark"></span><span><strong>'+String.fromCharCode(65+i)+'.</strong> <span class="en-only">'+o.en+'</span><span class="es-only">'+o.es+'</span></span></label>').join("")+'</div>'+
      '<div class="question-actions"><button class="submit-answer">Submit answer / Enviar respuesta</button></div><div class="question-feedback"></div></section>';
  }

  function feedback(q,selected,correct){
    const box=document.querySelector(".certification-question .question-feedback"); if(!box)return;
    if(mode==="exam"){
      if(correct){ box.innerHTML='<div class="feedback-card ok"><strong>Correct / Correcto</strong></div>'; return; }
      const firstWrong=selected.find(i=>!q.correct.includes(i));
      const reasonEN=firstWrong!==undefined?q.wrongReasonEN[firstWrong]:"One or more selected options do not match the required architectural decision.";
      const reasonES=firstWrong!==undefined?q.wrongReasonES[firstWrong]:"Una o más opciones seleccionadas no corresponden a la decisión arquitectónica requerida.";
      box.innerHTML='<div class="feedback-card bad"><strong>Incorrect / Incorrecto</strong><p class="en-only">'+reasonEN+'</p><p class="es-only">'+reasonES+'</p><p><strong>Correct:</strong> '+q.correct.map(i=>String.fromCharCode(65+i)).join(", ")+'</p></div>'; return;
    }
    let wrongs=selected.filter(i=>!q.correct.includes(i));
    let wrongHTML=wrongs.map(i=>'<div class="distractor-reason"><strong>'+String.fromCharCode(65+i)+'.</strong><span class="en-only">'+q.wrongReasonEN[i]+'</span><span class="es-only">'+q.wrongReasonES[i]+'</span></div>').join("");
    box.innerHTML='<div class="feedback-card '+(correct?"ok":"bad")+'"><strong>'+(correct?"Correct / Correcto":"Review the reasoning / Revisa el razonamiento")+'</strong>'+
      (!correct?wrongHTML:'')+
      '<p class="en-only"><strong>Correct answer:</strong> '+q.correct.map(i=>String.fromCharCode(65+i)+". "+q.options[i].en).join(" · ")+'</p>'+
      '<p class="es-only"><strong>Respuesta correcta:</strong> '+q.correct.map(i=>String.fromCharCode(65+i)+". "+q.options[i].es).join(" · ")+'</p>'+
      '<p class="en-only"><strong>Why:</strong> '+q.rationaleEN+'</p><p class="es-only"><strong>Por qué:</strong> '+q.rationaleES+'</p>'+
      '<p class="en-only"><strong>Decision rule:</strong> '+q.ruleEN+'</p><p class="es-only"><strong>Regla de decisión:</strong> '+q.ruleES+'</p>'+
      '<div class="feedback-links"><a href="#concept-review">Review concept ↑</a><a target="_blank" rel="noopener" href="'+q.doc.url+'">'+q.doc.label+' ↗</a></div></div>';
  }

  function bindQuestion(q){
    const root=document.querySelector(".certification-question"); if(!root)return;
    root.querySelector(".submit-answer").onclick=()=>{
      const selected=[...root.querySelectorAll("input:checked")].map(x=>Number(x.value));
      if(!selected.length){ alert(state.lang==="en"?"Select an answer first.":"Selecciona una respuesta primero."); return; }
      if(q.type==="multiple" && selected.length!==q.selectCount){ alert(state.lang==="en"?"Select exactly "+q.selectCount+" answers.":"Selecciona exactamente "+q.selectCount+" respuestas."); return; }
      const correct=sameSet(selected,q.correct);
      root.querySelectorAll("input").forEach(x=>x.disabled=true);
      root.querySelectorAll(".cert-option").forEach((el,i)=>{
        if(q.correct.includes(i))el.classList.add("correct");
        if(selected.includes(i)&&!q.correct.includes(i))el.classList.add("wrong");
      });
      const stats=loadJSON(key("question-stats"),{answered:0,correct:0,byQuestion:{}});
      stats.answered++; if(correct)stats.correct++;
      stats.byQuestion[q.id]={selected,correct,mode,at:new Date().toISOString(),lessonId:q.lessonId};
      saveJSON(key("question-stats"),stats);
      feedback(q,selected,correct);
      applyLang();
    };
  }

  const originalRender=render;
  render=function(){
    originalRender(); controls(); refreshControls();
    const hero=document.querySelector(".hero"); if(hero)hero.id="concept-review";
    const old=document.querySelector(".exam-box")?.closest(".section"); if(old) old.remove();
    const l=lesson(),q=questionForLesson(l);
    if(q){
      const sources=[...document.querySelectorAll(".section")].find(s=>s.querySelector("h3")?.textContent.includes("Sources"));
      const holder=document.createElement("div"); holder.innerHTML=scenarioExamHTML(q);
      const node=holder.firstElementChild;
      if(sources)sources.before(node); else document.getElementById("content").appendChild(node);
      bindQuestion(q);
    }
    const note=document.querySelector(".toolbar-card");
    if(note&&!note.querySelector(".learner-note")){
      const n=document.createElement("span");n.className="learner-note";n.innerHTML='<span class="es-only">Perfil: <strong>'+profileNames[profile].es+'</strong> · Modo: <strong>'+(mode==="study"?"Estudio":"Examen")+'</strong></span><span class="en-only">Profile: <strong>'+profileNames[profile].en+'</strong> · Mode: <strong>'+(mode==="study"?"Study":"Exam")+'</strong></span>';note.appendChild(n);
    }
    applyLang();
  };

  const oldApply=applyLang;
  applyLang=function(){ oldApply(); refreshControls(); };

  render();
})();