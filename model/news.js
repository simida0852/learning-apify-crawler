const mongoose = require('mongoose')

const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/gsNews')

//监听连接状态(已连接)
mongoose.connection.on('connected', () => {
    console.log('---数据库成功了------')
})
//失败
mongoose.connection.on('err', () => {
    console.log('---数据库失败了-------')
})

//断开连接
mongoose.connection.on('disconnected', () => {
    console.log('数据库断开连接了!')
})


const newsSchema = new Schema({
    url: String,
    title: String,
    content: String
})


module.exports = mongoose.model('News', newsSchema);

