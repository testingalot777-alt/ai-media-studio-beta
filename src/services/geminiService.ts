import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, EditFunction, GeneratedMediaType, ImageFunction, VideoFunction } from '../types';

// FIX: This file was empty and causing errors.
// This service encapsulates all interactions with the Google Gemini API.

// According to guidelines, initialize with a named apiKey parameter from process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export interface GenerateMediaParams {
    prompt: string;
    mode: 'image' | 'video' | 'edit';
    activeFunction: ImageFunction | VideoFunction | EditFunction;
    media1?: File;
    media2?: File;
    stylePromptSuffix: string;
    aspectRatio: AspectRatio;
    setLoadingStatus: (status: string) => void;
}

/**
 * Calls the appropriate Gemini API model based on the user's selection
 * to generate an image, video, or edited image.
 */
export const generateMedia = async ({
    prompt,
    mode,
    activeFunction,
    media1,
    media2,
    stylePromptSuffix,
    aspectRatio,
    setLoadingStatus,
}: GenerateMediaParams): Promise<GeneratedMediaType> => {

    const fullPrompt = `${prompt}${stylePromptSuffix ? `, ${stylePromptSuffix}` : ''}`;

    try {
        if (mode === 'image') {
            setLoadingStatus('Gerando sua imagem com IA...');
            // Guideline: Use 'imagen-4.0-generate-001' for image generation.
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: fullPrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio,
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                return {
                    type: 'image',
                    src: `data:image/jpeg;base64,${base64ImageBytes}`,
                };
            } else {
                throw new Error('Nenhuma imagem foi gerada. Tente novamente.');
            }
        } else if (mode === 'video') {
            setLoadingStatus('A geração de vídeo pode levar alguns minutos...');
            // Guideline: Use 'veo-2.0-generate-001' for video generation.
            let operation;
            if ((activeFunction === 'image-to-video' || activeFunction === 'motion') && media1) {
                const base64Image = await fileToBase64(media1);
                operation = await ai.models.generateVideos({
                    model: 'veo-2.0-generate-001',
                    prompt: fullPrompt,
                    image: {
                        imageBytes: base64Image,
                        mimeType: media1.type,
                    },
                    config: { numberOfVideos: 1 }
                });
            } else { // 'video-create' or 'text-to-video'
                operation = await ai.models.generateVideos({
                    model: 'veo-2.0-generate-001',
                    prompt: fullPrompt,
                    config: { numberOfVideos: 1 }
                });
            }

            setLoadingStatus('Processando seu vídeo... Quase lá!');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error('Falha ao gerar o vídeo. Tente novamente.');
            }
            // Guideline: Append API key when fetching video from the download link.
            const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!videoResponse.ok) {
                throw new Error(`Falha ao baixar o vídeo: ${videoResponse.statusText}`);
            }
            const videoBlob = await videoResponse.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            
            return { type: 'video', src: videoUrl };

        } else if (mode === 'edit') {
            setLoadingStatus('Editando sua imagem...');
            if (!media1) throw new Error('É necessário um upload de imagem para edição.');
            
            const base64Image1 = await fileToBase64(media1);
            const parts: any[] = [
                { inlineData: { data: base64Image1, mimeType: media1.type } }
            ];
            let finalPrompt = prompt;

            if (activeFunction === 'compose' && media2) {
                const base64Image2 = await fileToBase64(media2);
                parts.push({
                    inlineData: { data: base64Image2, mimeType: media2.type }
                });
                // Create a more direct, structured prompt for composition to avoid conversational replies.
                finalPrompt = `**INSTRUÇÃO DE COMPOSIÇÃO DE IMAGEM:**
- **IMAGEM 1:** Contém a primeira pessoa/objeto.
- **IMAGEM 2:** Contém a segunda pessoa/objeto.
- **TAREFA:** Crie uma nova cena fotorrealista combinando elementos das Imagens 1 e 2.
- **DESCRIÇÃO DA CENA:** ${prompt}
- **SAÍDA:** Gere APENAS a imagem resultante. NÃO inclua texto, explicação ou confirmação.`;
            } else {
                // Create a direct prompt for single-image editing.
                finalPrompt = `**INSTRUÇÃO DE EDIÇÃO DE IMAGEM:**
- **TAREFA:** Modifique a imagem fornecida de acordo com a seguinte instrução.
- **INSTRUÇÃO:** ${prompt}
- **SAÍDA:** Gere APENAS a imagem editada. NÃO inclua texto, explicação ou confirmação.`;
            }
            
            // Only add a text part if there's a prompt.
            if (prompt) {
                parts.push({ text: finalPrompt });
            }
            
            // Guideline: Use 'gemini-2.5-flash-image-preview' for image editing.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: parts },
                config: {
                    // Guideline: Must include both Modality.IMAGE and Modality.TEXT.
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);

            if (imagePart && imagePart.inlineData) {
                const base64ImageBytes = imagePart.inlineData.data;
                const mimeType = imagePart.inlineData.mimeType;
                return {
                    type: 'image',
                    src: `data:${mimeType};base64,${base64ImageBytes}`,
                };
            } else {
                const textPart = response.candidates?.[0]?.content?.parts.find(p => p.text);
                if (textPart && textPart.text) {
                     throw new Error(`A edição falhou: ${textPart.text}`);
                }
                throw new Error('A edição da imagem não retornou um resultado válido.');
            }
        }

        throw new Error('Modo ou função inválida selecionada.');

    } catch (error) {
        console.error("Erro na API Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Erro ao gerar mídia: ${error.message}`);
        }
        throw new Error("Ocorreu um erro desconhecido ao gerar a mídia.");
    }
};