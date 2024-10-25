import React from 'react';
import { X } from 'lucide-react';
import { ImageSettings } from '../types/image';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ImageSettings;
  updateSettings: (key: keyof ImageSettings, value: number) => void;
  isDarkMode: boolean;
}

export default function SettingsMenu({ isOpen, onClose, settings, updateSettings, isDarkMode }: SettingsMenuProps) {
  const isMobile = window.innerWidth < 768;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div className={`fixed z-50 transition-transform duration-300 ease-in-out transform ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-xl rounded-lg
        ${isMobile ? `inset-y-0 left-0 w-80 ${isOpen ? 'translate-x-0' : '-translate-x-full'}` : `top-0 left-0 right-0 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Image Settings</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Quality (%)</label>
              <input
                type="range"
                min="1"
                max="100"
                value={settings.quality}
                onChange={(e) => updateSettings('quality', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm">{settings.quality}%</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Width (px)</label>
              <input
                type="number"
                value={settings.width}
                onChange={(e) => updateSettings('width', parseInt(e.target.value))}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Height (px)</label>
              <input
                type="number"
                value={settings.height}
                onChange={(e) => updateSettings('height', parseInt(e.target.value))}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rotation (degrees)</label>
              <input
                type="number"
                value={settings.rotation}
                onChange={(e) => updateSettings('rotation', parseInt(e.target.value))}
                step="90"
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}