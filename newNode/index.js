const http= require('http')
const querystring= require('querystring')

// const server= http.createServer((req, res)=>{
//     console.log(req.method)
//     const url= req.url;
//     // 将author=zhangsan&age=2 转换成 {autor: zhangsan, age: 2}
//     req.query= querystring.parse(url.split('?')[1])
//     console.log(req.query)
//     res.end(JSON.stringify(req.query))
// })

const server= http.createServer((req, res) => {
    if(req.method === 'POST')
    console.log('req content-type', req.headers['content-type']);
    let postData= ''
    // 数据来了就触发data事件
    req.on('data', chunk => {
        postData += chunk.toString()
    })
    // 接受数据结束，就触发end事件
    req.on('end', () => {
        console.log(postData)
        res.end('Hello world')
    })
})

server.listen(8000, () => {
    console.log('listening on 3000 port')
})