// 建立服务器连接
let http= require('http')
let handleResReq= require('../app.js')
const PORT= 8000
let server= http.createServer(handleResReq)
server.listen(PORT)