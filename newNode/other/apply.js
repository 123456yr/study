class LikeExpress{
    constructor(){
        this.routes= {

        }
    }
    register(path){
        // 拿到第一个参数
        console.log(path)
        console.log(arguments)
    }
    
    use(){
        // apply 传一个数组
        this.register.apply(this, arguments)
    }
}

const app=new LikeExpress()
app.use('/uiiu',() => {
    
})