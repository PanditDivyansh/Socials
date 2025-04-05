const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const { send } = require('vite');

const app = express();
app.use(cors({
  origin: true, // or true (but make sure to test on same port)
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser()); // must come before session
app.use(session({
  secret: 'socials',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax' // 'lax' works fine for same-site setup
  }
}));




mongoose.connect('mongodb://localhost:27017/socialusers', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connected successfully.'))
.catch(err => console.error('MongoDB Connection Error:', err));

const USER_DATA_FILE = path.join(__dirname, 'user_data.json');

if (!fs.existsSync(USER_DATA_FILE)) {
  fs.writeFileSync(USER_DATA_FILE, '[]', 'utf8');
  console.log('Created user_data.json');
}

const loadUserData = () => {
  try {
    return JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf8'));
  } catch (err) {
    console.error('Error loading user data:', err);
    return [];
  }
};

app.post('/api/extract-id', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    console.log('OCR text extracted:', text);

    const nameMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/);
    const regMatch = text.match(/(\d{2}[A-Z]{3}\d{4})/);

    const extractedData = {
      name: nameMatch ? nameMatch[1].trim() : 'Not found',
      registrationNumber: regMatch ? regMatch[1].trim() : 'Not found',
      timestamp: new Date().toISOString(),
    };


    const usr = new User({
      Name: extractedData.name,
      Regno: extractedData.registrationNumber,
      email: '',
      verified: false
    });

    await usr.save();
    console.log('User Saved');

    const userData = loadUserData();
    
    userData.push(extractedData);

    fs.writeFile(USER_DATA_FILE, JSON.stringify(userData, null, 2), (err) => {
      if (err) console.error('Error saving user data:', err);
      else console.log('User data saved successfully');
    });

    res.json(extractedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OCR extraction and saving failed' });
  }
});

app.get('/api/get-user', (req, res) => {
  console.log('get-user endpoint hit');
  const userData = loadUserData();
  if(!req.session.user){
    req.session.user = userData;
      req.session.save(()=>{
        console.log('Session created')
      })}
  if (userData.length === 0) {
    return res.status(404).json({ error: 'User data not found' });
  }
  res.json(userData);
});

app.get('/get-session',(req,res)=>{
  if(req.session.user){
    res.json(req.session.user)
  }else{
    res.send("Not available")
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));