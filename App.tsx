import React, { useState, useEffect } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import { Mode, ImageFunction, VideoFunction, EditFunction, GeneratedMediaType, AspectRatio } from './types';
import { imageStyles } from './components/styles';
import { generateMedia as callGeminiApi } from './services/geminiService';

// FIX: This file was empty, causing a module resolution error in index.tsx.
// Implemented the main App component to manage state and orchestrate the UI.
const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [mode, setMode] = useState<Mode>(Mode.Image);
    const [activeFunction, setActiveFunction] = useState<string>('image-create');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const [mediaFile1, setMediaFile1] = useState<File | null>(null);
    const [mediaFile2, setMediaFile2] = useState<File | null>(null);
    const [mediaPreview1, setMediaPreview1] = useState<string | null>(null);
    const [mediaPreview2, setMediaPreview2] = useState<string | null>(null);

    const [selectedStyle, setSelectedStyle] = useState<string>('none');
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('1:1');
    const [generatedMedia, setGeneratedMedia] = useState<GeneratedMediaType | null>(null);

    useEffect(() => {
        // Reset function and clear media when mode changes for better UX.
        switch (mode) {
            case Mode.Image:
                setActiveFunction('image-create');
                break;
            case Mode.Video:
                setActiveFunction('video-create');
                break;
            case Mode.Edit:
                setActiveFunction('add-remove');
                break;
        }
        setMediaFile1(null);
        setMediaFile2(null);
        setMediaPreview1(null);
        setMediaPreview2(null);
    }, [mode]);
    
    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, id: 'mediaPreview1' | 'mediaPreview2') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const setFile = id === 'mediaPreview1' ? setMediaFile1 : setMediaFile2;
            const setPreview = id === 'mediaPreview1' ? setMediaPreview1 : setMediaPreview2;
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    
    const generateMedia = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedMedia(null);
        setLoadingStatus('Iniciando o processo criativo...');

        const stylePromptSuffix = imageStyles.find(s => s.id === selectedStyle)?.promptSuffix || '';

        try {
            const result = await callGeminiApi({
                prompt,
                mode,
                activeFunction: activeFunction as ImageFunction | VideoFunction | EditFunction,
                media1: mediaFile1 || undefined,
                media2: mediaFile2 || undefined,
                stylePromptSuffix,
                aspectRatio: selectedAspectRatio,
                setLoadingStatus,
            });
            setGeneratedMedia(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro desconhecido.');
            }
        } finally {
            setIsLoading(false);
            setLoadingStatus('');
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
            <main className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-gray-800 rounded-2xl shadow-2xl h-[90vh] min-h-[700px]">
                <div className="lg:col-span-1 xl:col-span-1">
                    <LeftPanel
                        prompt={prompt}
                        setPrompt={setPrompt}
                        mode={mode}
                        setMode={setMode}
                        activeFunction={activeFunction}
                        setActiveFunction={setActiveFunction}
                        generateMedia={generateMedia}
                        isLoading={isLoading}
                        handleMediaUpload={handleMediaUpload}
                        mediaPreview1={mediaPreview1}
                        mediaPreview2={mediaPreview2}
                        selectedStyle={selectedStyle}
                        setSelectedStyle={setSelectedStyle}
                        selectedAspectRatio={selectedAspectRatio}
                        setSelectedAspectRatio={setSelectedAspectRatio}
                    />
                </div>
                <div className="lg:col-span-2 xl:col-span-3">
                    <RightPanel
                        isLoading={isLoading}
                        loadingStatus={loadingStatus}
                        generatedMedia={generatedMedia}
                        error={error}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
