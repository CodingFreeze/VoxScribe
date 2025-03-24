// Check if a file is a valid audio file
export const isAudioFile = (file) => {
  const validTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/webm',
    'audio/ogg',
    'audio/x-m4a',
    'audio/m4a',
    'audio/mp4',
    'audio/x-mp4',
    'audio/aac',
    'audio/flac'
  ];
  
  return validTypes.includes(file.type);
};

// Format file size to human-readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format time in seconds to MM:SS format
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

// Download text as a file
export const downloadTextFile = (text, filename, extension = 'txt') => {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `${filename}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate a unique ID
export const generateId = () => {
  return '_' + Math.random().toString(36).substring(2, 11);
}; 