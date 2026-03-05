const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'test_uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: uploadDir });

app.put('/api/v1/auth/profile', upload.single('avatar'), (req, res) => {
    console.log('MOCK ENDPOINT HIT');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    res.json({ success: true, data: { ...req.body, avatar: req.file ? req.file.path : null } });
});

app.listen(5003, () => {
    console.log('Mock server running on port 5003');
});
