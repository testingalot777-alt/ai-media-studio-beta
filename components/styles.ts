import { ImageStyle } from '../types';

// Using placeholder images from Pexels for style previews
export const imageStyles: ImageStyle[] = [
  { 
    id: 'none', 
    name: 'Sem Estilo', 
    previewUrl: 'https://images.pexels.com/photos/1648375/pexels-photo-1648375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    promptSuffix: '' 
  },
  { 
    id: 'cinematic', 
    name: 'Cinemático', 
    previewUrl: 'https://images.pexels.com/photos/1040499/pexels-photo-1040499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    promptSuffix: 'cinematic lighting, film grain, epic, dramatic, ultra-detailed, 8k' 
  },
  { 
    id: 'photorealistic', 
    name: 'Fotorrealista', 
    previewUrl: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    promptSuffix: 'photorealistic, 50mm lens, sharp focus, high details, professional photography' 
  },
  { 
    id: 'anime', 
    name: 'Anime', 
    previewUrl: 'https://images.pexels.com/photos/2448749/pexels-photo-2448749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    promptSuffix: 'anime style, vibrant colors, detailed line art, by Makoto Shinkai' 
  },
  {
    id: 'fantasy',
    name: 'Arte Fantasia',
    previewUrl: 'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    promptSuffix: 'fantasy art, intricate details, epic scale, mythical creatures, by Greg Rutkowski'
  },
  {
    id: '3d-model',
    name: 'Modelo 3D',
    previewUrl: 'https://images.pexels.com/photos/2519392/pexels-photo-2519392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    promptSuffix: '3D model, rendered in Octane, detailed, smooth shading, ambient occlusion'
  },
  { 
    id: 'low-poly', 
    name: 'Low Poly', 
    previewUrl: 'https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    promptSuffix: 'low poly, isometric, vibrant solid colors, simple shapes' 
  },
  { 
    id: 'pixel-art', 
    name: 'Pixel Art', 
    previewUrl: 'https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    promptSuffix: 'pixel art, 16-bit, detailed, vibrant color palette, retro video game style' 
  },
  { 
    id: 'watercolor', 
    name: 'Aquarela', 
    previewUrl: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    promptSuffix: 'watercolor painting, soft edges, beautiful gradients, paper texture' 
  },
  {
    id: 'neon-punk',
    name: 'Neon Punk',
    previewUrl: 'https://images.pexels.com/photos/2179603/pexels-photo-2179603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    promptSuffix: 'neon punk, cyberpunk, glowing neon lights, futuristic city, dystopian, synthwave'
  },
  {
    id: 'origami',
    name: 'Origami',
    previewUrl: 'https://images.pexels.com/photos/2079450/pexels-photo-2079450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    promptSuffix: 'origami, folded paper art, intricate folds, clean lines, minimalist'
  },
];
