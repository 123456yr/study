const { ErrorModel } = require('../returnMsg/returnMsg');

module.exports= (req, res, next) => {
    if(req.session.username){
        next()
        return
    }
    res.json(
        new ErrorModel('登陆失败')
    )
}