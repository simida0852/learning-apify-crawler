const puppeteer = require('puppeteer');
const PaintingPup = require('./model/paintingPup')

const autoScroll = async (page) => {
    await getFieldAndInsert(page)
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0
            let distance = 300
            let timer = setInterval(() => {
                console.log('开始 滚动 ！！！');
                let scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 1500)
        })
    })
}

const getFieldAndInsert = async (page) => {
    console.log('调用了 ？？？');
    const res = await page.$$eval('div#app-container div#imglist ul.imgList-ul li.image-element-class', $posts => {
        const scrapedData = [];
        $posts.forEach($post => {
            // * 个别字段可能没有值 所以使用了容错的写法
            scrapedData.push({
                title: $post.querySelector('div.imagetitle') && $post.querySelector('div.imagetitle').innerText,
                date: $post.querySelector('div.imageTime') && $post.querySelector('div.imageTime').innerText,
                imgSrc: $post.querySelector('div.imaagepartli img.bigimg') && $post.querySelector('div.imaagepartli img.bigimg').src,
                authorName: $post.querySelector('div.imageuser > span.user-name > a') && $post.querySelector('div.imageuser > span.user-name > a').innerText,
                authorImg: $post.querySelector('div.imageuser img.imageuserimg') && $post.querySelector('div.imageuser img.imageuserimg').src,
            });
        });
        return scrapedData;
    });
    // Insert database
    PaintingPup.insertMany(res.map(v => v), function (err, docs) {
        if (err) {
            console.log('创建失败')
        } else {
            console.log('创建成功')
        }
    })
}

const main = async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 1000, devtools: true });
    const page = await browser.newPage();
    await page.goto('https://www.allhistory.com/painting');
    await autoScroll(page)

    // await browser.close();
}

main()