const express= require('express')
const router= express.Router()
const {getList, getDetail, newBlog, updateBlog, delBlog} = require('../constroller/blog')
const { SuccessModel , ErrorModel} = require('../returnMsg/returnMsg')
const loginCheck= require('../middleware/loginCheck')

router.get('/list', (req, res, next) => {
    let author= req.query.author || ''
    const keyword= req.query.keyword || ''
    if(req.query.isadmin){
        // 管理员界面
        if(req.session.username == null){
            // 未登录
            res.json(
                new ErrorModel('登陆失败')
            )
            return
        }
        // 强制查询自己的博客
        author= req.session.username
    }

    const result = getList(author, keyword)
    return result.then(listdata => {
        res.json(
            new SuccessModel(listdata, '成功了')
        ) 
    })
})

router.get('/detail', (req, res, next) => {
    let result= getDetail(req.query.id)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
})

router.post('/new',loginCheck, (req, res, next) => {
    req.body.author= req.session.username
    let result= newBlog(req.body)
    return result.then(data => {
        res.json(new SuccessModel(data, '成功了')) 
    })
})

router.post('/update', loginCheck, (req, res, next) => {
    let result= updateBlog(req.query.id, req.body)
    return result.then(data => {
        if(data){
            res.json(new SuccessModel(data))
        }else{
            res.json(new ErrorModel('失败了'))
        }
    })
})

router.post('/del', loginCheck, (req, res, next) => {
    const author= req.session.username
    let result= delBlog(req.query.id, author)
    return result.then(data => {
        if(data){
            res.json(new SuccessModel(data))
        }else{
            res.json(new ErrorModel('失败了'))
        }
    })
})

module.exports= router