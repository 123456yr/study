const {getList, getDetail, newBlog, updateBlog, delBlog} = require('../constroller/blog')
const { SuccessModel , ErrorModel} = require('../returnMsg/returnMsg')

const loginCheck= (req) => {
    if(!req.session.username){
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}

const handleBlog= (req, res) => {
    const method= req.method
    const id= req.query.id
    if(method === 'GET' && req.path === '/api/blog/list'){
        let author= req.query.author || ''
        const keyword= req.query.keyword || ''

        if(req.query.isadmin){
            // 管理员界面
            const loginCheckResult= loginCheck(req)
            if(loginCheckResult){
                // 未登录
                return loginCheckResult
            }
            // 强制查询自己的博客
            author= req.session.username
        }

        const result = getList(author, keyword)
        return result.then(listdata => {
            return new SuccessModel(listdata, '成功了')
        })
    }
    if(method === 'GET' && req.path === '/api/blog/detail'){
        // const id= req.query.id
        // const data= getDetail(id)
        // return new SuccessModel(data, '成功了')
        const result= getDetail(id)
        return result.then(data => {
            return new SuccessModel(data, '成功了')
        })
    }
    if(method === 'POST' && req.path === '/api/blog/new'){
        // let result= newBlog(req.body)
        // return new SuccessModel(result, '成功了')
        // 判断是否登录
        let check= loginCheck(req)
        if(check){
            return check
        }
        req.body.author= req.session.username
        let result= newBlog(req.body)
        return result.then(res => {
            return new SuccessModel(res, '成功了')
        })
    }
    if(method === 'POST' && req.path === '/api/blog/update'){
        let check= loginCheck(req)
        if(check){
            return check
        }

        const postData= req.body
        let result= updateBlog(id, postData)
        return result.then(res => {
            if(res){
                return new SuccessModel(res)
            }else{
                return new ErrorModel()
            }
        })
        
    }
    if(method === 'POST' && req.path === '/api/blog/delete'){
        let check= loginCheck(req)
        console.log('check id', check)
        if(check){
            return check
        }

        const author= req.session.username
        let result= delBlog(id, author)
        return result.then(res => {
            if(res){
                return new SuccessModel(res)
            }else{
                return new ErrorModel()
            }
        })
    }
}

module.exports= handleBlog