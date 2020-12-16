const secrets = require("../configs");
const {SiteBase, Item} = require("./siteBase");

const configs = {
    OUT_OF_STOCK_TEXT: 'CURRENTLY SOLD OUT'
}

class NewEgg extends SiteBase {
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
        //    2. For each page
        for (const item of this.itemsToBuy) {
            try {
                //    3. Check stock
                if (await this.isInStock(item)) {
                    //    3.1 In stock handle
                    await this.beginBuyProcess(item);
                } else {
                    //    3.2 Out of stock handle
                    await this.handleOutOfStock(item);
                }
            } catch (exception) {
                await item.page.goto(item.url);
            }

        }
    }

    async beginBuyProcess(item) {
        //3.1.0 check if some how it's already in our cart
        if (!await this.isInCart(item)) {
            //   3.1.1. add to cart
            console.log('newegg.js :: ', 'beginBuyProcess :: ', 'add to cart');
            await item.page.click('#ProductBuy button.btn-primary');
            await this.enforceValidUrl(item);
            //check if newegg is being pesky
            if (await item.page.$eval('body',
                (body, outOfStock) => body.innerHTML.indexOf(outOfStock) === -1,
                'Oops...looks like we have encountered some problem on our end')) {
                await item.page.goto(item.url);
            }
            // await item.page.waitForTimeout(500);
            //   3.1.2. reject optional addons (if any)
            // console.log('newegg.js :: ', 'beginBuyProcess :: ', 'reject optional addons (if any)');
            // await item.page.click('[data-dismiss="modal"]');
        }
        //   3.1.3. view cart and checkout
        // await Promise.all([
        //     await item.page.waitForNavigation(),
            await item.page.click('.nav-complex-inner[title="Shopping Cart"]')
        // ]);
        //   3.1.4. paypal checkout
        console.log('newegg.js :: ', 'beginBuyProcess :: ', 'paypal checkout');
        await item.page.click('.paypal-button-container');
    }

    async init() {
        //    1. Init web pages
        for (const rawUrl of secrets.NEWEGG.LINKS_TO_BUY) {
            const item = new Item(rawUrl);
            item.page = await this.initPage(item);
            this.itemsToBuy.push(item);
        }
    }

    async isInStock(item) {
        console.log('newegg.js :: ', 'isInStock :: ', 'checking stock');

        return await item.page.$eval('body',
            (body, outOfStock) => body.innerHTML.indexOf(outOfStock) === -1,
            configs.OUT_OF_STOCK_TEXT);
    }

    async handleOutOfStock(item) {
        console.log('newegg.js :: ', 'handleOutOfStock :: ', 'not in stock, refreshing');
        await item.page.goto(item.url);
    }

    async isInCart(item) {
        return await item.page.$eval('.nav-complex-inner[title="Shopping Cart"]',
            button => button.innerHTML.toLowerCase().indexOf('item') !== -1);
    }

    async enforceValidUrl(item) {
        if (!await item.page.url() === item.url) {
            await item.page.goto(item.url);
            throw new Error('Newegg kicked us around');
        }
    }
}

module.exports = NewEgg;

//investigate https://www.newegg.ca/product/api/ProductRealtime?ItemNumber=19-113-666

// interesting
/**
 * decodeURIComponent(JSON.parse(document.cookie.split(';')
 .map(v => v.split('='))
 .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
    }, {}).NV_OTHERINFO.substr(2)).Sites.CAN.Values.sc)
 JSON.parse(document.cookie.split(';')
 .map(v => v.split('='))
 .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
    }, {}).NV_OTHERINFO.substr(2)).Sites.CAN.Values
 **/