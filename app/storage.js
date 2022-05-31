const AWS = require('@aws-sdk/client-s3');

const fs = require('fs').promises;
const path = require('path');

// Create an Amazon S3 service client object.
const s3Client = process.env.S3_BUCKET_NAME ? new AWS.S3Client({
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET,
}) : undefined;

async function storeFile(identifier, pdf) {
    if (s3Client) {
        console.info('[s3] Uploading file at', process.env.S3_BUCKET_NAME, identifier);
        const response = await s3Client.send(
            new AWS.PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: identifier,
                Body: pdf,
                ContentType: 'application/pdf',
            })
        );
        return response;
    }
    const location = path.join('/pdfs', identifier);
    console.info('[storage] Writing file at', location);
    const response = await fs.writeFile(location, pdf);
    return response;
}

async function retrieveFile(identifier) {
    if (s3Client) {
        // NOTE: we do not need to handle this case
        return undefined;
    }
    const location = path.join('/pdfs', identifier);

    console.info('[storage] Reading file at', location);
    const file = await fs.readFile(location);
    return file;
}

function retrieveFilePath(req, identifier) {
    if (s3Client) {
        return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${identifier}`;
    }

    const { host } = req.headers;
    return `${host}/cache-file/?hash=${identifier}`;
}

module.exports = {
    storeFile,
    retrieveFile,
    retrieveFilePath,
};
