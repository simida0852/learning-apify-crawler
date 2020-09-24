const cron = require('node-cron');

const crawler = require('./crawler')

const task = cron.schedule('* 2 * * * *', () => {
  console.log('tsak start ');
  crawler.crawler()
});

task.start()

