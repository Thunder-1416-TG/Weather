import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  Sunrise,
  Sunset
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { WeatherService } from '../services/weatherService';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const weatherService = WeatherService.getInstance();

  const formatTime = (timestamp: number | undefined) => {
    if (!timestamp) return '--:--';
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWeatherBackground = (icon: string) => {
    if (icon.includes('01')) return 'from-yellow-400 to-orange-500'; // Clear sky
    if (icon.includes('02')) return 'from-blue-400 to-blue-600'; // Few clouds
    if (icon.includes('03') || icon.includes('04')) return 'from-gray-400 to-gray-600'; // Clouds
    if (icon.includes('09') || icon.includes('10')) return 'from-gray-500 to-gray-700'; // Rain
    if (icon.includes('11')) return 'from-purple-500 to-purple-700'; // Thunderstorm
    if (icon.includes('13')) return 'from-blue-200 to-blue-400'; // Snow
    if (icon.includes('50')) return 'from-gray-300 to-gray-500'; // Mist
    return 'from-blue-400 to-blue-600'; // Default
  };

  return (
    <div className={`bg-gradient-to-br ${getWeatherBackground(weather.icon)} 
                    rounded-2xl p-6 text-white shadow-2xl transform hover:scale-105 
                    transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{weather.name}</h2>
          <p className="text-lg opacity-90">{weather.country}</p>
        </div>
        <img
          src={weatherService.getWeatherIconUrl(weather.icon)}
          alt={weather.description}
          className="w-20 h-20 drop-shadow-lg"
        />
      </div>

      <div className="text-center mb-6">
        <div className="text-6xl font-bold mb-2">{weather.temp}°C</div>
        <div className="text-xl capitalize mb-2">{weather.description}</div>
        <div className="text-lg opacity-80">Feels like {weather.feelsLike}°C</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
          <Droplets className="h-5 w-5" />
          <div>
            <div className="text-sm opacity-75">Humidity</div>
            <div className="font-semibold">{weather.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
          <Wind className="h-5 w-5" />
          <div>
            <div className="text-sm opacity-75">Wind Speed</div>
            <div className="font-semibold">{weather.windSpeed} m/s</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
          <Gauge className="h-5 w-5" />
          <div>
            <div className="text-sm opacity-75">Pressure</div>
            <div className="font-semibold">{weather.pressure} hPa</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
          <Eye className="h-5 w-5" />
          <div>
            <div className="text-sm opacity-75">Visibility</div>
            <div className="font-semibold">{weather.visibility} km</div>
          </div>
        </div>
      </div>

      {weather.sunrise && weather.sunset && (
        <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Sunrise className="h-5 w-5" />
            <div>
              <div className="text-sm opacity-75">Sunrise</div>
              <div className="font-semibold">{formatTime(weather.sunrise)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sunset className="h-5 w-5" />
            <div>
              <div className="text-sm opacity-75">Sunset</div>
              <div className="font-semibold">{formatTime(weather.sunset)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};