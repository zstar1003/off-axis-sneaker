import React, { useState, useEffect } from 'react';
import { X, Ruler, Monitor, Eye, Check } from 'lucide-react';
import { calibrationManager, CalibrationData } from '../utils/calibration';

interface CalibrationWizardProps {
  onComplete: (calibration: CalibrationData) => void;
  onSkip: () => void;
  onClose: () => void;
}

type Step = 'intro' | 'screen-size' | 'viewing-distance' | 'test';

const CalibrationWizard: React.FC<CalibrationWizardProps> = ({ onComplete, onSkip, onClose }) => {
  const [step, setStep] = useState<Step>('intro');
  const [screenWidthCm, setScreenWidthCm] = useState(34);
  const [screenHeightCm, setScreenHeightCm] = useState(19);
  const [viewingDistanceCm, setViewingDistanceCm] = useState(60);
  const [useInches, setUseInches] = useState(false);

  useEffect(() => {
    const calibration = calibrationManager.getCalibration();
    setScreenWidthCm(calibration.screenWidthCm);
    setScreenHeightCm(calibration.screenHeightCm);
    setViewingDistanceCm(calibration.viewingDistanceCm);
  }, []);

  const handleComplete = () => {
    const calibration: Partial<CalibrationData> = {
      screenWidthCm,
      screenHeightCm,
      viewingDistanceCm,
      isCalibrated: true,
    };
    calibrationManager.saveCalibration(calibration);
    onComplete(calibrationManager.getCalibration());
  };

  const handleSkip = () => {
    calibrationManager.saveCalibration({ isCalibrated: true });
    onSkip();
  };

  const cmToInches = (cm: number) => (cm / 2.54).toFixed(1);
  const inchesToCm = (inches: number) => inches * 2.54;

  const renderIntro = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-light text-white">视差校准</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        为了获得最佳的头部追踪视差效果，我们需要校准您的屏幕尺寸和观看距离。
      </p>
      <div className="space-y-3 text-sm text-gray-400">
        <div className="flex items-center gap-3">
          <Ruler className="w-4 h-4 text-orange-500" />
          <span>尺子或卷尺</span>
        </div>
        <div className="flex items-center gap-3">
          <Monitor className="w-4 h-4 text-orange-500" />
          <span>屏幕尺寸</span>
        </div>
        <div className="flex items-center gap-3">
          <Eye className="w-4 h-4 text-orange-500" />
          <span>与屏幕的距离</span>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep('screen-size')}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded transition-colors text-sm"
        >
          开始
        </button>
        <button
          onClick={handleSkip}
          className="text-gray-400 hover:text-white py-2.5 px-4 rounded transition-colors text-sm"
        >
          跳过
        </button>
      </div>
    </div>
  );

  const renderScreenSize = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-light text-white">屏幕尺寸</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        测量可见屏幕区域（不含边框）。
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setUseInches(false)}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${!useInches ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          cm
        </button>
        <button
          onClick={() => setUseInches(true)}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${useInches ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          in
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            宽度 {useInches ? '(英寸)' : '(厘米)'}
          </label>
          <input
            type="number"
            value={useInches ? Number(cmToInches(screenWidthCm)) : screenWidthCm}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              setScreenWidthCm(useInches ? inchesToCm(value) : value);
            }}
            onFocus={(e) => e.target.select()}
            className="w-full bg-transparent text-white border-b border-gray-700 focus:border-orange-500 focus:outline-none py-2 text-sm transition-colors"
            step="0.1"
            min="10"
            max="200"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">
            高度 {useInches ? '(英寸)' : '(厘米)'}
          </label>
          <input
            type="number"
            value={useInches ? Number(cmToInches(screenHeightCm)) : screenHeightCm}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              setScreenHeightCm(useInches ? inchesToCm(value) : value);
            }}
            onFocus={(e) => e.target.select()}
            className="w-full bg-transparent text-white border-b border-gray-700 focus:border-orange-500 focus:outline-none py-2 text-sm transition-colors"
            step="0.1"
            min="10"
            max="200"
          />
        </div>

        <div className="text-xs text-gray-500 pt-2">
          Aspect Ratio: {(screenWidthCm / screenHeightCm).toFixed(2)}:1
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep('intro')}
          className="text-gray-400 hover:text-white py-2.5 px-4 rounded transition-colors text-sm"
        >
          上一步
        </button>
        <button
          onClick={() => setStep('viewing-distance')}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded transition-colors text-sm"
        >
          下一步
        </button>
      </div>
    </div>
  );

  const renderViewingDistance = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-light text-white">观看距离</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        输入眼睛到屏幕的典型距离。
      </p>

      <div>
        <label className="block text-xs text-gray-400 mb-2">
          与屏幕的距离 {useInches ? '(英寸)' : '(厘米)'}
        </label>
        <input
          type="number"
          value={useInches ? Number(cmToInches(viewingDistanceCm)) : viewingDistanceCm}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            setViewingDistanceCm(useInches ? inchesToCm(value) : value);
          }}
          onFocus={(e) => e.target.select()}
          className="w-full bg-transparent text-white border-b border-gray-700 focus:border-orange-500 focus:outline-none py-2 text-sm transition-colors"
          step="1"
          min="20"
          max="200"
        />
        <p className="mt-3 text-xs text-gray-500">
          典型: {useInches ? '20-24 英寸 (笔记本) / 24-32 英寸 (台式)' : '50-60 厘米 (笔记本) / 60-80 厘米 (台式)'}
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep('screen-size')}
          className="text-gray-400 hover:text-white py-2.5 px-4 rounded transition-colors text-sm"
        >
          上一步
        </button>
        <button
          onClick={() => setStep('test')}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded transition-colors text-sm"
        >
          下一步
        </button>
      </div>
    </div>
  );

  const renderTest = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-light text-white">测试您的设置</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        移动您的头部。3D 场景应该像透过窗户一样响应。
      </p>

      <div className="space-y-2 text-xs text-gray-400">
        <p>• 向左移动显示右侧</p>
        <p>• 向右移动显示左侧</p>
        <p>• 上下移动改变垂直视角</p>
      </div>

      <p className="text-xs text-orange-400">
        提示: 使用全屏模式可获得最佳体验
      </p>

      <div className="pt-2 border-t border-gray-800">
        <div className="space-y-1 text-xs text-gray-500">
          <p>Screen: {screenWidthCm.toFixed(1)} × {screenHeightCm.toFixed(1)} cm</p>
          <p>Distance: {viewingDistanceCm.toFixed(1)} cm</p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep('viewing-distance')}
          className="text-gray-400 hover:text-white py-2.5 px-4 rounded transition-colors text-sm"
        >
          调整
        </button>
        <button
          onClick={() => {
            handleComplete();
            onClose();
          }}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Check size={16} />
          完成
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black max-w-md w-full p-8 relative border border-gray-800 rounded-sm">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={18} />
        </button>

        {step === 'intro' && renderIntro()}
        {step === 'screen-size' && renderScreenSize()}
        {step === 'viewing-distance' && renderViewingDistance()}
        {step === 'test' && renderTest()}
      </div>
    </div>
  );
};

export default CalibrationWizard;
