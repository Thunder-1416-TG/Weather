import React, { useEffect } from 'react';
import { Cloud, Github, ExternalLink } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { LocationButton } from './components/LocationButton';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useWeather } from './hooks/useWeather';

function App() {
  const {
    weather,
    forecast,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    clearError,
  } = useWeather();

  // Load default weather data for New York on app start
  useEffect(() => {
    fetchWeatherByCity('New York');
  }, [fetchWeatherByCity]);

  const handleSearch = (city: string) => {
    fetchWeatherByCity(city);
  };

  const handleLocationClick = () => {
    fetchWeatherByLocation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-12 w-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              WeatherNow
            </h1>
          </div>
          <p className="text-xl text-white/90 font-medium">
            Real-time weather updates for anywhere in the world
          </p>
        </header>

        {/* Search Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
          <LocationButton onLocationClick={handleLocationClick} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <ErrorMessage message={error} onClose={clearError} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-2xl mx-auto">
            <LoadingSpinner />
          </div>
        )}

        {/* Weather Content */}
        {!loading && weather && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Weather */}
              <div>
                <WeatherCard weather={weather} />
              </div>

              {/* 5-Day Forecast */}
              <div>
                <ForecastCard forecast={forecast} />
              </div>
            </div>
          </div>
        )}

        {/* API Key Notice */}
        <div className="max-w-4xl mx-auto mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">API Configuration Required</h3>
              <p className="text-white/90 mb-4">
                To use this weather app, you'll need to get a free API key from OpenWeatherMap:
              </p>
              <ol className="text-white/90 mb-4 space-y-2">
                <li>1. Visit <a href="https://openweathermap.org/api" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">OpenWeatherMap API</a></li>
                <li>2. Sign up for a free account</li>
                <li>3. Get your API key</li>
                <li>4. Replace 'YOUR_API_KEY_HERE' in src/services/weatherService.ts</li>
              </ol>
              <p className="text-white/80 text-sm">
                The free tier includes 1,000 API calls per day, which is perfect for personal use.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-white/80">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Github className="h-5 w-5" />
            <span>Built with React, TypeScript, and Tailwind CSS</span>
          </div>
          <p className="text-sm">
            Powered by OpenWeatherMap API
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;