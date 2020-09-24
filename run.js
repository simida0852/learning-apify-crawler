const cron = require('node-cron');

const crawler = require('./crawler')

const task = cron.schedule('* 30 18 * * *', () => {
  console.log('tsak start -------->');
  crawler.crawler()
});

task.start()

