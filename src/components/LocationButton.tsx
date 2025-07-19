import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationButtonProps {
  onLocationClick: () => void;
  loading: boolean;
}

export const LocationButton: React.FC<LocationButtonProps> = ({ onLocationClick, loading }) => {
  return (
    <button
      onClick={onLocationClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg
               hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
               transition-all duration-200 shadow-md hover:shadow-lg
               transform hover:scale-105 active:scale-95"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4" />
      )}
      <span className="font-medium">Use Current Location</span>
    </button>
  );
};