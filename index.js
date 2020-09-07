const Apify = require('apify');



Apify.main(async () => {


    // Create a RequestQueue
    const requestQueue = await Apify.openRequestQueue();
    // Define the starting URL
    await requestQueue.addRequest({ url: 'http://www.gansudaily.com.cn/' });


    // Function called for each URL
    const handlePageFunction = async ({ request, response, body, contentType, $ }) => {

        // Sleep 1.5 seconds
        await Apify.utils.sleep(1500);

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

        const dataset = await Apify.openDataset('GsNews');

        await dataset.pushData({
            url: request.url,
            title,
            content: obj
        });
    };



    // Set up the crawler, passing a single options object as an argument.
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction,
        forceResponseEncoding: 'GB2312',  // * 强制转换编码
    });
    await crawler.run();

});

