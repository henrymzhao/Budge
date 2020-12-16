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
            //    3. Check stock
            if (await this.isInStock(item)) {
                //    3.1 In stock handle
                await this.beginBuyProcess(item);
            } else {
                //    3.2 Out of stock handle
                await this.handleOutOfStock(item);
            }
        }
    }

    async beginBuyProcess(item) {
    //   3.1.1. add to cart
    //   3.1.2. reject optional addons (if any)
    //   3.1.3. view cart and checkout
    //   3.1.4. paypal checkout
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
        await item.page.reload();
    }
}


module.exports = NewEgg;