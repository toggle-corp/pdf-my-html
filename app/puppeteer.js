const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const AnonymizeUaPlugin = require('puppeteer-extra-plugin-anonymize-ua');

puppeteer.use(AnonymizeUaPlugin());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

module.exports = {
    puppeteer,
};
