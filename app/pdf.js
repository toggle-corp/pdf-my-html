const { puppeteer } = require('./puppeteer');

async function generatePdf(url) {
    // console.log('Opening browser');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox', // root cannot run puppeteer without --no-sandbox
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
        ],
    });

    // console.log('Creating incognito context');
    const context = await browser.createIncognitoBrowserContext();

    // console.log('Opening page');
    const page = await context.newPage();

    /*
    console.log('Setting viewport');
    await page.setViewport({
        width: 1600,
        height: 900,
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });

    console.log('Emulating screen');
    await page.emulateMediaType('screen');
    */

    // console.log('Waiting on url');
    await page.goto(url, { waitUntil: 'networkidle0' });

    // console.log('Creating pdf');
    // Word's default A4 margins: 2.54cm
    const margin = '0cm';
    const pdfConfig = {
        format: 'A4',
        printBackground: true,
        margin: {
            top: margin,
            bottom: margin,
            left: margin,
            right: margin,
        },
    };
    const pdf = await page.pdf(pdfConfig);

    // console.log('Closing browser');
    await browser.close();

    return pdf;
}

module.exports = {
    generatePdf,
};
