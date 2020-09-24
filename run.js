const cron = require('node-cron');

const crawler = require('./crawler')

const task = cron.schedule('* 2 * * * *', () => {
  crawler.crawler()
});

task.start()

