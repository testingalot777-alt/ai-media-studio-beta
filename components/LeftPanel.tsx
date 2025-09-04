import React from 'react';
import { Mode, ImageFunction, VideoFunction, EditFunction, FunctionCardData, AspectRatio } from '../types';
import FunctionCard from './FunctionCard';
import {
  CreateIcon, StickerIcon, LogoIcon, ComicIcon,
  VideoIcon, ImageToVideoIcon, TextToVideoIcon, MotionIcon,
  AddRemoveIcon, RetouchIcon, StyleIcon, ComposeIcon, UploadIcon
} from './icons';
import { imageStyles } from './styles';
import ImageStyleSelector from './ImageStyleSelector';
import AspectRatioSelector from './AspectRatioSelector';

interface LeftPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  activeFunction: string;
  setActiveFunction: (func: string) => void;
  generateMedia: () => void;
  isLoading: boolean;
  handleMediaUpload: (e: React.ChangeEvent<HTMLInputElement>, id: 'mediaPreview1' | 'mediaPreview2') => void;
  mediaPreview1: string | null;
  mediaPreview2: string | null;
  selectedStyle: string;
  setSelectedStyle: (styleId: string) => void;
  selectedAspectRatio: AspectRatio;
  setSelectedAspectRatio: (ratio: AspectRatio) => void;
}

const imageFunctions: FunctionCardData[] = [
  { id: 'image-create', name: 'Imagem', icon: <CreateIcon /> },
  { id: 'sticker', name: 'Adesivos', icon: <StickerIcon /> },
  { id: 'text', name: 'Logo', icon: <LogoIcon /> },
  { id: 'comic', name: 'HQ', icon: <ComicIcon /> },
];

const videoFunctions: FunctionCardData[] = [
  { id: 'video-create', name: 'Vídeo', icon: <VideoIcon /> },
  { id: 'image-to-video', name: 'Imagem para Vídeo', icon: <ImageToVideoIcon />, requiresUpload: true },
  { id: 'text-to-video', name: 'Texto para Vídeo', icon: <TextToVideoIcon /> },
  { id: 'motion', name: 'Movimento', icon: <MotionIcon />, requiresUpload: true },
];

const editFunctions: FunctionCardData[] = [
  { id: 'add-remove', name: 'Adicionar', icon: <AddRemoveIcon />, requiresUpload: true },
  { id: 'retouch', name: 'Retoque', icon: <RetouchIcon />, requiresUpload: true },
  { id: 'style', name: 'Estilo', icon: <StyleIcon />, requiresUpload: true },
  { id: 'compose', name: 'Unir', icon: <ComposeIcon />, requiresTwoUploads: true },
];

const UploadArea: React.FC<{
  id: string;
  title: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}> = ({ id, title, preview, onChange, className }) => {
  return (
    <div className={`relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-500 transition-colors ${className}`}
         onClick={() => document.getElementById(id)?.click()}>
      <input type="file" id={id} accept="image/*,video/*" className="hidden" onChange={onChange} />
      {preview ? (
        <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <UploadIcon />
          <span className="mt-2 font-semibold text-gray-300">{title}</span>
          <span className="text-xs text-gray-500 upload-text">Clique para selecionar</span>
        </div>
      )}
    </div>
  );
};

