const { Doc } = require('./sequelize');
const { generatePdf } = require('./pdf');
const { storeFile } = require('./storage');

const pdfProcess = async (job) => {
    try {
        const pdf = await generatePdf(job.data.url);
        await storeFile(job.data.urlHash, pdf);

        await Doc.update(
            { hash: job.data.urlHash, status: 'processed' },
            { where: { hash: job.data.urlHash } },
        );
    } catch (err) {
        await Doc.update(
            { hash: job.data.urlHash, status: 'failed' },
            { where: { hash: job.data.urlHash } },
        );
    }
}

module.exports = {
    pdfProcess,
}
