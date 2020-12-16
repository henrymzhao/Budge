#!/usr/bin/env node
const BestBuy = require("./bestbuy");
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const NewEgg = require("./newegg");


const CONFIGS = {
    MAX_TIME_BETWEEN_SESSIONS: 5000
}
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: false
    });
    const LOADED_SITES = [
        new NewEgg(browser),
        // new BestBuy()
    ];

    while (true) {
        for (const site of LOADED_SITES) {
            // try {
                await site.entry();
            // }
            // catch (exception) {
            // }
        }
        await delay(CONFIGS.MAX_TIME_BETWEEN_SESSIONS);
    }
}


//execution
main();