const LeftPanel: React.FC<LeftPanelProps> = ({
  prompt, setPrompt, mode, setMode, activeFunction, setActiveFunction,
  generateMedia, isLoading, handleMediaUpload, mediaPreview1, mediaPreview2,
  selectedStyle, setSelectedStyle, selectedAspectRatio, setSelectedAspectRatio
}) => {

  const renderFunctions = (functions: FunctionCardData[]) => (
    <div className="functions-grid grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
      {functions.map(f => (
        <FunctionCard
          key={f.id}
          icon={f.icon}
          name={f.name}
          isActive={activeFunction === f.id}
          onClick={() => setActiveFunction(f.id)}
        />
      ))}
    </div>
  );

  const currentFunction = [...imageFunctions, ...videoFunctions, ...editFunctions].find(f => f.id === activeFunction);
  const showSingleUpload = currentFunction?.requiresUpload;
  const showDualUpload = currentFunction?.requiresTwoUploads;

  return (
    <div className="left-panel bg-gray-800 text-white p-6 rounded-l-2xl flex flex-col space-y-6 overflow-y-auto h-full">
      <header>
        <h1 className="panel-title text-3xl font-bold text-indigo-400">🎬 AI Media Studio</h1>
        <p className="panel-subtitle text-gray-400 mt-1">Gerador profissional de imagens e vídeos</p>
      </header>

      <div className="prompt-section">
        <label htmlFor="prompt" className="section-title font-semibold text-gray-300 block mb-2">💭 Descreva sua ideia</label>
        <textarea
          id="prompt"
          className="prompt-input w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Descreva a imagem ou vídeo que você deseja criar..."
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="mode-toggle flex bg-gray-900 rounded-lg p-1">
        {(Object.keys(Mode) as Array<keyof typeof Mode>).map(key => (
          <button
            key={Mode[key]}
            onClick={() => setMode(Mode[key])}
            className={`mode-btn flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${mode === Mode[key] ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            {key}
          </button>
        ))}
      </div>
      
      <div>
        <h3 className="section-title font-semibold text-gray-300 block mb-2">⚙️ Função</h3>
        {mode === Mode.Image && <div id="imageFunctions" className="functions-section">{renderFunctions(imageFunctions)}</div>}
        {mode === Mode.Video && <div id="videoFunctions" className="functions-section">{renderFunctions(videoFunctions)}</div>}
        {mode === Mode.Edit && <div id="editFunctions" className="functions-section">{renderFunctions(editFunctions)}</div>}
      </div>

      {mode === Mode.Image && (
        <div className="space-y-4">
          <div>
            <h3 className="section-title font-semibold text-gray-300 block mb-2">🎨 Estilo da Imagem</h3>
            <ImageStyleSelector
                styles={imageStyles}
                selectedStyleId={selectedStyle}
                onSelectStyle={setSelectedStyle}
            />
          </div>
          <div>
            <h3 className="section-title font-semibold text-gray-300 block mb-2">📏 Proporção</h3>
            <AspectRatioSelector
              selectedRatio={selectedAspectRatio}
              onSelectRatio={setSelectedAspectRatio}
            />
          </div>
        </div>
      )}

      {showSingleUpload && (
         <div id="uploadArea" className="upload-area">
           <UploadArea id="mediaUpload1" title="Clique ou arraste uma mídia" preview={mediaPreview1} onChange={(e) => handleMediaUpload(e, 'mediaPreview1')} className="h-40" />
           <p className="text-xs text-gray-500 text-center mt-2">PNG, JPG, WebP (máx. 10MB)</p>
         </div>
      )}
      
      {showDualUpload && (
        <div id="twoMediaSection" className="functions-section space-y-3">
          <h3 className="font-semibold text-gray-300">📸 Duas Mídias Necessárias</h3>
          <div className="grid grid-cols-2 gap-3">
             <UploadArea id="mediaUpload1" title="Primeira Mídia" preview={mediaPreview1} onChange={(e) => handleMediaUpload(e, 'mediaPreview1')} className="h-32"/>
             <UploadArea id="mediaUpload2" title="Segunda Mídia" preview={mediaPreview2} onChange={(e) => handleMediaUpload(e, 'mediaPreview2')} className="h-32"/>
          </div>
        </div>
      )}


      <div className="flex-grow"></div>

      <button id="generateBtn" className="generate-btn w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed" onClick={generateMedia} disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="spinner animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            <span className="btn-text">Gerando...</span>
          </>
        ) : (
          <span className="btn-text">🚀 Gerar Mídia</span>
        )}
      </button>
    </div>
  );
};

export default LeftPanel;
