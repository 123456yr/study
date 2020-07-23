const http = require('http');
const slice= Array.prototype.slice;

class LikeExpress {
    constructor(){
        this.routes= {
            all: [],
            get: [],
            post: []
        }
    }

    register(path){
        const info= {}
        if(typeof path === 'string'){
            info.path = path;
            info.stack= slice.call(arguments, 1)
        }else{
            info.path ='/'
            info.stack= slice.call(arguments, 0)
        }
        return info;
    }

    use(){
        // apply 传入数组
        const info= this.register.apply(this, arguments)
        this.routes.all.push(info)
    }

    get(){
        const info= this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post(){
        const info= this.register.apply(this, arguments);
        this.routes.post.push(info)
    }

    listen(...args){
        const server= http.createServer(this.callback())
        server.listen(...args)
    }

    callback(req, res){
        // 处理res.json
        return (req, res) => {
            res.json= (data) =>{
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            let url= req.url;
            let method= req.method.toLowerCase()
            let stack = this.match(url, method)
            this.handle(req, res, stack)
        }
    }
    match(url, method){
        // 获得可执行的中间件数组
        let stack= []
        if(url == '/favicon.ico'){
            return stack
        }
        let curRoutes= []
        curRoutes= curRoutes.concat(this.routes.all, this.routes[method])
        console.log(curRoutes)
        curRoutes.forEach(item => {
            // 根据路由得到可执行的中间件
            if(url.indexOf(item.path) === 0){
                stack= stack.concat(item.stack)
            }
        })
        return stack;
    }

    handle(req, res, stack){
        const next = () => {
            let middleware= stack.shift()
            if(middleware){
                middleware(req, res, next)
            }
        }
        next()
    }
}

module.exports= LikeExpress