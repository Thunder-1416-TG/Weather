import React from 'react';
import { ForecastData } from '../types/weather';
import { WeatherService } from '../services/weatherService';

interface ForecastCardProps {
  forecast: ForecastData[];
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const weatherService = WeatherService.getInstance();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl
                     hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <img
                src={weatherService.getWeatherIconUrl(day.icon)}
                alt={day.description}
                className="w-12 h-12"
              />
              <div>
                <div className="font-semibold text-gray-800">
                  {formatDate(day.date)}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {day.description}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>💧</span>
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>💨</span>
                  <span>{day.windSpeed} m/s</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">
                  {day.temp.max}°
                </div>
                <div className="text-sm text-gray-600">
                  {day.temp.min}°
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};