const { Doc } = require('./sequelize');
const { generatePdf } = require('./pdf');
const { validateUrl, createHash } = require('./utils');
const { retrieveFile, storeFile } = require('./storage');

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
                // res.setHeader('Content-Length', pdf.size);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
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

        try {
            const pdf = await generatePdf(url);
            await storeFile(urlHash, pdf);

            await Doc.update(
                { hash: urlHash, status: 'processed' },
                { where: { hash: urlHash } },
            );
        } catch (err) {
            console.error(err);
            await Doc.update(
                { hash: urlHash, status: 'failed' },
                { where: { hash: urlHash } },
            );
        }
    } catch (baseErr) {
        next(baseErr);
    }
};

module.exports = {
    handleGeneratePdf,
};
