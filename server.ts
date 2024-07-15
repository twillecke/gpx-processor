import express from 'express';
import multer from 'multer';
import TranslateGPX from './TranslateGPX';

const app = express();
const PORT = 3001;
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file?.buffer;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    const gpxString = file.toString('utf-8'); // Ensure proper encoding
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
