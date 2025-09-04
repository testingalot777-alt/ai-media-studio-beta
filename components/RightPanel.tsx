
import React from 'react';
import { GeneratedMediaType } from '../types';

interface RightPanelProps {
  isLoading: boolean;
  loadingStatus: string;
  generatedMedia: GeneratedMediaType | null;
  error: string | null;
}

const RightPanel: React.FC<RightPanelProps> = ({ isLoading, loadingStatus, generatedMedia, error }) => {
  
  const downloadMedia = () => {
    if (!generatedMedia) return;
    const link = document.createElement('a');
    link.href = generatedMedia.src;
    const fileExtension = generatedMedia.type === 'video' ? 'mp4' : 'jpg';
    link.download = `ai-media-studio-${Date.now()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div id="loadingContainer" className="loading-container text-center">
          <div className="loading-spinner animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="loading-text mt-4 text-lg text-gray-300">{loadingStatus}</p>
        </div>
      );
    }
    
    if (error) {
      return (
         <div className="result-placeholder text-center text-red-400">
            <div className="result-placeholder-icon text-5xl mb-4">😢</div>
            <p className="font-semibold">Ocorreu um erro</p>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
        </div>
      );
    }

    if (generatedMedia) {
      return (
        <div id="mediaContainer" className="media-container w-full h-full flex flex-col items-center justify-center">
          {generatedMedia.type === 'image' ? (
            <img id="generatedMedia" src={generatedMedia.src} alt="Generated Media" className="generated-media max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
          ) : (
            <video id="generatedMedia" src={generatedMedia.src} controls autoPlay loop className="generated-media max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
          )}
          <div className="media-actions mt-4">
            <button className="action-btn bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition" onClick={downloadMedia} title="Download">
              💾 Salvar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div id="resultPlaceholder" className="result-placeholder text-center text-gray-500">
        <div className="result-placeholder-icon text-6xl mb-4">🎨</div>
        <p className="text-lg font-medium">Sua obra de arte aparecerá aqui</p>
      </div>
    );
  };

  return (
    <div className="right-panel bg-gray-900 w-full h-full flex items-center justify-center p-6 rounded-r-2xl">
      {renderContent()}
    </div>
  );
};

export default RightPanel;
