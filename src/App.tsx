import React, { useState, useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import ImageConverter from './components/ImageConverter';
import BackgroundRemover from './components/BackgroundRemover';
import VideoDownloader from './components/VideoDownloader';
import Preloader from './components/Preloader';
import { Sun, Moon, Image as ImageIcon } from 'lucide-react';
import 'react-tabs/style/react-tabs.css';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div onContextMenu={(e) => e.preventDefault()}  className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode text-gray-900'} select-none`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">ImageMorph</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>
        <Tabs>
          <TabList className="flex space-x-4 mb-8 border-b border-gray-200">
            <Tab className="tab">Image Converter</Tab>
            <Tab className="tab">Background Remover</Tab>
            <Tab className="tab">Video Downloader</Tab>
          </TabList>

          <TabPanel className="tab-panel">
            <ImageConverter isDarkMode={isDarkMode} />
          </TabPanel>
          <TabPanel className="tab-panel">
            <BackgroundRemover isDarkMode={isDarkMode} />
          </TabPanel>
          <TabPanel className="tab-panel">
            <VideoDownloader isDarkMode={isDarkMode} />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default App;