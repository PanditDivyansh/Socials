const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Define the path for user_data.json
const USER_DATA_FILE = path.join(__dirname, 'user_data.json');

// Ensure user_data.json exists; if not, create it as an empty array
if (!fs.existsSync(USER_DATA_FILE)) {
  fs.writeFileSync(USER_DATA_FILE, '[]', 'utf8');
  console.log('Created user_data.json');
}

// Helper function to load stored user data
const loadUserData = () => {
  try {
    return JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf8'));
  } catch (err) {
    console.error('Error loading user data:', err);
    return [];
  }
};

// Endpoint to process the image, perform OCR, and save the extracted data to user_data.json
app.post('/api/extract-id', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Remove header if present and convert to Buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Run OCR using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    console.log('OCR text extracted:', text);

    // Extract name and registration number using regex
    const nameMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/);
    const regMatch = text.match(/(\d{2}[A-Z]{3}\d{4})/);

    const extractedData = {
      name: nameMatch ? nameMatch[1].trim() : 'Not found',
      registrationNumber: regMatch ? regMatch[1].trim() : 'Not found',
      timestamp: new Date().toISOString(),
    };

    // Load existing user data and append the new entry
    const userData = loadUserData();
    userData.push(extractedData);

    // Save updated user data to user_data.json
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
    console.log('User data saved:', extractedData);

    res.json(extractedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OCR extraction and saving failed' });
  }
});

// Endpoint to retrieve stored user data
app.get('/api/get-user', (req, res) => {
  const userData = loadUserData();
  if (userData.length === 0) {
    return res.status(404).json({ error: 'User data not found' });
  }
  res.json(userData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
