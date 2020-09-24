const cron = require('node-cron');

const crawler = require('./crawler')

const task = cron.schedule('* 30 10 * * *', () => {
  crawler.crawler()
});

task.start()

