// process.stdin.pipe(process.stdout)

// const http=require('http')
// const server = http.createServer((req, res) => {
//     if(req.method == 'post'){
//         req.pipe(res)
//     }

// })
// server.listener(8000)

// 复制文件
const fs= require('fs')
const path= require('path')
const fileName1= path.resolve(__dirname, 'data.txt');
const fileName2= path.resolve(__dirname, 'data-copy.txt');
// 创建读的stream对象
const readStream= fs.createReadStream(fileName1)
// 创建写的stream对象
const writeStream= fs.createWriteStream(fileName2)

readStream.pipe(writeStream)
readStream.on('end', () => {
    console.log('copy done')
})