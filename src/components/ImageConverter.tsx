import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sun, Moon, Download, Trash2, Settings, Crop, ZoomIn, RotateCw } from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import { ImageFormat, ConvertedImage, ImageSettings } from '../types/image';

export default function ImageConverter() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ImageSettings>({
    quality: 90,
    width: 800,
    height: 600,
    rotation: 0
  });
  const [dragActive, setDragActive] = useState(false);

  // Close settings menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelection(file);
    }
  }, []);

  const handleImageSelection = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertImage = async () => {
    if (!selectedImage) return;
    setIsConverting(true);

    const formats: ImageFormat[] = ['png', 'jpeg', 'webp','svg'];
    const converted: ConvertedImage[] = [];

    for (const format of formats) {
      converted.push({
        format,
        url: previewUrl,
        size: formatBytes(selectedImage.size)
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setConvertedImages(converted);
    setIsConverting(false);
  };

  const clearAll = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setConvertedImages([]);
    setSettings({
      quality: 90,
      width: 800,
      height: 600,
      rotation: 0
    });
  };

  const updateSettings = (key: keyof ImageSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SettingsMenu
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        updateSettings={updateSettings}
        isDarkMode={isDarkMode}
      />

      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold">ImageMorph</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                title="Image Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <div
          className={`mb-8 p-8 rounded-xl border-2 border-dashed transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : isDarkMode
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-300 bg-white'
          } text-center`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="imageUpload"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <Upload className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <div className="text-lg font-medium">
              Drop your image here or click to upload
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Supports PNG, JPG, WEBP
            </p>
          </label>
        </div>

        {/* Preview Section */}
        {previewUrl && (
          <div className={`mb-8 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Preview</h2>
              <div className="flex items-center space-x-4">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Size: {formatBytes(selectedImage?.size || 0)}
                </div>
                <button
                  onClick={clearAll}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-96 rounded-lg"
                style={{ transform: `rotate(${settings.rotation}deg)` }}
              />
            </div>
            <div className="flex justify-center space-x-4 mb-4">
              <button
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Rotate 90°"
                onClick={() => updateSettings('rotation', (settings.rotation + 90) % 360)}
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Crop"
              >
                <Crop className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Zoom"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={convertImage}
              disabled={isConverting}
              className={`w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium
                ${isConverting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              {isConverting ? 'Converting...' : 'Convert Image'}
            </button>
          </div>
        )}

        {/* Converted Images */}
        {convertedImages.length > 0 && (
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className="text-xl font-semibold mb-4">Converted Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {convertedImages.map((img, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Converted to ${img.format}`}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium uppercase">{img.format}</span>
                      <span className="text-sm text-gray-500 ml-2">{img.size}</span>
                    </div>
                    <a
                      href={img.url}
                      download={`converted.${img.format}`}
                      className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-8 py-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            ImageMorph - Convert your images with ease
          </p>
        </div>
      </footer>
    </div>
  );
}