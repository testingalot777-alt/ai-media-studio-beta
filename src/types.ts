export enum Mode {
  Image = 'image',
  Video = 'video',
  Edit = 'edit',
}

export type ImageFunction = 'image-create' | 'sticker' | 'text' | 'comic';
export type VideoFunction = 'video-create' | 'image-to-video' | 'text-to-video' | 'motion';
export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose';

export type GeneratedMediaType = {
  type: 'image' | 'video';
  src: string;
};

export interface FunctionCardData {
  id: string;
  name: string;
  icon: JSX.Element;
  requiresUpload?: boolean;
  requiresTwoUploads?: boolean;
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageStyle {
  id: string;
  name: string;
  previewUrl: string;
  promptSuffix: string;
}
