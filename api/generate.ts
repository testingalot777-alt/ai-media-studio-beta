// api/generate.ts
// Este código NUNCA será executado no navegador do usuário, apenas no servidor da Vercel.
import { GoogleGenAI } from "@google/genai";

// A Vercel permite que você configure variáveis de ambiente de forma segura no painel dela.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Lógica para lidar com a requisição do seu frontend
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Apenas POST é permitido' });
  }

  try {
    const params = request.body; // Recebe os parâmetros (prompt, etc.) do seu app
    
    // Adapte esta lógica para chamar a função correta da sua API Gemini
    // Exemplo para geração de imagem:
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: params.prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: params.aspectRatio,
      },
    });
    
    // Envie a resposta de volta para o seu app
    response.status(200).json(imageResponse);

  } catch (error) {
    console.error(error);
    response.status(500).json({ message: error.message || 'Erro interno do servidor' });
  }
}