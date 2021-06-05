const mongoose = require('mongoose')

const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/news')

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

const paintingPupSchema = new Schema({
    title: String,
    date: String,
    imgSrc: String,
    authorName: String,
    authorImg: String,
})


module.exports = mongoose.model('PaintingPup', paintingPupSchema);

