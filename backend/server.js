const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5001';
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Handle image upload and prediction
app.post('/api/predict', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        console.log('File received:', req.file.path);
        
        // Create form data for Flask API
        const formData = new FormData();
        const fileStream = fs.createReadStream(req.file.path);
        formData.append('file', fileStream);

        console.log('Sending request to Flask API...');
        
        // Send to Flask API
        const response = await axios.post(`${FLASK_API_URL}/predict`, formData, {
    headers: {
        ...formData.getHeaders(),
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
     });

        console.log('Received response from Flask API:', response.data);

        // Clean up: Delete the uploaded file after prediction
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        // Return the prediction results
        res.json(response.data);
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            file: req.file
        });
        
        res.status(500).json({ 
            error: 'Prediction failed', 
            details: error.response?.data || error.message
        });
    }
});
// For parsing JSON bodies in POST requests
app.use(express.json());

// In-memory user store (for demo only; use a real database in production)
const users = [];

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    users.push({ username, email, password });
    res.json({ message: 'Signup successful', user: { username, email } });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user: { username: user.username, email: user.email } });
});

app.get('/api/diseases', async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_API_URL}/api/diseases`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching diseases:', error.message);
        res.status(500).json({ error: 'Failed to fetch diseases' });
    }
});

app.listen(PORT, () => {
    console.log(`Node.js backend running on http://localhost:${PORT}`);
}); 
