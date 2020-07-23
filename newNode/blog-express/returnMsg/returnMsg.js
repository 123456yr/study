
class ReturnMsg{
    constructor(data, msg){
        if(typeof data === 'string'){
            this.msg= data
            data= null
            msg= null
        }
        if(data){
            this.data= data;
        }
        if(msg){
            this.msg= msg
        }
        
    }
    
}
class SuccessModel extends ReturnMsg{
    constructor(data, msg){
        super(data, msg)
        this.errno= 0;
    }
}

class ErrorModel extends ReturnMsg{
    constructor(data, msg){
        super(data, msg)
        this.errno= -1
    }
}
module.exports= {
    SuccessModel,
    ErrorModel
}