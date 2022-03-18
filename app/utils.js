const crypto = require('crypto');

function createHash(text) {
    const hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    hash.write(text);
    hash.end();

    return hash.read();
}

function validateUrl(str) {
    try {
        new URL(str);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    createHash,
    validateUrl,
};
