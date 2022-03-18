const { Doc } = require('./sequelize');
const { validateUrl, createHash } = require('./utils');
const { retrieveFile } = require('./storage');
const { createNewPdf } = require('./pdf-queue');

const handleGeneratePdf = async (req, res, next) => {
    try {
        console.info('Receiving:', req.url);
        const { url } = req.query;

        if (!url) {
            res.status(400).send({
                message: 'url query is required',
            });
            return;
        }
        if (!validateUrl(url)) {
            res.status(400).send({
                message: `url query is invalid: ${url}`,
            });
            return;
        }

        const urlHash = createHash(url);

        const doc = await Doc.findOne({
            where: {
                hash: urlHash,
            },
        });

        if (doc) {
            if (doc.status === 'pending') {
                res.status(200).send({
                    message: 'The url is being processed.',
                });
                return;
            }
            if (doc.status === 'failed') {
                res.status(200).send({
                    message: 'Could not generate pdf from url.',
                });
                return;
            }
            if (doc.status === 'processed') {
                const pdf = await retrieveFile(urlHash);
                const fileName = urlHash.slice(0, 10);
                // res.setHeader('Content-Length', pdf.size);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=extracted${fileName}.pdf`);
                res.status(200).send(pdf);
                return;
            }

            res.status(500).send({
                message: 'We do not know what happened.',
            });
            return;
        }

        await Doc.create({ hash: urlHash, status: 'pending' });

        res.status(200).send({
            message: 'The url is queued for processing',
        });
        await  createNewPdf({ url, urlHash });

    } catch (baseErr) {
        next(baseErr);
    }
};

module.exports = {
    handleGeneratePdf,
};
