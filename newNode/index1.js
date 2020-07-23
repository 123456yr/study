const http= require('http')
const querystring= require('querystring')

const server= http.createServer((req, res) =>{
    const method= req.method;
    const url= req.url;
    
})

server.listen(8000)
console.log('OK')