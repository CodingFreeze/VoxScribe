import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;

// Initialize FFmpeg singleton
export const initFFmpeg = async () => {
  if (!ffmpeg) {
    try {
      ffmpeg = new FFmpeg();
      
      // Load FFmpeg with proper core files
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      });
      
      console.log('FFmpeg loaded successfully');
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      throw error;
    }
  }
  return ffmpeg;
};

// Preload FFmpeg on app startup
export const preloadFFmpeg = () => {
  console.log('Preloading FFmpeg...');
  initFFmpeg().catch(err => {
    console.warn('FFmpeg preloading failed, will retry when needed:', err);
  });
};

// Check if FFmpeg is loaded
export const isFFmpegLoaded = () => {
  return ffmpeg !== null && ffmpeg.loaded;
};

// Get FFmpeg instance
export const getFFmpeg = () => {
  if (!ffmpeg) {
    throw new Error('FFmpeg not initialized. Call initFFmpeg() first.');
  }
  return ffmpeg;
}; 