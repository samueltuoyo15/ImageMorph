import express from 'express';
import multer from 'multer';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import FormData from 'form-data'; 

dotenv.config();

const app = express();
const upload = multer();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

app.post('/remove-bg', upload.single('image'), async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  try {
    const formData = new FormData();
    formData.append('image_file', file.buffer, file.originalname);
    formData.append('size', 'auto'); 

    const response = await axios.post(REMOVE_BG_API_URL, formData, {
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY, 
        ...formData.getHeaders(), 
      },
      responseType: 'arraybuffer',
    });

    const base64Image = Buffer.from(response.data).toString('base64');
    res.json({ processedImage: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error('Error removing background:', error);
    res.status(500).json({ error: 'Failed to remove background. Please try again.' });
  }
});

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).send('Video URL is required.');
    }

    const options = {
        method: 'GET',
        url: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/all',
        params: {
            url: videoUrl
        },
        headers: {
            'X-RapidAPI-Key': process.env.DOWNLOADER_API_KEY,
            'X-RapidAPI-Host': 'social-media-video-downloader.p.rapidapi.com',
        }
    };

    try {
        const response = await axios.request(options);
        console.log(videoUrl, response.data); 
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);

        res.status(500).send(`Error occurred: ${error.message || error}`);
    }
});


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
