const Queue = require('bull');
const { pdfProcess } = require('./pdf-queue-consumer');

const generatePdfQueue = new Queue('generate-pdf', 'redis://redis:6379/0');

generatePdfQueue.process(pdfProcess);

function createNewPdf(data) {
    generatePdfQueue.add(data);
};

module.exports = {
    createNewPdf,
};
