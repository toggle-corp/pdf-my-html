const Queue = require('bull');
const { pdfProcess } = require('./pdf-queue-consumer');

const redisUrl = process.env.REDIS_SERVER_URL;
const generatePdfQueue = new Queue('generate-pdf', redisUrl);

generatePdfQueue.process(pdfProcess);

function createNewPdf(data) {
    generatePdfQueue.add(data);
};

module.exports = {
    createNewPdf,
};
