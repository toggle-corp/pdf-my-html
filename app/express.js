const { Doc } = require('./sequelize');
const { validateUrl, createHash } = require('./utils');
const { retrieveFile, retrieveFilePath } = require('./storage');
const { generatePdfQueue } = require('./bull');

const handleCacheGet = async (req, res, next) => {
    try {
        console.info('[express] Receiving:', req.url);
        const url = decodeURI(req.query.url);

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

        const hash = createHash(url);

        const doc = await Doc.findOne({
            where: {
                hash,
            },
        });

        if (!doc) {
            res.status(404).send({
                message: 'Could not find cache for this url',
            });
            return;
        }

        // NOTE: should change this when storage is switched to aws
        res.status(200).send({
            ...doc.dataValues,
            url: retrieveFilePath(req, doc.hash),
        });
    } catch (baseErr) {
        next(baseErr);
    }
};

const handleCachePost = async (req, res, next) => {
    try {
        console.info('[express] Receiving:', req.url);
        const url = decodeURI(req.body.url);

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

        const hash = createHash(url);

        const doc = await Doc.findOne({
            where: {
                hash,
            },
        });

        if (doc) {
            res.status(400).send({
                message: 'The url is already queued for processing',
            });
            return;
        }

        await Doc.create({ hash, status: 'pending' });
        generatePdfQueue.add({ url, urlHash: hash });

        res.status(200).send({
            message: 'The url is queued for processing',
        });
    } catch (baseErr) {
        next(baseErr);
    }
};

// NOTE: only used for local development
const handleCacheFileGet = async (req, res, next) => {
    try {
        console.info('[express] Receiving:', req.url);
        const hash = decodeURI(req.query.hash);

        if (!hash) {
            res.status(400).send({
                message: 'hash query is required',
            });
            return;
        }

        const doc = await Doc.findOne({
            where: {
                hash,
            },
        });

        if (!doc || doc.status !== 'processed') {
            res.status(500).send('We do not have a cache for this url');
            return;
        }

        const pdf = await retrieveFile(hash);
        const fileName = hash.slice(0, 10);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=extracted${fileName}.pdf`);
        res.status(200).send(pdf);
    } catch (baseErr) {
        next(baseErr);
    }
};

module.exports = {
    handleCacheGet,
    handleCachePost,
    handleCacheFileGet,
};
