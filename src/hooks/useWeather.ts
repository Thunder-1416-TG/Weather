import { useState, useCallback } from 'react';
import { WeatherData, ForecastData } from '../types/weather';
import { WeatherService } from '../services/weatherService';

interface UseWeatherReturn {
  weather: WeatherData | null;
  forecast: ForecastData[];
  loading: boolean;
  error: string | null;
  fetchWeatherByCity: (city: string) => Promise<void>;
  fetchWeatherByLocation: () => Promise<void>;
  clearError: () => void;
}

export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weatherService = WeatherService.getInstance();

  const fetchWeatherByCity = useCallback(async (city: string) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(city),
        weatherService.getForecast(city),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, [weatherService]);

  const fetchWeatherByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeatherByCoords(latitude, longitude),
        weatherService.getForecastByCoords(latitude, longitude),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An error occurred while retrieving location.');
            break;
        }
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, [weatherService]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    weather,
    forecast,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    clearError,
  };
};