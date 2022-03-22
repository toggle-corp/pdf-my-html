const { Doc } = require('./sequelize');
const { validateUrl, createHash } = require('./utils');
const { retrieveFile, retrieveFilePath } = require('./storage');
const { generatePdfQueue } = require('./bull');

const handleCacheGet = async (req, res, next) => {
    try {
        console.info(`[express] ${req.method} ${req.url}`);
        const url = decodeURI(req.query.url);

        if (!url) {
            res.status(400).send({
                message: '"url" is required.',
            });
            return;
        }
        if (!validateUrl(url)) {
            res.status(400).send({
                message: `"${url}" is not a valid URL.`,
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
                message: `Cache for "${url}" not found.`,
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
        console.info(`[express] ${req.method} ${req.url}`);
        const url = decodeURI(req.body.url);

        if (!url) {
            res.status(400).send({
                message: '"url" is required.',
            });
            return;
        }
        if (!validateUrl(url)) {
            res.status(400).send({
                message: `"${url}" is not a valid URL.`,
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
            // NOTE: should change this when storage is switched to aws
            res.status(200).send({
                ...doc.dataValues,
                url: retrieveFilePath(req, doc.hash),
            });
            return;
        }

        const newDoc = await Doc.create({ hash, status: 'pending' });
        res.status(200).send({
            ...newDoc.dataValues,
            url: retrieveFilePath(req, newDoc.hash),
        });

        generatePdfQueue.add({ url, urlHash: hash });
    } catch (baseErr) {
        next(baseErr);
    }
};

// NOTE: only used for local development
const handleCacheFileGet = async (req, res, next) => {
    try {
        console.info(`[express] ${req.method} ${req.url}`);
        const hash = decodeURI(req.query.hash);

        if (!hash) {
            res.status(400).send({
                message: '"hash" is required.',
            });
            return;
        }

        const doc = await Doc.findOne({
            where: {
                hash,
            },
        });

        if (!doc || doc.status !== 'processed') {
            res.status(500).send(`File for "${hash}" not found.`);
            return;
        }

        const pdf = await retrieveFile(hash);
        const fileName = hash.slice(0, 10);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=extracted${fileName}.pdf`);
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
