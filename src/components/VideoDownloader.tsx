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

  const handleDownload = async () => {
    setIsDownloading(true);
    setError('');
    setVideoData(null);

    try {
      const response = await fetch(`https://proxy-h8gy.onrender.com/download?url=${url}`);

      if (!response.ok) {
        throw new Error('Failed to fetch video data.');
      }

      const data = await response.json();
      setVideoData(data);
      console.log(data)

      if (data.links && data.links.length > 0) {
        setSelectedUrl(data.links[0].link);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please check the URL or try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const inputStyles = isDarkMode
    ? 'bg-gray-900 text-white border-gray-700'
    : 'bg-white text-gray-900 border-gray-300';

  const buttonStyles = isDownloading || !url
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:bg-blue-600';

  const cardStyles = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className={`p-8 rounded-xl shadow-lg ${cardStyles}`}>
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
            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 ${inputStyles}`}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading || !url}
          className={`w-full py-3 rounded-lg bg-blue-500 text-white font-medium ${buttonStyles}`}
        >
          {isDownloading ? 'Fetching Video Info...' : 'Get Video'}
        </button>

        {videoData && (
          <div className="mt-6 p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-4">Video Details</h3>
            {videoData.picture && <img src={videoData.picture} alt="Video Thumbnail" className="w-full rounded-md mb-4" />}
            <p className="text-gray-700 mb-2">
              <strong>Title:</strong> {videoData.title}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Category:</strong> {videoData.stats.category}
            </p>
             <p className="text-gray-700 mb-2">
              <strong>Duration:</strong> {videoData.links[0].approxDurationMs} milleseconds
            </p>

            {videoData.links && videoData.links.length > 0 && (
              <div className="mt-4">
                <label htmlFor="qualitySelect" className="block mb-2">
                  Select Quality
                </label>
                <select
                  id="qualitySelect"
                  onChange={(e) => setSelectedUrl(e.target.value)}
                  className="w-full p-2 rounded-md border"
                >
                  {videoData.links.map((media, index) => (
                    <option key={index} value={media.link}>
                      Quality {media.quality}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <a
              download
              href={selectedUrl}
              style={{
                pointerEvents: !selectedUrl ? 'none' : 'auto',
                opacity: !selectedUrl ? 0.5 : 1,
              }}
              className="block w-full mt-4 bg-blue-500 text-center text-white p-3 rounded-md hover:bg-blue-600"
            >
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDownloader;
