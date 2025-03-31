const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sharp = require('sharp');  // Image processing library for cropping

const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/screenshot', async (req, res) => {
    try {
        const screenshotUrl = `https://api.screenshotone.com/take?access_key=iHIor1-5ChIHWg&url=https://infographicmarketing.vercel.app&full_page=true&format=jpg&block_ads=true&block_cookie_banners=true&block_banners_by_heuristics=false&block_trackers=true&delay=0&timeout=60&response_type=by_format&image_quality=80&viewport_width=500&viewport_height=1000`;

        // Capture the screenshot
        const response = await axios.get(screenshotUrl, { responseType: 'arraybuffer' });

        // Crop the image to 500px width from the center (if needed)
        const buffer = Buffer.from(response.data, 'binary');

        // Use sharp to crop the image to 500px width (centered)
        const image = sharp(buffer);
        const metadata = await image.metadata();

        const cropX = Math.floor((metadata.width - 500) / 2);  // Calculate the center cropping point

        const croppedImage = await image.extract({ left: cropX, top: 0, width: 500, height: metadata.height }).toBuffer();

        // Send the cropped image as the response
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(croppedImage);

    } catch (error) {
        console.error('Screenshot error:', error.response ? error.response.data : error.message);
        res.status(500).send('Error capturing screenshot');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
