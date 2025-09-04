import React from 'react';
import { ImageStyle } from '../types';

interface ImageStyleSelectorProps {
  styles: ImageStyle[];
  selectedStyleId: string;
  onSelectStyle: (id: string) => void;
}

const ImageStyleSelector: React.FC<ImageStyleSelectorProps> = ({ styles, selectedStyleId, onSelectStyle }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {styles.map((style) => (
        <div 
          key={style.id} 
          className="relative rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => onSelectStyle(style.id)}
        >
          <img 
            src={style.previewUrl} 
            alt={style.name} 
            className="w-full h-20 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <p className="text-white text-sm font-semibold text-center px-1">{style.name}</p>
          </div>
          {selectedStyleId === style.id && (
            <div className="absolute inset-0 border-4 border-indigo-500 rounded-lg pointer-events-none"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageStyleSelector;
