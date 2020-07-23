const express= require('express')
// 创建服务对象
const app= express()

app.use((req, res, next) => {
    console.log('请求开始...')
    next()
})

app.use((req, res, next) => {
    req.cookie= new Date().getTime()
    next()
})

app.use((req, res, next) => {
    setTimeout(() => {
        req.body= {
            username: '张三'
        }
        next()
    })
})

app.use('/api', (req, res, next) => {
    console.log('/api')
    next()
})

app.get('/api', (req, res, next) => {
    console.log('get   /api') // 没有执行
    next()
})
app.post('/api', (req, res, next) => {
    console.log('post  /api')  // 没有执行
    next()
})
app.get('/api/getCookie', (req, res, next) => {
    res.json({
        cookie: req.cookie
    })
})

app.post('/api/user/login', (req, res, next) => {
    res.json({
        data: req.body
    })
})

app.use((req, res, next) => {
    res.json({
        errno: -1,
        data: '404 not found'
    })
})

app.listen('4000', ()=> {
    console.log('访问4000 端口')
})