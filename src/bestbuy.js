const {SiteBase} = require("./siteBase");
const secrets = require("../configs")

class BestBuy extends SiteBase {
    constructor() {
        super(configs.STARTING_URL);
    }

    async entry() {
        await super.entry();
        if (!this.isInitted) {
            await init(this.page);
            this.isInitted = true;
        }
        await this.page.goto(configs.CHECKOUT_URL);
        if (await isStockAvailable(this.page)) {
            console.warn(new Date().toLocaleTimeString(), ' :: ', 'entry :: ', 'available for purchase');
            await pressCheckout(this.page);
            this.boughtStatus = true;
        } else {
            console.warn(new Date().toLocaleTimeString(), ' :: ', 'entry :: ', 'no stock');
        }
    }
}

const init = async (page) => {
    if (!await isLoggedIn(page)) {
        console.info(new Date().toLocaleTimeString(), ' :: ', 'entry :: ', 'not signed in');
        await login(page);
    }
}

const isLoggedIn = async (page) => {
    const loginButton = await page.$eval('[data-automation="sign-in-text"]', btn => btn.innerHTML);
    return loginButton !== configs.NOT_LOGGED_IN_LABEL;
}

const pressCheckout = async (page) => {
    console.info(new Date().toLocaleTimeString(), ' :: ', 'pressCheckout :: ', 'waiting for checkout to be available');
    await page.waitForFunction(() => {
        const checkoutBtn = document.querySelector('button.order-now');
        return checkoutBtn && !checkoutBtn.disabled;
    })
    await page.type('#cvv', secrets.CVV);
    await page.click('button.order-now');
}

const isStockAvailable = async (page) => {
    console.info(new Date().toLocaleTimeString(), ' :: ', 'isStockAvailable :: ', 'waiting for stock information');
    await page.waitForFunction(() => {
        const outOfStock = document.querySelectorAll('[class^="modalContainer"]');
        const checkOut = document.querySelector('button.order-now');

        return (outOfStock
            && Array.from(outOfStock)
                .map(x => window.getComputedStyle(x).getPropertyValue('visibility'))
                .includes('visible'))
            || checkOut;
    });
    console.info(new Date().toLocaleTimeString(), ' :: ', 'isStockAvailable :: ', 'stock info loaded');
    try {
        return await page.$$eval('[class^="modalContainer"]', modal =>
            modal.map(modal => window.getComputedStyle(x).getPropertyValue('visibility'))
                .includes('visible'));
    } catch (exception) {
        // do nothing
    }
    try {
        return await page.$eval('button.order-now', checkout => true);
    } catch (exception) {
        // do nothing
    }
    return false;
}

const login = async (page) => {
    console.info(new Date().toLocaleTimeString(), ' :: ', 'login :: ', 'logging in');

    await page.click('[data-automation="sign-in-text"]');
    await page.waitForSelector('[data-automation="sign-in-email"]');
    await page.type('[data-automation="sign-in-email"]',
        secrets.EMAIL,
        {delay: 17});
    await page.type('[data-automation="sign-in-password"]',
        secrets.BESTBUY.PASSWORD,
        {delay: 13});
    await page.click('.signin-form-button');
    console.info(new Date().toLocaleTimeString(), ' :: ', 'login :: ', 'submitted');

    console.info(new Date().toLocaleTimeString(), ' :: ', 'login :: ', 'waiting for captcha...');
    await page.waitForFunction(() => {
        const greeting = document.querySelector('[data-automation="greeting-message"]');
        return greeting && greeting.innerHTML.includes('Hi,');
    });
    console.info(new Date().toLocaleTimeString(), ' :: ', 'login :: ', 'signed in');
}

const configs = {
    NOT_LOGGED_IN_LABEL: 'Account',
    STARTING_URL: 'https://www.bestbuy.ca/en-ca/basket',
    CHECKOUT_URL: 'https://www.bestbuy.ca/checkout/?qit=1#/en-ca/review'
}

module.exports = BestBuy;