const AdvisoryEngine = (() => {
  function generateTips({ soilMoistureNd, rainfallMm, temperatureC, humidityPct }) {
    const tips = [];
    if (soilMoistureNd < 0.35 && rainfallMm < 1) {
      tips.push('Irrigate Zone B for 2 hours tomorrow morning.');
    } else if (soilMoistureNd < 0.5 && rainfallMm < 2) {
      tips.push('Light irrigation recommended (1 hour) in Zone A.');
    } else {
      tips.push('No irrigation needed in the next 24 hours.');
    }

    if (temperatureC > 30 && humidityPct > 60) {
      tips.push('Monitor for fungal diseases; ensure proper field ventilation.');
    }
    if (soilMoistureNd < 0.4) {
      tips.push('Apply nitrogen-based fertilizer to Zone A to address early deficiency.');
    }
    return tips;
  }
  return { generateTips };
})();


