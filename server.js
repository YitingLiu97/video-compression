const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
// Serve static files (HTML, CSS, JS)

const upload = multer({ dest: 'uploads/' });

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
        .outputOptions('-crf 28') // Set width to 640 and maintain aspect ratio for height //-vf scale=640:-1
        .on('end', () => {
            res.download(outputPath, (err) => {
                if (err) console.error(err);
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
           // getFilesInDirectory(); 
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

function removeDirectory(){
    if(fs.existsSync(upload)){
        fs.rmdirSync(upload, {recursive: true});
        console.log("Removed the uploads directory:", upload);
        fs.mkdirSync(upload);
        console.log("Recreated the uploads directory:", upload);    }
}

//setInterval(removeDirectory,3600000); // 1 hour interval to remove all 
// Function to get current filenames 
// in directory with specific extension 
function getFilesInDirectory() { 
  console.log("\nFiles present in directory:"); 
  let files = fs.readdirSync(__dirname); 
  files.forEach(file => { 
    console.log(file); 
  }); 
} 