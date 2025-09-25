const PestModule = (() => {
  function estimateRisk({ temperatureC, humidityPct, rainMm }) {
    let score = 0;
    if (temperatureC >= 25 && temperatureC <= 34) score += 1;
    if (humidityPct >= 60) score += 1;
    if (rainMm >= 5) score += 1;

    let level = 'Low';
    let note = '';
    if (score === 2) { level = 'Moderate'; note = 'Scout for pests in evening.'; }
    if (score >= 3) { level = 'High'; note = 'Use traps/biocontrols proactively.'; }
    return { level, note, score };
  }
  return { estimateRisk };
})();


