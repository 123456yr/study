const mysql= require('mysql')

// 创建连接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456yr',
    port: '3306',
    database: 'myblog'
})

// 开始连接
con.connect()
// 执行sql语句
const sql= "update users set realname='李四2' where username='lisi'"
con.query(sql, (err, result) => {
    if(err) {
        console.error(err)
    }else{
        console.log(result)
    }
})
// 关闭连接
con.end()