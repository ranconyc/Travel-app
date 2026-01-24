/**
 * Weather Service for fetching data from Open-Meteo API.
 * Free, no API key required.
 */

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  time: string;
}

/**
 * Fetches current weather for given coordinates.
 * @param lat Latitude
 * @param lng Longitude
 */
export async function fetchWeather(
  lat: number,
  lng: number,
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  return {
    temperature: data.current_weather.temperature,
    weatherCode: data.current_weather.weathercode,
    time: data.current_weather.time,
  };
}

/**
 * WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */
export const weatherCodeMap: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "Sun" },
  1: { label: "Mainly clear", icon: "SunMedium" },
  2: { label: "Partly cloudy", icon: "CloudSun" },
  3: { label: "Overcast", icon: "Cloud" },
  45: { label: "Fog", icon: "CloudFog" },
  48: { label: "Depositing rime fog", icon: "CloudFog" },
  51: { label: "Light drizzle", icon: "CloudDrizzle" },
  53: { label: "Moderate drizzle", icon: "CloudDrizzle" },
  55: { label: "Dense drizzle", icon: "CloudDrizzle" },
  61: { label: "Slight rain", icon: "CloudRain" },
  63: { label: "Moderate rain", icon: "CloudRain" },
  65: { label: "Heavy rain", icon: "CloudRain" },
  71: { label: "Slight snow fall", icon: "CloudSnow" },
  73: { label: "Moderate snow fall", icon: "CloudSnow" },
  75: { label: "Heavy snow fall", icon: "CloudSnow" },
  80: { label: "Slight rain showers", icon: "CloudRain" },
  81: { label: "Moderate rain showers", icon: "CloudRain" },
  82: { label: "Violent rain showers", icon: "CloudRain" },
  95: { label: "Thunderstorm", icon: "CloudLightning" },
};
