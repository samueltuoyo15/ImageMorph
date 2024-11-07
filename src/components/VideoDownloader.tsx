import React, { useState } from 'react';
import { Download, Link } from 'lucide-react';
import {FaFacebook, FaYoutube, FaInstagram, FaTwitter, FaTiktok, FaLinkedin} from 'react-icons/fa';

const SUPPORTED_PLATFORMS = [
  { name: 'Facebook', icon: <FaFacebook className="text-blue-500" /> },
  { name: 'YouTube', icon: <FaYoutube className="text-red-500" /> },
  { name: 'Instagram', icon: <FaInstagram className="text-pink-500" /> },
  { name: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
  { name: 'TikTok', icon: <FaTiktok className="text-black" /> },
  { name: 'LinkedIn', icon: <FaLinkedin className="text-black text-blue-500" /> }
];

interface VideoDownloaderProps {
  isDarkMode: boolean;
}

const VideoDownloader: React.FC<VideoDownloaderProps> = ({ isDarkMode }) => {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState<any>(null);
  const [selectedUrl, setSelectedUrl] = useState(''); 

const handleDownload = async () => {
  try {
    setIsDownloading(true);
    setError('');
    setVideoData(null);

    const response = await fetch('https://social-media-video-downloader-api.onrender.com/download-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoURL: url }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch video data');
    }

    const data = await response.json();
    console.log(data);
    setVideoData(data);

    if (data.mediaUrls && data.mediaUrls.length > 0) {
      const videoUrl = data.mediaUrls[0].url;

     const videoResponse = await fetch(videoUrl);
      const videoBlob = await videoResponse.blob();
    const blobUrl = URL.createObjectURL(videoBlob);
      setSelectedUrl(blobUrl);
    }
  } catch (error: any) {
    console.error(error.message, error);
    setError('An error occurred. Please check the URL or try again later.');
  } finally {
    setIsDownloading(false);
  }
};



  const handleMediaSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUrl(event.target.value);
  };

  return (
    <div className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-6">Download Videos</h2>
          <div className="flex items-center justify-center space-x-4 mb-6">
          {SUPPORTED_PLATFORMS.map((platform) => (
            <span key={platform.name} className="text-3xl">
              {platform.icon}
            </span>
          ))}
        </div>
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Link className={`w-5 h-5 text-gray-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}/>
            <label htmlFor="videoUrl" className="font-medium">
              Video URL
            </label>
          </div>
          <input
            type="url"
            id="videoUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here..."
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
          />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading || !url}
          className={`w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium flex items-center cursor-pointer justify-center space-x-2
            ${(isDownloading || !url) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          <span>{isDownloading ? 'Checking Video Info...' : 'Continue'}</span>
        </button>

       {videoData && (
          <div className={`mt-6 p-4 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {videoData.image && <img src={videoData.image} className="w-full mb-3 rounded-lg shadow-md" />}
            {videoData.title && <p className="text-xl font-semibold mb-3 text-center">{videoData.title}</p>}
            {videoData.source && <p className="text-sm text-gray-600 mb-3 text-center">Source: {videoData.source}</p>}
            {videoData.duration && <p className="text-sm text-gray-600 mb-3 text-center">Duration: {videoData.duration} seconds</p>}

            <div className="mt-4">
              <label htmlFor="qualitySelect" className="block mb-2 text-gray-600 text-sm text-center">Select Quality</label>
              <select
                id="qualitySelect"
                onChange={handleMediaSelection}
                className="w-full p-2 mb-4 border border-gray-300 rounded-full text-gray-700 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {videoData.mediaUrls.map((media: { url: string; quality: string }, index: number) => (
                  <option key={index} value={media.url}>Quality {media.quality}</option>
                ))}
              </select>
            </div>
            <a download href={selectedUrl} className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center justify-center font-medium transition transform cursor-pointer hover:scale-105">
              <Download className="w-5 h-5 inline mr-2" /> Download
            </a>
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Built with ❤️ by Abiola & Samuel</p>
      </div>
    </div>
  );
};

export default VideoDownloader;
                     
