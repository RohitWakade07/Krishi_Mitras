const WeatherService = (() => {
  async function getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation unavailable'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }

  async function fetchWeather({ latitude, longitude }) {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      hourly: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
      forecast_days: '1',
      timezone: 'auto'
    });
    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API failed');
    return res.json();
  }

  function summarize(data) {
    const h = data.hourly;
    const idx = 0; // current hour
    const temperature = h.temperature_2m?.[idx] ?? 28;
    const humidity = h.relative_humidity_2m?.[idx] ?? 55;
    const rain = h.precipitation?.slice(0, 6).reduce((a,b) => a + (b||0), 0);
    const wind = h.wind_speed_10m?.[idx] ?? 5;
    const soilMoistureIndex = Math.max(0, Math.min(1, (humidity/100) - (temperature-20)/50 + (rain>2?0.2:0)));
    return { temperature, humidity, rain, wind, soilMoistureIndex };
  }

  return { getLocation, fetchWeather, summarize };
})();


