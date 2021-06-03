#!/usr/bin/env node
const BestBuy = require("./bestbuy");
const NewEggAPI = require("./newegg-api");
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// const NewEgg = require("./newegg");


const CONFIGS = {
    MAX_TIME_BETWEEN_SESSIONS: 10000
}
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: false
    });
    const LOADED_SITES = [
        new NewEggAPI(browser),
        // new NewEgg(browser),
        new BestBuy()
    ];

    while (true) {
        await delay(CONFIGS.MAX_TIME_BETWEEN_SESSIONS);
        for (const site of LOADED_SITES) {
            // try {
                await site.entry();
            // }
            // catch (exception) {
            // }
        }
    }
}


//execution
main();