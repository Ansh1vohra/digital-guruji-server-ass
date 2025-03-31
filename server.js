const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();

app.use(cors());
app.use(express.static('public'));

app.post('/screenshot', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Use the request's origin to construct the URL
        const origin = req.headers.origin; // Get the origin from headers
        const url = `${origin}`; // Construct the URL

        await page.goto(url, { waitUntil: 'networkidle2' });

        const screenshot = await page.screenshot({
            fullPage: true,
            type: 'png',
            omitBackground: true
        });

        await browser.close();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=infographic.png');
        res.send(screenshot);

    } catch (error) {
        console.error('Screenshot error:', error);
        res.status(500).send('Error generating screenshot');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
