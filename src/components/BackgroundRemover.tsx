import React, { useState } from 'react';
import { Upload, Download, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import FormData from 'form-data'; 
interface BackgroundRemoverProps {
  isDarkMode: boolean;
}

export default function BackgroundRemover({ isDarkMode }: BackgroundRemoverProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size must be less than 10MB');
      return;
    }
    
    setSelectedImage(file);
    setError('');
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

const removeBackground = async () => {
  if (!selectedImage) {
    setError('Please provide an image');
    return;
  }

  setIsProcessing(true);
  setError('');

  const formData = new FormData();
  formData.append('image_file', selectedImage);

  try {
    const response = await axios.post('http://localhost:10000/remove-bg', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
   console.log(response.data.processedImage)
    setProcessedImage(response.data.processedImage);
  } catch (error: any) {
    console.error('Error removing background:', error);
    setError(error.response?.data?.error || 'Failed to remove background. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};


  const clearAll = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setProcessedImage('');
    setError('');
  };

  return (
    <div className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {!selectedImage && (
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
              Supports PNG, JPG, WEBP (max 10MB)
            </p>
          </label>
        </div>
      )}

      {previewUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Original</h2>
              <button
                onClick={clearAll}
                className="flex items-center space-x-2 text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
            <div className="aspect-w-4 aspect-h-3 mb-4">
              <img
                src={previewUrl}
                alt="Original"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <div className="aspect-w-4 aspect-h-3 mb-4">
              {processedImage ? (
                <>
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-full object-contain rounded-lg mb-4"
                  />
                  <a
                    href={processedImage}
                    download="removed-background.png"
                    className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </a>
                </>
              ) : (
                <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Processed image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedImage && !processedImage && (
        <button
          onClick={removeBackground}
          disabled={isProcessing}
          className={`mt-8 w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium
            ${(isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              <span>Removing Background...</span>
            </div>
          ) : (
            'Remove Background'
          )}
        </button>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Built with ❤️ by Abiola</p>
      </div>
    </div>
  );
}