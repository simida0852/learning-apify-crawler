const Apify = require('apify');

const config = require('./config')
const deleteFile = require('./deleteFile')
const Painting = require('./model/painting')

const fetch = require("node-fetch");
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

let totalPages = 1

const fetchFun = async (page = 1) => {
    await Apify.utils.sleep(Math.floor(Math.random() * 8000));

    const res = await fetch("https://www.allhistory.com/api/painting/homepage/list", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:87.0) Gecko/20100101 Firefox/87.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Content-Type": "application/json;charset=UTF-8",
            "ax": "7c58a5419721971f615;c67fc0757eb5329f4d879aebe9f38da85649d2b6;ecfe078962;04fd1f8816664ec30e3bc4d113d9c83ff4695969;1619512595546;2;2630c5419721971d3ae;f16aeb2a9b346973ed95e74d4fd6dca7363812fef1dcb17bef7a744314a8321968926c0b39e73b97",
            "_sid": "\\}Ql]WP8QWYk]mP5\\mn6RGQkQW\\4PWknRJX}Q5MmQGj@",
            "Cache-Control": "max-age=0"
        },
        "referrer": "https://www.allhistory.com/painting",
        "body": "{\"language\":\"cn\",\"page\":" + page + ",\"size\":40}",
        "method": "POST",
        "mode": "cors",
        'responseType': 'json'
    })

    const dataJson = await res.json()
    totalPages = dataJson.data.totalPages
    const data = dataJson.data.list.map(v => ({
        id: v.id,
        title: v.title,
        desc: v.desc,
        imageUrl: v.imageUrl,
        painter: v.painter,
        iconUrl: v.iconUrl,
        width: v.width,
        height: v.height,
    }))
    // Insert database 
    Painting.insertMany(data, function (err, docs) {
        if (err) {
            console.log('创建失败')
        } else {
            console.log('创建成功')
        }
    })

    // find data 
    await Painting.find(function (err, ret) {
        if (err) {
            console.log('查询失败')
        } else {
            console.log('查询成功')
        }
    })
}

const crawlerMainFun = async () => {
    if (totalPages === 1) {
        await fetchFun()
    }
    if (totalPages > 1) {
        for (let index = 2; index < totalPages; index++) {
            await fetchFun(index)
        }
    }
}


Apify.main(async () => {
    await crawlerMainFun()
});