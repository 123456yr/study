const {login} = require('../constroller/user')
const { SuccessModel , ErrorModel} = require('../returnMsg/returnMsg');
const { set } = require('../db/redis');

// const getCookieExpires= () => {
//     const d= new Date()
//     d.setTime(d.getTime() + (24 * 60 *60 * 1000))
//     return d.toGMTString()
// }

const handleUser= (req, res) => {
    const method= req.method

    if(method === 'POST' && req.path === '/api/user/login'){
        const {username, password} = req.body;
        // const {username, password} = req.query;

        let result= login(username, password)
        return result.then(data => {
            if(data && data.username){
                // 设置cookie
                // res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`) // httpOnly只能后台改不能前端改
                // 设置session  会被保存到全局变量SESSION_DATA中
                req.session.username= data.username;
                req.session.realname= data.realname;
                set(req.sessionId, req.session);
                return new SuccessModel(data, '登陆成功')
            }
            return new ErrorModel('登陆失败')
        })
    }
    // 登录验证的测试
    if(method === 'GET' && req.path === '/api/user/login-test'){
        if(req.session.username){
            return Promise.resolve(new SuccessModel({
                session: req.session
            }))
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}

module.exports= handleUser