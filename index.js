const Apify = require('apify');

const News = require('./model/news')

const config = require('./config')

Apify.main(async () => {
    // Create a RequestQueue
    const requestQueue = await Apify.openRequestQueue();
    // Define the starting URL
    await requestQueue.addRequest({ url: config.url });

    // Function called for each URL
    const handlePageFunction = async ({ request, response, body, contentType, $ }) => {

        // Sleep random seconds
        await Apify.utils.sleep(Math.floor(Math.random() * 5000));

        const title = $('title').text();

        console.log(`请求链接为："${request.url}" 网站地址为: ${title}.`);

        // Add all links from page to RequestQueue
        await Apify.utils.enqueueLinks({
            $,
            requestQueue,
            selector: '.floatl ul li a',
            baseUrl: request.loadedUrl,
        });

        let obj = {}

        $('div.artical div.a-container').each((index, ele) => {
            return obj = $(ele).text()
        })

        const data = {
            url: request.url,
            title: title,
            content: obj
        }

        // Insert database 
        News.create(data, function (err, docs) {
            if (err) {
                console.log('创建失败')
            } else {
                console.log('创建成功')
            }
        })

        // find data 
        News.find(function (err, ret) {
            if (err) {
                console.log('查询失败')
            } else {
                console.log('查询成功')
            }
        })
    };

    // Set up the crawler, passing a single options object as an argument.
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction,
        forceResponseEncoding: 'GB2312',  // * 强制转换编码
    });
    await crawler.run();

});

