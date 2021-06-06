const puppeteer = require('puppeteer');
const Poems = require('./model/poems')


const getFieldAndInsert = async (page) => {
    const res = await page.$$eval('div#main_left .shici_card', $posts => {
        const scrapedData = [];
        $posts.forEach($post => {
            // * 个别字段可能没有值 所以使用了容错的写法
            scrapedData.push({
                p_index: $post.querySelector('div.list_num_info > span').innerText,
                p_author: $post.querySelector('div.list_num_info > a').innerText,
                p_dynasty: $post.querySelector('div.list_num_info').innerText.match(/\[.\]/mg) && $post.querySelector('div.list_num_info').innerText.match(/\[.\]/mg)[0],
                p_name: $post.querySelector('div.shici_list_main h3 > a').innerText,
                p_content: $post.querySelector('div.shici_list_main div.shici_content').textContent.replace(/^\s+|\s+$/gm, '').replace(/[\n\r]/g, '').replace(/展开全文/, '').replace(/收起/, '').trim(),
                p_img_url: $post.querySelector('div.shici_list_pic > a img') && $post.querySelector('div.shici_list_pic > a img').src,
            });
        });
        return scrapedData;
    })

    // 入库
    Poems.insertMany(res.map(v => v), function (err, docs) {
        if (err) {
            console.log('创建失败')
        } else {
            console.log('创建成功')
        }
    })
}



let arr = Array.from({ length: 100 }, (v, i) => i + 1)

async function sleep() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, 3000)
    })
}

(async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 1000, devtools: true });
    const page = await browser.newPage();
    for (let i in arr) {
        console.log(arr[i], i);
        await sleep();
        await page.goto(`https://www.shicimingju.com/paiming?p=${arr[i]}`);
        await getFieldAndInsert(page)
    }
})()
