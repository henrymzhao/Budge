const {SiteBase, Item, delay} = require("./siteBase");
const secrets = require('../configs');
const axios = require('axios');
const Sound = require('sound-play');
const path = require('path')


class NewEggAPI extends SiteBase {
    constructor(browser) {
        super(browser);
        this.itemsToBuy = [];
    }

    async entry() {
        if (!this.isInitted) {
            await this.init();
            this.isInitted = true;
        }

        await this.primaryLoop();
    }

    async primaryLoop() {
        while (true) {
            for (const item of this.itemsToBuy) {
                if (await this.getStockInformation(item)) {
                    Sound.play(path.join(__dirname, configs.IN_STOCK_SOUND));
                    console.log('newegg-api.js :: ', item.url, ' :: ', 'ITEM IN STOCK');
                } else {
                    console.log('newegg-api.js :: ', item.title, ' :: ', 'item out of stock');
                }
                await delay(configs.API_DELAY);
            }
        }
    }

    async getStockInformation(item) {
        const resp = await this.callAPI(item);
        try {
            return resp.MainItem.Instock;
        } catch {
            console.log('getStockInformation :: ', item.title, ' :: ', 'We being rate limited', configs.NEW_EGG_PRODUCT_REALTIME_API + item.productCode);
            return false;
        }
    }

    async callAPI(item) {
        const response = await axios({
            method: 'get',
            url: configs.NEW_EGG_PRODUCT_REALTIME_API + item.productCode,
            responseType: 'json'
        });
        return response.data;
    }

    async init() {
        //    1. Init web pages
        for (const rawUrl of secrets.NEWEGG.LINKS_TO_BUY) {
            const item = new Item(rawUrl);
            item.productCode = this.extractProductId(item.url);
            item.title = this.extractProductName(item.url);
            // item.page = await this.initPage(item);
            this.itemsToBuy.push(item);
        }
    }

    extractProductId(url) {
        const productCode = url.split('/p/')[1].split('?')[0].slice(7);
        return [
            productCode.substr(0, 2),
            productCode.substr(2, 3),
            productCode.substr(5, 10)
        ].join('-');
    }

    extractProductName(url) {
        const parts = url.split('/');
        return parts[3];
    }
}

const configs = {
    NEW_EGG_PRODUCT_REALTIME_API: 'https://www.newegg.ca/product/api/ProductRealtime?ItemNumber=',
    API_DELAY: 3000,
    IN_STOCK_SOUND: '../assets/smb_stage_clear.wav'
}

module.exports = NewEggAPI;