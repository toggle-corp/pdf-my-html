const fs = require('fs').promises;
const path = require('path');

// FIXME: use absolute path to store file

async function storeFile(identifier, pdf) {
    const location = path.join('/pdfs', identifier);
    console.info('Writing file at', location);
    await fs.writeFile(location, pdf);
}

async function retrieveFile(identifier) {
    const location = path.join('/pdfs', identifier);

    console.info('Reading file at', location);
    const file = await fs.readFile(location);
    return file;
}

module.exports = {
    storeFile,
    retrieveFile,
};
