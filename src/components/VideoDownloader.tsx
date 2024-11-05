import React, { useState } from 'react';
import { Download, Link } from 'lucide-react';
import { FaYoutube, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';

const SUPPORTED_PLATFORMS = [
  { name: 'YouTube', icon: <FaYoutube className="text-red-500" /> },
  { name: 'Instagram', icon: <FaInstagram className="text-pink-500" /> },
  { name: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
  { name: 'TikTok', icon: <FaTiktok className="text-black" /> }
];

interface VideoDownloaderProps {
  isDarkMode: boolean;
}

const VideoDownloader: React.FC<VideoDownloaderProps> = ({ isDarkMode }) => {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setError('');
      setDownloadLink('');

      const response = await fetch('https://social-media-video-downloader-api.onrender.com/download-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoURL: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to download video');
      }

     const downloadLink = window.URL.createObjectURL(await response.blob());
      setDownloadLink(downloadLink);

    } catch (error: any) {
      console.error(error.message, error);
      setError('Invalid url please check the url');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-6">Download Videos</h2>
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Link className="w-5 h-5 text-gray-500" />
            <label htmlFor="videoUrl" className="text-gray-700 font-medium">
              Video URL
            </label>
          </div>
          <input
            type="url"
            id="videoUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading || !url}
          className={`w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium flex items-center justify-center space-x-2
            ${(isDownloading || !url) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          <Download className="w-5 h-5" />
          <span>{isDownloading ? 'Checking Video Info...' : 'Download Video'}</span>
        </button>

        {downloadLink && (
          <div className="mt-4">
            <a download href={downloadLink} className="text-blue-500 hover:text-blue-600">
              Click here to download your video
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
