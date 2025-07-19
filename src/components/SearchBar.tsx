import React, { useState, KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter city name..."
          disabled={loading}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl 
                   bg-white/90 backdrop-blur-sm shadow-sm placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed
                   text-gray-900 font-medium"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-8 flex items-center pr-3
                     text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="absolute inset-y-0 right-0 flex items-center pr-3
                   text-blue-500 hover:text-blue-600 disabled:text-gray-400 
                   disabled:cursor-not-allowed transition-colors"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};