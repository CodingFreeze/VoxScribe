import { pipeline } from '@xenova/transformers';

// Singleton to avoid loading the model multiple times
let whisperPipeline = null;
let isLoading = false;
let loadError = null;

// Initialize the Whisper model - we'll use a tiny model for the MVP
// For better transcription quality, consider using 'Xenova/whisper-small' instead
export const initWhisperModel = async (progressCallback) => {
  if (whisperPipeline) {
    return whisperPipeline;
  }
  
  if (isLoading) {
    // Wait for the current loading process to finish
    return new Promise((resolve, reject) => {
      const checkLoading = setInterval(() => {
        if (whisperPipeline) {
          clearInterval(checkLoading);
          resolve(whisperPipeline);
        }
        if (loadError) {
          clearInterval(checkLoading);
          reject(loadError);
        }
      }, 1000);
    });
  }

  try {
    isLoading = true;
    
    // Use progress callback if provided
    const onProgress = progressCallback || ((progress) => {
      console.log(`Loading Whisper model: ${Math.round(progress.progress * 100)}%`);
    });

    // Load the tiny model - ~40MB with better error handling
    try {
      whisperPipeline = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
        progress_callback: onProgress,
        quantized: false, // Use non-quantized model for better accuracy
        cache: true,
      });
    } catch (loadErr) {
      // Check for network or parsing errors
      if (loadErr.toString().includes("Unexpected token") || 
          loadErr.toString().includes("Failed to fetch") ||
          loadErr.toString().includes("NetworkError")) {
        throw new Error("Network error loading model. Please check your connection and try again.");
      }
      throw loadErr;
    }
    
    console.log('Whisper model loaded successfully');
    isLoading = false;
    return whisperPipeline;
  } catch (error) {
    console.error('Error loading Whisper model:', error);
    loadError = error;
    isLoading = false;
    throw error;
  }
};

// Convert Blob or File to ArrayBuffer
const blobToArrayBuffer = async (blob) => {
  if (!blob) {
    throw new Error('Invalid audio file: blob is null or undefined');
  }
  
  try {
    return await blob.arrayBuffer();
  } catch (error) {
    console.error('Error converting blob to ArrayBuffer:', error);
    throw new Error('Failed to process audio data');
  }
};

// Function to transcribe audio using Whisper
export const transcribeWithWhisper = async (audioFile, options = {}) => {
  try {
    if (!audioFile) {
      throw new Error('No audio file provided for transcription');
    }
    
    console.log('Transcribing audio file:', audioFile.name, 'Size:', audioFile.size, 'Type:', audioFile.type);
    
    // Make sure we have a model instance
    const model = await initWhisperModel(options.onProgress);
    console.log('Model ready for transcription');
    
    // Convert File or Blob to ArrayBuffer
    let audioData;
    if (audioFile instanceof Blob || audioFile instanceof File) {
      audioData = await blobToArrayBuffer(audioFile);
      console.log('Successfully converted audio to ArrayBuffer, size:', audioData.byteLength);
    } else if (audioFile instanceof ArrayBuffer) {
      audioData = audioFile;
      console.log('Audio already in ArrayBuffer format, size:', audioData.byteLength);
    } else {
      throw new Error('Unsupported audio format. Expected Blob, File, or ArrayBuffer');
    }
    
    console.log('Starting transcription with Whisper model...');
    
    if (options.onProgress) {
      options.onProgress({ progress: 0.5, status: 'Processing audio' });
    }
    
    // Process the audio with the model - using more reliable configuration
    const result = await model(audioData, {
      task: 'transcribe',
      return_timestamps: options.timestamps === true,
      chunk_length_s: 30,
      stride_length_s: 5,
      language: 'en', // Fixed language code
      max_new_tokens: 128,
      num_beams: 1,
    });
    
    if (options.onProgress) {
      options.onProgress({ progress: 0.9, status: 'Finalizing transcription' });
    }
    
    console.log('Transcription result:', result);

    // Format the result to match our app's expected structure
    let formattedResult = {
      text: result.text || '',
      segments: []
    };
    
    // Format timestamps if available
    if (options.timestamps && result.chunks) {
      formattedResult.segments = result.chunks.map((chunk, index) => ({
        id: index,
        start: chunk.timestamp[0],
        end: chunk.timestamp[1],
        text: chunk.text
      }));
    }
    
    // Since Whisper doesn't do speaker diarization, we'll simulate it if requested
    if (options.speakerDiarization && formattedResult.segments.length > 0) {
      // Simulate speaker assignment - in a real app, you'd use a separate model for this
      formattedResult.speakers = [
        { id: 0, segments: formattedResult.segments.filter((_, i) => i % 2 === 0).map(s => s.id) },
        { id: 1, segments: formattedResult.segments.filter((_, i) => i % 2 === 1).map(s => s.id) }
      ];
    }
    
    if (options.onProgress) {
      options.onProgress({ progress: 1.0, status: 'Complete' });
    }
    
    return formattedResult;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

// Check if the model is ready
export const isWhisperReady = () => {
  return whisperPipeline !== null;
};

// Get loading status
export const getWhisperStatus = () => {
  return {
    ready: whisperPipeline !== null,
    loading: isLoading,
    error: loadError
  };
}; 