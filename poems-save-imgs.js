const fs = require('fs')
const axios = require('axios')
const Poems = require('./model/poems')

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
async function downloadImage(imageSrc, fileName) {
    let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
    }
    await axios({
        method: 'get',
        url: imageSrc,
        responseType: 'stream',
        headers
    }).then(function (response) {
        response.data.pipe(fs.createWriteStream(`./imgs/${fileName}.jpg`))
    })
}

async function poemsSaveImgs(params) {

    await Poems.find({ p_img_url: 'https://www.shicimingju.com/pics/600/600/item/35180.jpg' }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        docs.map(v => {
            mkdirSaveFolder()
            downloadImage(v.p_img_url, '35180')
        })
    });
}

poemsSaveImgs()