class SiteBase {
    constructor(siteUrl) {
        this._siteUrl = siteUrl;
        this._boughtStatus = false;
        this.isInitted = false;
    }

    async entry() {

    }

    get boughtStatus() {
        return this._boughtStatus;
    }

    set boughtStatus(val) {
        return this._boughtStatus = val;
    }

    get page() {
        return this._pupPage;
    }

    set page(page) {
        this._pupPage = page;
    }

    get siteUrl() {
        return this._siteUrl;
    }
}

module.exports = {
    SiteBase
}