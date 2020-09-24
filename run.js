const cron = require('node-cron');

const task = cron.schedule('* * * * * *', () => {
  console.log('start ');
});

task.start()

