export type WeatherData = {
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
};
export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const params =
    new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current:
        "temperature_2m,weather_code",
      daily:
        "precipitation_probability_max",
      timezone: "auto",
      forecast_days: "1",
    });

  const response =
    await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`
    );

  if (!response.ok) {
    throw new Error(
      "天気データ取得失敗"
    );
  }

  const data =
    await response.json();

  return {
    temperature:
      data.current.temperature_2m,

    weatherCode:
      data.current.weather_code,

    precipitationProbability:
      data.daily
        .precipitation_probability_max[0],
  };
}