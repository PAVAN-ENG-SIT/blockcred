import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface DragDropZoneProps {
  onFileAccepted: (file: File) => void;
}

export function DragDropZone({ onFileAccepted }: DragDropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
        <div className={`p-4 rounded-full transition-colors duration-200 ${isDragActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400'}`}>
          <UploadCloud className="w-10 h-10" />
        </div>
        <div>
          <p className="text-xl font-medium text-gray-200">
            {isDragActive ? 'Drop credential here...' : 'Click or Drag & Drop'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Upload your document to verify its cryptographic proof
          </p>
        </div>
      </div>
    </div>
  );
}
