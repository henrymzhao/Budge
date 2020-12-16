class SiteBase {
    constructor(browser) {
        this.browser = browser;
        this.isInitted = false;
    }

    async entry() {

    }

    async initPage(item) {
        console.log('siteBase.js :: ', 'initPage :: ', 'starting watch for ', item.url);
        const page = await this.browser.newPage();
        await page.goto(item.url);
        return page;
    }
}

class Item {
    constructor(url) {
        this.url = url;
        this.isBought = false;
        this.page = null;
    }
}

module.exports = {
    SiteBase, Item
}