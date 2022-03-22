const Queue = require('bull');
const path = require('path');
// const pdfProcessor = require('./pdf-processor');

const redisUrl = process.env.REDIS_SERVER_URL;
const generatePdfQueue = new Queue('generate-pdf', redisUrl);

const processorPath = path.join(global.APP_ROOT, 'app/pdf-processor');

// generatePdfQueue.process(pdfProcessor);
generatePdfQueue.process(4, processorPath);

generatePdfQueue.on('completed', () => {
    console.info('[bull] A job was completed');
});
generatePdfQueue.on('active', () => {
    console.info('[bull] A job was started');
});
generatePdfQueue.on('failed', (job, err) => {
    console.error('[bull] A job failed!');
    console.error(err);
});
generatePdfQueue.on('global:completed', () => {
    console.info('[bull] All jobs were completed');
});

module.exports = {
    generatePdfQueue,
};
