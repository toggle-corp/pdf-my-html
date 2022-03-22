const fs = require('fs').promises;
const path = require('path');

// FIXME: use absolute path to store file

async function storeFile(identifier, pdf) {
    const location = path.join('/pdfs', identifier);
    console.info('[storage] Writing file at', location);
    await fs.writeFile(location, pdf);
}

async function retrieveFile(identifier) {
    const location = path.join('/pdfs', identifier);

    console.info('[storage] Reading file at', location);
    const file = await fs.readFile(location);
    return file;
}

function retrieveFilePath(req, identifier) {
    const { host } = req.headers;
    return `${host}/cache-file/?hash=${identifier}`;
}

module.exports = {
    storeFile,
    retrieveFile,
    retrieveFilePath,
};
