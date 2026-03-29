import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ModelUploaderProps {
  onModelLoad: (url: string) => void;
}

const ModelUploader: React.FC<ModelUploaderProps> = ({ onModelLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('请上传 .glb 格式的 3D 模型文件');
      return;
    }

    const url = URL.createObjectURL(file);
    onModelLoad(url);
  };

  return (
    <div className="absolute top-4 right-4 z-20">
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-1.5 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded transition-colors backdrop-blur-sm"
        aria-label="上传模型"
        title="上传 GLB 模型"
      >
        <Upload size={14} />
      </button>
    </div>
  );
};

export default ModelUploader;