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
        // const currentCookies = await item.page.cookies();
        // console.log('newegg-api.js :: ', 'handleInStock :: ', 'adding to cart');
        // await axios({
        //     method: 'POST',
        //     url: 'https://www.newegg.ca/api/Add2Cart',
        //     headers:
        //         {
        //             'cache-control': 'no-cache',
        //             Connection: 'keep-alive',
        //             'Content-Length': '168',
        //             'Accept-Encoding': 'gzip, deflate',
        //             Host: 'www.newegg.ca',
        //             'Postman-Token': '74e1c536-1182-4ae3-8142-7b1669800231,837c3faa-71b9-483f-b0dd-bf477b2ef630',
        //             'Cache-Control': 'no-cache',
        //             cookie: 'NV%5FW57=CAN; NV%5FW62=en; s_fid=6A2E848D78EB5A00-0C3D9DDC9483EA23; NV%5FSPT=; NV%5FTOKEN=VM47j51UVJzWSByasaTLtQOQGfA%2fDV%2fDpePE0c5n%2fgBldcbptMfRd5zZchhEiEzFwQ6nDz%2biqNtKzLhdMr9%2fhilIPh4EkQC%2fhQ63ebv78CPmMO%2bfxUU4HESuNGp%2bJcbTHcDeX%2fUbxqB7FyG6hMXbOV8h6nVmpXCdP%2fNgmjBGtb%2fcKE31VbA3Iv5N42X45WE0OKQlUzAfLQaGvX2pG%2fJaYw%3d%3d; NV%5FS115=0nNMDJV3VOjhhOc68MAw6Q%253d%253d; NV%5FPRDLIST=#5%7B%22Sites%22%3A%7B%22CAN%22%3A%7B%22Values%22%3A%7B%22w47%22%3A%22N82E16814932342%252cN82E16800995329%22%7D%2C%22Exp%22%3A%221694390513%22%7D%7D%7D; NV%5FCUSTOMERLOGIN=#5%7b%22Sites%22%3a%7b%22CAN%22%3a%7b%22Values%22%3a%7b%22sj%22%3a%220%22%2c%22sb%22%3a%22t1PhQUYK2coYjIWhEp81DAImk1bx9rEUajgZB2vM8lx%252btIo%252bvQ8NWdb5FaR1moF3%22%2c%22sd%22%3a%22henrymzhao%2540gmail.com%22%2c%22sc%22%3a%2235053054%22%2c%22si%22%3a%22MU%2bHAN%2bZHAO%22%7d%2c%22Exp%22%3a%222554679141%22%7d%7d%7d; NV%5FOTHERINFO=#5%7b%22Sites%22%3a%7b%22CAN%22%3a%7b%22Values%22%3a%7b%22sb%22%3a%22t1PhQUYK2coYjIWhEp81DAImk1bx9rEUajgZB2vM8lx%252btIo%252bvQ8NWdb5FaR1moF3%22%2c%22sd%22%3a%22t1PhQUYK2coYjIWhEp81DAImk1bx9rEUajgZB2vM8lx%252btIo%252bvQ8NWdb5FaR1moF3%22%2c%22sc%22%3a%22URfKrMKmRi844tjB%252fhWROk2gZDS8%252fujn%22%2c%22si%22%3a%22MU%2bHAN%2bZHAO%22%2c%22se%22%3a%22d5IEeG9TR9cu%252fEqyqTYXzg%253d%253d%22%2c%22s115%22%3a%220nNMDJV3VOjhhOc68MAw6Q%253d%253d%22%2c%22sn%22%3a%22602566917215521220201214165942%22%7d%2c%22Exp%22%3a%222554679141%22%7d%7d%7d; NV%5FDVINFO=#5%7B%22Sites%22%3A%7B%22CAN%22%3A%7B%22Values%22%3A%7B%22w19%22%3A%22Y%22%7D%2C%22Exp%22%3A%221608188812%22%7D%7D%7D; AMCVS_1E15776A524450BC0A490D44%40AdobeOrg=1; s_cc=true; NV%5FCONFIGURATION=#5%7B%22Sites%22%3A%7B%22CAN%22%3A%7B%22Values%22%3A%7B%22wd%22%3A%220%22%2C%22w58%22%3A%22CAD%22%2C%22w57%22%3A%22CAN%22%7D%2C%22Exp%22%3A86400000000%7D%7D%7D; s_sess=%20s_cpc%3D0%3B%20s_stv%3Dmx%2520master%25203%3B%20s_evar17%3Dpage%2520viewed%253A1%252Csort%2520by%253Afeatured%2520items%252Cview%2520count%253A36%3B; INGRESSCOOKIE=1608111090.579.25344.7737; NVTC=79960456.0002.m6soo1kty.1586661849.1608111090.1608112356.11; NID=2k4N8N702k5j5j1z0N0bcd2287edb43ebf6cb52f89d06237061; NSC_mc-xxx.ofxfhh.db-ttm=30dfa3dbc9c2d5e4086acf799fc554ebe541c7b6afd7c16a010397cb2fa66f99014435f5; NV_NVTCTIMESTAMP=1608112683; AMCV_1E15776A524450BC0A490D44%40AdobeOrg=870038026%7CMCIDTS%7C18612%7CMCMID%7C90989024051510704818648557621090583539%7CMCAID%7CNONE%7CMCOPTOUT-1608119951s%7CNONE%7CvVersion%7C5.0.0; s_pers=%20s_ns_persist%3DNatural%257CGoogle%7C1610589779630%3B%20s_ev19%3D%255B%255B%2527natural%25257Cgoogle%2527%252C%25271607997779643%2527%255D%255D%7C1765764179643%3B%20productnum%3D5%7C1610700686396%3B%20gpvch%3Dproduct%7C1608114561681%3B%20s_vs%3D1%7C1608114561691%3B%20gpv%3Dproduct%2520details%7C1608114561695%3B%20s_nr%3D1608112761697-Repeat%7C1639648761697%3B; s_sq=%5B%5BB%5D%5D,NV%5FW57=CAN; NV%5FW62=en; s_fid=6A2E848D78EB5A00-0C3D9DDC9483EA23; NV%5FSPT=; NV%5FTOKEN=VM47j51UVJzWSByasaTLtQOQGfA%2fDV%2fDpePE0c5n%2fgBldcbptMfRd5zZchhEiEzFwQ6nDz%2biqNtKzLhdMr9%2fhilIPh4EkQC%2fhQ63ebv78CPmMO%2bfxUU4HESuNGp%2bJcbTHcDeX%2fUbxqB7FyG6hMXbOV8h6nVmpXCdP%2fNgmjBGtb%2fcKE31VbA3Iv5N42X45WE0OKQlUzAfLQaGvX2pG%2fJaYw%3d%3d; NV%5FS115=0nNMDJV3VOjhhOc68MAw6Q%253d%253d; NV%5FPRDLIST=#5%7B%22Sites%22%3A%7B%22CAN%22%3A%7B%22Values%22%3A%7B%22w47%22%3A%22N82E16814932342%252cN82E16800995329%22%7D%2C%22Exp%22%3A%221694390513%22%7D%7D%7D; NV%5FCUSTOMERLOGIN=#5%7b%22Sites%22%3a%7b%22CAN%22%3a%7b%22Values%22%3a%7b%22sj%22%3a%220%22%2c%22sb%22%3a%22t1PhQUYK2coYjIWhEp81DAImk1bx9rEUajgZB2vM8lx%252btIo%252bvQ8NWdb5FaR1moF3%22%2c%22sd%22%3a%22henrymzhao%2540gmail.com%22%2c%22sc%22%3a%2235053054%22%2c%22si%22%3a%22MU%2bHAN%2bZHAO%22%7d%2c%22Exp%22%3a%222554679141%22%7d%7d%7d; NV%5FOTHERINFO=#5%7b%22Sites%22%3a%7b%22CAN%22%3a%7b%22Values%22%3a%7b%22sb%22%3a%22t1PhQUYK2coYjIWhEp81DAImk1bx9rEUajgZB2vM8lx%252btIo%252bvQ8NWdb5FaR1moF3%22%2c%22sd%22%3a%22t1PhQUYK2coYjIWhEp81DAImk1bx9rEUajgZB2vM8lx%252btIo%252bvQ8NWdb5FaR1moF3%22%2c%22sc%22%3a%22URfKrMKmRi844tjB%252fhWROk2gZDS8%252fujn%22%2c%22si%22%3a%22MU%2bHAN%2bZHAO%22%2c%22se%22%3a%22d5IEeG9TR9cu%252fEqyqTYXzg%253d%253d%22%2c%22s115%22%3a%220nNMDJV3VOjhhOc68MAw6Q%253d%253d%22%2c%22sn%22%3a%22602566917215521220201214165942%22%7d%2c%22Exp%22%3a%222554679141%22%7d%7d%7d; NV%5FDVINFO=#5%7B%22Sites%22%3A%7B%22CAN%22%3A%7B%22Values%22%3A%7B%22w19%22%3A%22Y%22%7D%2C%22Exp%22%3A%221608188812%22%7D%7D%7D; AMCVS_1E15776A524450BC0A490D44%40AdobeOrg=1; s_cc=true; NV%5FCONFIGURATION=#5%7B%22Sites%22%3A%7B%22CAN%22%3A%7B%22Values%22%3A%7B%22wd%22%3A%220%22%2C%22w58%22%3A%22CAD%22%2C%22w57%22%3A%22CAN%22%7D%2C%22Exp%22%3A86400000000%7D%7D%7D; s_sess=%20s_cpc%3D0%3B%20s_stv%3Dmx%2520master%25203%3B%20s_evar17%3Dpage%2520viewed%253A1%252Csort%2520by%253Afeatured%2520items%252Cview%2520count%253A36%3B; INGRESSCOOKIE=1608111090.579.25344.7737; NVTC=79960456.0002.m6soo1kty.1586661849.1608111090.1608112356.11; NID=2k4N8N702k5j5j1z0N0bcd2287edb43ebf6cb52f89d06237061; NSC_mc-xxx.ofxfhh.db-ttm=30dfa3dbc9c2d5e4086acf799fc554ebe541c7b6afd7c16a010397cb2fa66f99014435f5; NV_NVTCTIMESTAMP=1608112683; AMCV_1E15776A524450BC0A490D44%40AdobeOrg=870038026%7CMCIDTS%7C18612%7CMCMID%7C90989024051510704818648557621090583539%7CMCAID%7CNONE%7CMCOPTOUT-1608119951s%7CNONE%7CvVersion%7C5.0.0; s_pers=%20s_ns_persist%3DNatural%257CGoogle%7C1610589779630%3B%20s_ev19%3D%255B%255B%2527natural%25257Cgoogle%2527%252C%25271607997779643%2527%255D%255D%7C1765764179643%3B%20productnum%3D5%7C1610700686396%3B%20gpvch%3Dproduct%7C1608114561681%3B%20s_vs%3D1%7C1608114561691%3B%20gpv%3Dproduct%2520details%7C1608114561695%3B%20s_nr%3D1608112761697-Repeat%7C1639648761697%3B; s_sq=%5B%5BB%5D%5D; NVTC=79960456.0002.c7cl7kv9s.1608112671.1608112671.1608112671.1; NID=0N9T0N359T2k6A9T5j; INGRESSCOOKIE=1608112672.416.27070.380892; NSC_mc-xxx.ofxfhh.db-ttm=30dfa3dbc9c2d5e4086acf799fc554ebe541c7b6afd7c16a010397cb2fa66f99014435f5; NV_NVTCTIMESTAMP=1608112935',
        //             'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
        //             referer: 'https://www.newegg.ca/logitech-910-005647/p/N82E16826197350?Description=mx%20master%203&cm_re=mx_master%203-_-26-197-350-_-Product',
        //             'sec-fetch-dest': 'empty',
        //             'sec-fetch-mode': 'cors',
        //             'sec-fetch-site': 'same-origin',
        //             origin: 'https://www.newegg.ca',
        //             'content-type': 'application/json',
        //             'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        //             'sec-ch-ua-mobile': '?0',
        //             dnt: '1',
        //             accept: 'application/json, text/plain, */*',
        //             'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
        //             authority: 'www.newegg.ca'
        //         },
        //     body: '{"ItemList":[{"ItemGroup":"Single","ItemNumber":"24-475-056","Quantity":1,"OptionalInfos":null,"SaleType":"Sales"}],"CustomerNumber":"URfKrMKmRi844tjB/hWROk2gZDS8/ujn"}'
        // }).catch(e => {
        //     console.log('newegg-api.js :: ', 'error :: ', e);
        //
        // })
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