const { exec } = require('../db/mysql')
const xss = require('xss')

const getList= (author, keyword) => {
    // let sql= `select * from blogs`
    let sql= `select * from blogs where 1=1 `
    if(author){
        sql += `and author='${author}' `
    }
    if(keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += 'order by createtime desc;'
    // 执行sql语句，返回promise
    return exec(sql)
}

const getDetail =(id) =>{
   const sql = `select * from blogs where id='${id}'`
   return exec(sql).then(rows => {
       console.log(rows)
       return rows[0]
   })
}
// blogData是一个博客对象
const newBlog= (blogData ={}) => {
    // const {title, content, author}= blogData
    const title= xss(blogData.title)
    const content= xss(blogData.content)
    const author= blogData.author
    const createtime= Date.now()
    const sql= `
        insert into blogs (title, content, author, createtime) values ('${title}', '${content}', '${author}', ${createtime});
    `
    return exec(sql).then(res => {
        console.log(res)
        return res.insertId
    })
}
const updateBlog= (id, blogData ={}) => {
    const {title, content}= blogData;
    const sql= `
        update blogs set title='${title}',content='${content}' where id=${id}
    `
    return exec(sql).then(res => {
        console.log(res)
        if(res.affectedRows > 0){
            return true
        }
        return false;
    })
    
}

const delBlog = (id, author) => {
    const sql= `delete from blogs where id=${id} and author='${author}';`
    return exec(sql).then(res => {
        if(res.affectedRows > 0){
            return true
        }
        return false
    })
}

module.exports= {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}