const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve the HTML file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/compress', upload.single('video'), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = `compressed_${Date.now()}.mp4`;

    ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .outputOptions('-crf 28')
        .on('end', () => {
            res.download(outputPath, (err) => {
                if (err) console.error(err);
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).send('Compression failed');
        })
        .run();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
