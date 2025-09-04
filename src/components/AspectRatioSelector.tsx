import React from 'react';
import { AspectRatio } from '../types';

const ratios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onSelectRatio: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelectRatio }) => {
  return (
    <div className="flex space-x-2 bg-gray-900 rounded-lg p-1">
      {ratios.map((ratio) => (
        <button
          key={ratio}
          onClick={() => onSelectRatio(ratio)}
          className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${
            selectedRatio === ratio ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'
          }`}
          aria-label={`Aspect ratio ${ratio}`}
        >
          {ratio}
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;
