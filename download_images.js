const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'frontend', 'public', 'images', 'crops');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const downloads = [
    {
        url: 'https://images.unsplash.com/photo-1574323347407-2cb25a07e2dc?auto=format&fit=crop&q=80&w=800',
        filename: 'wheat.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
        filename: 'rice.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1601633513360-1e5f8bc9ab30?auto=format&fit=crop&q=80&w=800',
        filename: 'maize.jpg'
    }
];

downloads.forEach((img) => {
    const dest = path.join(imagesDir, img.filename);
    const file = fs.createWriteStream(dest);
    
    https.get(img.url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();  // close() is async, call cb after close completes.
            console.log(`Downloaded ${img.filename}`);
        });
    }).on('error', (err) => { 
        fs.unlink(dest); // Delete the file async.
        console.error(`Error downloading ${img.filename}: ${err.message}`);
    });
});
