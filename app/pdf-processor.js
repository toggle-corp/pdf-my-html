const { Doc } = require('./sequelize');
const { generatePdf } = require('./pdf');
const { storeFile } = require('./storage');

module.exports = async function pdfProcessor(job) {
    console.log('[bull] Starting pdf generation for', job.data.url);
    try {
        const { pdf, timedout } = await generatePdf(job.data.url);
        await storeFile(job.data.urlHash, pdf);

        const value = await Doc.update(
            { hash: job.data.urlHash, status: 'processed', timedout },
            { where: { hash: job.data.urlHash } },
        );
        return value;
    } catch (err) {
        console.log('[bull] Some error occurred while processing', job.data.url);
        console.log(err);

        const value = await Doc.update(
            { hash: job.data.urlHash, status: 'failed' },
            { where: { hash: job.data.urlHash } },
        );
        return value;
    }
};
