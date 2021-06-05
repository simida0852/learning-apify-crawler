const puppeteer = require('puppeteer');
const Poems = require('./model/poems')
const fs = require('fs')
const axios = require('axios')
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



// let arr = Array.from({ length: 100 }, (v, i) => i + 1)

// async function sleep() {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve()
//         }, 3000)
//     })
// }

// (async () => {
//     const browser = await puppeteer.launch({ headless: false, slowMo: 1000, devtools: true });
//     const page = await browser.newPage();
//     for (let i in arr) {
//         console.log(arr[i], i);
//         await sleep();
//         await page.goto(`https://www.shicimingju.com/paiming?p=${arr[i]}`);
//         await getFieldAndInsert(page)
//     }
// })()


// 新建保存图片的文件夹
function mkdirSaveFolder() {
    if (!fs.existsSync('./imgs')) {
        fs.mkdirSync('./imgs')
        console.log(`主文件夹已生成：./imgs`)
    } else {
        console.log(`主文件夹已存在：./imgs`)
    }
}

// 下载图片到本地
async function downloadImage(album, imageSrc, fileName) {
    let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
    }
    await axios({
        method: 'get',
        url: 'https://www.shicimingju.com/pics/600/600/item/25739.jpg',
        responseType: 'stream',
        headers
    }).then(function (response) {
        response.data.pipe(fs.createWriteStream('qjj.png'))
    })
}

downloadImage()