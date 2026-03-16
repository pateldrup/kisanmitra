const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'frontend', 'public', 'images', 'crops');

const downloads = [
    {
        url: 'https://storage.googleapis.com/antigravity-attachments/1r3ebn18t529r/image.png',
        filename: 'wheat.jpg'
    },
    {
        url: 'https://storage.googleapis.com/antigravity-attachments/1r3ebn18sytt8/image.png',
        filename: 'maize.jpg'
    }
];

downloads.forEach((img) => {
    const dest = path.join(imagesDir, img.filename);
    const file = fs.createWriteStream(dest);
    
    https.get(img.url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();  
            console.log(`Downloaded user image to ${img.filename}`);
        });
    }).on('error', (err) => { 
        fs.unlink(dest, () => {}); 
        console.error(`Error downloading ${img.filename}: ${err.message}`);
    });
});
