const express= require('express')
const router= express.Router()
const {login} = require('../constroller/user')
const { SuccessModel , ErrorModel} = require('../returnMsg/returnMsg');


router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    let result= login(username, password)
    return result.then(data => {
        if(data && data.username){
            req.session.username= data.username;
            req.session.realname= data.realname;
            res.json(new SuccessModel(data, '登陆成功')) 
            return;
        }
        res.json(new ErrorModel('登陆失败')) 
    })
})

router.get('/login-test', (req, res ,next) => {
    if(req.session.username){
        res.json({
            errno: 0,
            msg: '登陆成功'
        })
        return

    }
    res.json({
        errno: -1,
        msg: '登陆失败'
    })
})

router.get('/session-test', (req, res, next) => {
    const session= req.session;
    if(session.viewNum == null){
        session.viewNum = 0
    }
    session.viewNum ++
    res.json({
        data: session.viewNum
    })
})


module.exports= router