const {SiteBase, Item} = require("./siteBase");
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
                    console.log('newegg-api.js :: ', item.title, ' :: ', 'ITEM IN STOCK');
                    await this.handleInStock(item);
                } else {
                    console.log('newegg-api.js :: ', item.title, ' :: ', 'item out of stock');
                }
            }
            await delay(Math.random() * (2000) + configs.NEW_EGG_PRODUCT_REALTIME_API);
        }
    }

    async handleInStock(item) {
        // Sound.play(path.join(__dirname, configs.IN_STOCK_SOUND));
        await item.page.goto(item.url);
        const currentCookies = await item.page.evaluate('document.cookie');
        console.log('newegg-api.js :: ', 'handleInStock :: ', 'adding to cart');
        const data = JSON.stringify({
            "ItemList": [{
                "ItemGroup": "Single",
                "ItemNumber": item.productCode,
                "Quantity": 1,
                "OptionalInfos": null,
                "SaleType": "Sales"
            }], "CustomerNumber": 0
        });

        const config = {
            method: 'post',
            url: 'https://www.newegg.ca/api/Add2Cart',
            headers: {
                'authority': 'www.newegg.ca',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36',
                'content-type': 'application/json',
                'origin': 'https://www.newegg.ca',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': item.url,
                'cookie': currentCookies
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });


    }

    async getStockInformation(item) {
        const resp = await this.callAPI(item);
        return resp.MainItem.Instock;
    }

    async callAPI(item) {
        const response = await axios({
            method: 'get',
            url: configs.NEW_EGG_PRODUCT_REALTIME_API + item.productCode,
            responseType: 'json'
        }).catch(e => {
            console.log('newegg-api.js :: ', 'API Error :: ', e.response.status, e.response.statusText);
            throw e;
        });
        return response.data;
    }

    async init() {
        //    1. Init web pages
        for (const rawUrl of secrets.NEWEGG.LINKS_TO_BUY) {
            const item = new Item(rawUrl);
            item.productCode = extractProductId(item.url);
            const webResponse = await this.callAPI(item);
            item.title = webResponse.MainItem.Description.IMDescription;
            item.page = await this.initPage(item);

            this.itemsToBuy.push(item);
        }
    }
}

const configs = {
    NEW_EGG_PRODUCT_REALTIME_API: 'https://www.newegg.ca/product/api/ProductRealtime?ItemNumber=',
    API_DELAY: 3000,
    IN_STOCK_SOUND: '../assets/smb_stage_clear.wav'
}
const extractProductId = (url) => {
    const productCode = url.split('/p/')[1].split('?')[0].slice(7);
    return [
        productCode.substr(0, 2),
        productCode.substr(2, 3),
        productCode.substr(5, 10)
    ].join('-');
}
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = NewEggAPI;