const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const findRemoveSync = require('find-remove')

const app = express();
const upload = multer({ dest: 'uploads/' });
// Serve static files (HTML, CSS, JS)

// Set up multer with dynamic upload directory creation
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

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

            getFilesInDirectory(); 
            // const stats = fs.statSync(outputPath);
            // if(stats.size > 1* 1024 * 1024) //1MB in bytes
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
   
    // const result = findRemoveSync(__dirname + '/uploads', { age: { seconds: 3600 }, extensions: ['.mp4', '.mov'] });

    if(fs.existsSync(upload)){
        fs.rmdirSync(upload, {recursive: true});
        console.log("Removed the uploads directory:", uploadDir);
        fs.mkdirSync(uploadDir);
        console.log("Recreated the uploads directory:", uploadDir);    }
}

  
setInterval(removeDirectory,3600000); 

// Function to get current filenames 
// in directory with specific extension 
function getFilesInDirectory() { 
  console.log("\nFiles present in directory:"); 
  let files = fs.readdirSync(__dirname); 
  files.forEach(file => { 
    console.log(file); 
  }); 
} 