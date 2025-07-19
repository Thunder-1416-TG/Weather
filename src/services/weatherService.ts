import { WeatherData, ForecastData, WeatherResponse, ForecastResponse } from '../types/weather';

const API_KEY = '7901903cf5fd6c09f2268be39188bf57'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  private static instance: WeatherService;

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Failed to fetch weather data for "${city}": ${errorMessage}`);
      }

      const data: WeatherResponse = await response.json();
      return this.transformWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Failed to fetch weather data for your location: ${errorMessage}`);
      }

      const data: WeatherResponse = await response.json();
      return this.transformWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw error;
    }
  }

  async getForecast(city: string): Promise<ForecastData[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Failed to fetch forecast data for "${city}": ${errorMessage}`);
      }

      const data: ForecastResponse = await response.json();
      return this.transformForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  }

  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Failed to fetch forecast data for your location: ${errorMessage}`);
      }

      const data: ForecastResponse = await response.json();
      return this.transformForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast data by coordinates:', error);
      throw error;
    }
  }

  private transformWeatherData(data: WeatherResponse): WeatherData {
    return {
      name: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
  }

  private transformForecastData(data: ForecastResponse): ForecastData[] {
    // Group forecast data by date and take the first entry for each day
    const dailyForecasts: { [key: string]: ForecastData } = {};
    
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          temp: {
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max),
          },
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        };
      } else {
        // Update min/max temperatures
        dailyForecasts[date].temp.min = Math.min(
          dailyForecasts[date].temp.min,
          Math.round(item.main.temp_min)
        );
        dailyForecasts[date].temp.max = Math.max(
          dailyForecasts[date].temp.max,
          Math.round(item.main.temp_max)
        );
      }
    });

    // Return first 5 days
    return Object.values(dailyForecasts).slice(0, 5);
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}