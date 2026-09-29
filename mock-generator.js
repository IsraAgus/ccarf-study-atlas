(() => {
  const bank = () => window.CCARF_QUESTION_BANK || [];
  const scenarioIds = () => Object.keys(window.CCARF_SCENARIOS || {});
  const domainTargets = {D1:16,D2:11,D3:12,D4:12,D5:9};

  function hashSeed(value) {
    const text = String(value);
    let h = 2166136261;
    for (let i=0;i<text.length;i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h,16777619);
    }
    return h >>> 0;
  }

  function rngFromSeed(seed) {
    let x = hashSeed(seed) || 1;
    return () => {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return (x >>> 0) / 4294967296;
    };
  }

  function shuffle(array, rng) {
    const out = [...array];
    for (let i=out.length-1;i>0;i--) {
      const j = Math.floor(rng()*(i+1));
      [out[i],out[j]]=[out[j],out[i]];
    }
    return out;
  }

  function remapOptions(question, rng) {
    const order = shuffle(question.options.map((_,i)=>i),rng);
    const reverse = new Map(order.map((oldIndex,newIndex)=>[oldIndex,newIndex]));
    return {
      ...question,
      options:order.map(i=>question.options[i]),
      correct:question.correct.map(i=>reverse.get(i)).sort((a,b)=>a-b),
      wrongReasonEN:order.map(i=>question.wrongReasonEN[i]),
      wrongReasonES:order.map(i=>question.wrongReasonES[i]),
      optionOrder:order
    };
  }

  function historyKey(profile) {
    return "ccarf-exam-history-" + profile;
  }

  function readHistory(profile) {
    try { return JSON.parse(localStorage.getItem(historyKey(profile)) || "[]"); }
    catch { return []; }
  }

  function writeHistory(profile, ids) {
    const previous = readHistory(profile);
    const merged = [...new Set(previous.concat(ids))];
    localStorage.setItem(historyKey(profile),JSON.stringify(merged.slice(-420)));
  }

  function pickScenarios(rng, count=4) {
    return shuffle(scenarioIds(),rng).slice(0,Math.min(count,scenarioIds().length));
  }

  function generate({profile="you",count=60,seed=null,scenarioCount=4,remember=true}={}) {
    const resolvedSeed = seed ?? (Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8));
    const rng = rngFromSeed(resolvedSeed);
    const selectedScenarios = pickScenarios(rng,scenarioCount);
    const seen = new Set(readHistory(profile));
    const pool = bank().filter(q=>selectedScenarios.includes(q.scenarioId));
    const selected = [];
    const usedIds = new Set();
    const familyCounts = new Map();

    function take(candidates,limit,maxPerFamily=3) {
      const ranked = shuffle(candidates,rng).sort((a,b)=>
        Number(seen.has(a.id)) - Number(seen.has(b.id))
      );
      for (const q of ranked) {
        if (selected.length >= count || limit <= 0) break;
        if (usedIds.has(q.id)) continue;
        const family = q.family || q.id;
        if ((familyCounts.get(family)||0) >= maxPerFamily) continue;
        selected.push(q);
        usedIds.add(q.id);
        familyCounts.set(family,(familyCounts.get(family)||0)+1);
        limit--;
      }
      return limit;
    }

    for (const [domain,target] of Object.entries(domainTargets)) {
      if (selected.length >= count) break;
      const desired = Math.round(target * count / 60);
      let remaining = desired;
      remaining = take(pool.filter(q=>q.domain===domain),remaining,2);
      if (remaining > 0) take(pool.filter(q=>q.domain===domain),remaining,3);
    }

    if (selected.length < count) {
      take(pool,count-selected.length,3);
    }
    if (selected.length < count) {
      take(bank(),count-selected.length,4);
    }

    const multipleTarget = Math.max(6, Math.round(count * 0.15));
    let multipleCount = selected.filter(q => q.type === "multiple").length;
    if (multipleCount < multipleTarget) {
      const multiCandidates = shuffle(
        pool.filter(q => q.type === "multiple" && !usedIds.has(q.id)),
        rng
      ).sort((a,b) => Number(seen.has(a.id)) - Number(seen.has(b.id)));

      for (const candidate of multiCandidates) {
        if (multipleCount >= multipleTarget) break;
        const family = candidate.family || candidate.id;
        if ((familyCounts.get(family) || 0) >= 3) continue;

        let replaceIndex = selected.findIndex(q =>
          q.type !== "multiple" && q.domain === candidate.domain
        );
        if (replaceIndex < 0) {
          replaceIndex = selected.findIndex(q => q.type !== "multiple");
        }
        if (replaceIndex < 0) break;

        const removed = selected[replaceIndex];
        const removedFamily = removed.family || removed.id;
        familyCounts.set(removedFamily, Math.max(0, (familyCounts.get(removedFamily) || 1) - 1));
        usedIds.delete(removed.id);

        selected[replaceIndex] = candidate;
        usedIds.add(candidate.id);
        familyCounts.set(family, (familyCounts.get(family) || 0) + 1);
        multipleCount++;
      }
    }

    const finalQuestions = shuffle(selected.slice(0,count),rng).map(q=>remapOptions(q,rng));
    if (remember) writeHistory(profile,finalQuestions.map(q=>q.id));

    return {
      versionId:"CCARF-"+hashSeed(resolvedSeed).toString(16).toUpperCase(),
      seed:resolvedSeed,
      profile,
      scenarioIds:selectedScenarios,
      questions:finalQuestions,
      distribution:finalQuestions.reduce((acc,q)=>{
        acc.domains[q.domain]=(acc.domains[q.domain]||0)+1;
        acc.scenarios[q.scenarioId]=(acc.scenarios[q.scenarioId]||0)+1;
        acc.types[q.type]=(acc.types[q.type]||0)+1;
        return acc;
      },{domains:{},scenarios:{},types:{}})
    };
  }

  window.CCARF_EXAM_GENERATOR = {generate,hashSeed,rngFromSeed};
})();