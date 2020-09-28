const cron = require('node-cron');

const deleteFile = require('./deleteFile')

const crawler = require('./crawler')

const task = cron.schedule('* 40 10 * * *', () => {
  console.log('tsak start -------->');
  deleteFile.deleteDirectory('apify_storage') //首先删除 相关文件夹
  crawler.crawler()
});

task.start()



