const querystring= require('querystring')
const handleBlog= require('./src/router/handleBlog')
const handleUser= require('./src/router/handleUser')
const {get, set} = require('./src/db/redis')
const { resolve } = require('path')
const { EDESTADDRREQ } = require('constants')
const { access } = require('./src/utils/log')
const getCookieExpires= () => {
    const d= new Date()
    d.setTime(d.getTime() + (24 * 60 *60 * 1000))
    return d.toGMTString()
}
// 只有在刚开始npm run dev 的时候会执行，在调用接口的时候不会重新执行
// 全局变量 session 数据，通过userid保存每一个用户的信息, 有则已经登录，没有就是没有登陆
// const SESSION_DATA= {}

const getPostData= (req) => {
    // get 和 post请求统一处理
    return new Promise((resolve, reject) => {
        if(req.method !== 'POST'){
            resolve({})
            return
        }
        if(req.headers['content-type'] !== 'application/json'){
            resolve({})
            return;
        }
        let postData =''
        req.on('data', chunk => {
            postData += chunk;
        })
        req.on('end', ()=> {
            if(!postData){
                resolve({})
                return;
            }
            resolve(JSON.parse(postData))
        })
    })
}

let handleResReq= (req, res) => {
    // 设置返回格式为json
    res.setHeader('Content-type', 'application/json');
    // 写日志
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']}`)
    const url= req.url
    req.path= url.split('?')[0]
    req.query= querystring.parse(url.split('?')[1])
    // 解析cookie
    req.cookie= {}
    const cookieStr= req.headers.cookie // k1=v1;k2=v2
    if(cookieStr){
        cookieStr.split(';').forEach(item => {
            if(!item){return}
            let arr= item.split('=')
            let key= arr[0].trim()
            let val= arr[1].trim()
            req.cookie[key]= val;
        })
    }
    

    // 解析 session
    // let userId= req.cookie.userid;
    // let needSetCookie= false;

    // if(userId){
    //     if(!SESSION_DATA[userId]){
    //         SESSION_DATA[userId]= {}
    //     }
    // }else{
    //     needSetCookie= true;
    //     userId= `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session= SESSION_DATA[userId]
    
    // 使用redis解析session 第一次登录没有userId,后台设置userId,并将userID作为键值为{}存到redis中，设置req.sessionId=userId,取sessionId对应redis中的值为{}，设置给req.session;到login路由，set(req.sessionId, res.session)
    // 登陆login-test,userid存在，取出redis中存放的对应userID的session值，判断session中的username是否存在，存在则已经登录，不存在则尚未登录
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }

        // 处理 post data
        return getPostData(req)
    }).then(postData => {
        req.body= postData;  // 将post data赋值给body
        
        const blogResult= handleBlog(req, res)
        if(blogResult){
            blogResult.then(blogData => {
                if(blogData){
                    // 设置cookie
                    
                    if(needSetCookie){
                        
                        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                    }
                    res.end(JSON.stringify(blogData))
                    return;
                }
            })
            return;
        }
        
        const user= handleUser(req, res)
        if(user){
            user.then(userData => {
                if(userData){
                    // 设置cookie
                    if(needSetCookie){
                        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                    }
                    res.end(JSON.stringify(userData))
                    return;
                }
            })
            return;
        }
        // 未命中路由  返回404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 not found\n")
        res.end()
    })
    
}

module.exports= handleResReq