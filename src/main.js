#!/usr/bin/env node
const BestBuy = require("./bestbuy");
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const LOADED_SITES = [
    new BestBuy()
];

const CONFIGS = {
    MAX_TIME_BETWEEN_SESSIONS: 5000
}
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    for (const site of LOADED_SITES) {
        await startSession(site);
    }

    while (LOADED_SITES.map(x => x.boughtStatus).includes(false)) {
        for (const site of LOADED_SITES) {
            try {
                await site.entry();
            } catch (exception) {
            }
        }
        await delay(CONFIGS.MAX_TIME_BETWEEN_SESSIONS);
    }
}

async function startSession(siteObj) {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = (await browser.pages())[0];
    siteObj.page = page;
    await page.goto(siteObj.siteUrl);
}


//execution
main();