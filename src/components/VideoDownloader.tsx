import React, { useState } from 'react';
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter, FaTiktok, FaLinkedin } from 'react-icons/fa';

const SUPPORTED_PLATFORMS = [
  { name: 'Facebook', icon: <FaFacebook className="text-blue-500" /> },
  { name: 'YouTube', icon: <FaYoutube className="text-red-500" /> },
  { name: 'Instagram', icon: <FaInstagram className="text-pink-500" /> },
  { name: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
  { name: 'TikTok', icon: <FaTiktok className="text-black" /> },
  { name: 'LinkedIn', icon: <FaLinkedin className="text-blue-500" /> },
];

const VideoDownloader = ({ isDarkMode }) => {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY;
  console.log(API_KEY);
  const API_HOST = 'social-download-all-in-one.p.rapidapi.com';

  const handleDownload = async () => {
    setIsDownloading(true);
    setError('');
    setVideoData(null);

    try {
      const response = await fetch(
        `https://${API_HOST}/v1/social/autolink`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch video data.');
      }

      const data = await response.json();
      setVideoData(data);

      if (data.medias && data.medias.length > 0) {
        setSelectedUrl(data.medias[0].url);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please check the URL or try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const triggerFileDownload = async (mediaUrl) => {
    try {
      setError('');
      setIsDownloading(true);

      const proxyUrl = `/download?url=${encodeURIComponent(mediaUrl)}`;
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download the video. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-6">Video Downloader</h2>
        <div className="flex items-center justify-center space-x-4 mb-6">
          {SUPPORTED_PLATFORMS.map((platform) => (
            <span key={platform.name} className="text-3xl">
              {platform.icon}
            </span>
          ))}
        </div>
        <div className="mb-8">
          <label htmlFor="videoUrl" className="font-medium block mb-2">
            Enter Video URL
          </label>
          <input
            type="url"
            id="videoUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste the video URL here..."
            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button
          onClick={handleDownload}
          disabled={isDownloading || !url}
          className={`w-full py-3 rounded-lg bg-blue-500 text-white font-medium ${
            isDownloading || !url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {isDownloading ? 'Fetching Video Info...' : 'Get Video'}
        </button>
        {videoData && (
          <div className="mt-6 p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-4">Video Details</h3>
            {videoData.thumbnail && <img src={videoData.thumbnail} alt="Video Thumbnail" className="w-full rounded-md mb-4" />}
            <p className="text-gray-700 mb-2">
              <strong>Title:</strong> {videoData.title}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Source:</strong> {videoData.source}
            </p>
            <p className="text-gray-700">
              <strong>Duration:</strong> {videoData.duration} seconds
            </p>
            <div className="mt-4">
              <label htmlFor="qualitySelect" className="block mb-2">
                Select Quality
              </label>
              <select
                id="qualitySelect"
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="w-full p-2 rounded-md border"
              >
                {videoData.medias.map((media, index) => (
                  <option key={index} value={media.url}>
                    Quality {media.quality}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => triggerFileDownload(selectedUrl)}
              disabled={!selectedUrl}
              className={`w-full mt-4 bg-blue-500 text-white p-3 rounded-md ${
                selectedUrl ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Download Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDownloader;
