import React, { useRef, useState } from 'react';
import { Upload, Box } from 'lucide-react';

interface ModelUploaderProps {
  onModelLoad: (url: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const ModelUploader: React.FC<ModelUploaderProps> = ({
  onModelLoad,
  isCollapsed = true,
  onToggle
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('请上传 .glb 格式的 3D 模型文件');
      return;
    }

    const url = URL.createObjectURL(file);
    setFileName(file.name);
    onModelLoad(url);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="absolute top-4 right-16 z-20">
      {isCollapsed ? (
        <button
          onClick={onToggle}
          className="p-1.5 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded transition-colors backdrop-blur-sm"
          aria-label="上传模型"
          title="上传 GLB 模型"
        >
          <Upload size={14} />
        </button>
      ) : (
        <div className="bg-black bg-opacity-70 backdrop-blur-sm text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-2">
              <Box size={14} />
              <span className="text-xs font-medium">3D 模型</span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
              aria-label="关闭"
            >
              <Upload size={14} />
            </button>
          </div>

          <div className="px-4 pb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded transition-colors text-sm"
            >
              <Upload size={14} />
              上传 GLB 模型
            </button>
            {fileName && (
              <p className="text-xs text-gray-400 mt-2 truncate" title={fileName}>
                已加载: {fileName}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelUploader;
