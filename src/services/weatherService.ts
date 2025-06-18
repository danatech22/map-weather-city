interface WeatherAPIResponse {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface Forecast {
  current: {
    temp: number;
    description: string;
    icon: string;
  };
  today: {
    max: number;
    min: number;
    description: string;
    icon: string;
  };
  tomorrow: {
    max: number;
    min: number;
    description: string;
    icon: string;
  };
}

export const fetchWeather = async (
  lat: number,
  lon: number
): Promise<Forecast> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&forecast_days=2`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data.");
  }
  const data: WeatherAPIResponse = await response.json();

  return {
    current: {
      temp: Math.round(data.current_weather.temperature),
      ...getWeatherInterpretation(data.current_weather.weathercode),
    },
    today: {
      max: Math.round(data.daily.temperature_2m_max[0]),
      min: Math.round(data.daily.temperature_2m_min[0]),
      ...getWeatherInterpretation(data.daily.weathercode[0]),
    },
    tomorrow: {
      max: Math.round(data.daily.temperature_2m_max[1]),
      min: Math.round(data.daily.temperature_2m_min[1]),
      ...getWeatherInterpretation(data.daily.weathercode[1]),
    },
  };
};

export const getWeatherInterpretation = (
  code: number
): { description: string; icon: string } => {
  const interpretations: Record<number, { description: string; icon: string }> =
    {
      0: { description: "Clear sky", icon: "☀️" },
      1: { description: "Mainly clear", icon: "🌤️" },
      2: { description: "Partly cloudy", icon: "⛅" },
      3: { description: "Overcast", icon: "☁️" },
      45: { description: "Fog", icon: "🌫️" },
      48: { description: "Depositing rime fog", icon: "🌫️" },
      51: { description: "Light drizzle", icon: "💧" },
      53: { description: "Moderate drizzle", icon: "💧" },
      55: { description: "Dense drizzle", icon: "💧" },
      61: { description: "Slight rain", icon: "🌧️" },
      63: { description: "Moderate rain", icon: "🌧️" },
      65: { description: "Heavy rain", icon: " torrential rain" },
      80: { description: "Slight rain showers", icon: "🌦️" },
      81: { description: "Moderate rain showers", icon: "🌦️" },
      82: { description: "Violent rain showers", icon: "⛈️" },
      95: { description: "Thunderstorm", icon: "⛈️" },
    };
  return interpretations[code] || { description: "Unknown", icon: "🤷" };
};
