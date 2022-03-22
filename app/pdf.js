const { puppeteer } = require('./puppeteer');

async function generatePdf(url) {
    // console.log('[puppeteer] Opening browser');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox', // root cannot run puppeteer without --no-sandbox
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
        ],
    });

    // console.log('[puppeteer] Creating incognito context');
    const context = await browser.createIncognitoBrowserContext();

    // console.log('[puppeteer] Opening page');
    const page = await context.newPage();

    // console.log('[puppeteer] Setting viewport');
    await page.setViewport({
        width: 1600,
        height: 900,
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });

    // console.log('[puppeteer] Emulating screen');
    await page.emulateMediaType('screen');

    // console.log('[puppeteer] Waiting on url');
    let timedout = false;
    try {
        await page.goto(url, { waitUntil: 'networkidle0' });
    } catch (err) {
        console.error(err);
        timedout = true;
    }

    // console.log('[puppeteer] Creating pdf');
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

    // console.log('[puppeteer] Closing browser');
    await browser.close();

    return { pdf, timedout };
}

module.exports = {
    generatePdf,
};
