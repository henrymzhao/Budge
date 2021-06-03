#!/usr/bin/env node
const {delay} = require("./siteBase");
// const BestBuy = require("./bestbuy");
const NewEggAPI = require("./newegg-api");
const BestBuyAPI = require("./bestbuy-api");
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// const NewEgg = require("./newegg");


const CONFIGS = {
    MAX_TIME_BETWEEN_SESSIONS: 10000
}

async function main() {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: true
    });
    const LOADED_SITES = [
        new NewEggAPI(browser),
        // new NewEgg(browser),
        new BestBuyAPI(browser)
    ];

    // while (true) {
        for (const site of LOADED_SITES) {
            // try {
            site.entry();
            // }
            // catch (exception) {
            // }
        }
        await delay(CONFIGS.MAX_TIME_BETWEEN_SESSIONS);
    // }
}


//execution
main();