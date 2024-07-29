import * as dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import TranslateGPX from './TranslateGPX';
import { rateLimit } from 'express-rate-limit';
const cors = require('cors');
const compression = require('compression');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 60,
});

dotenv.config();
const app = express();
app.use(express.json());
app.use(compression());
app.use(cors());
app.use(limiter);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Request received', req.file);
  try {
    const file = req.file?.buffer;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    const gpxString = file.toString('utf-8');
    const output = await TranslateGPX.execute(gpxString);
    res.status(200).json({
      message: 'File uploaded and processed successfully.',
      result: output,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(process.env.HTTP_SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.HTTP_SERVER_PORT}`);
});
