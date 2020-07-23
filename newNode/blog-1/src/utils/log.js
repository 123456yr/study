const fs= require('fs')
const path= require('path')

function writeLog(content){
    createWriteStream('access.log').write(content + '\n')
}

function createWriteStream(fileName){
    const fullFileName= path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream= fs.createWriteStream(fullFileName, {
        flags: 'a'  // 以什么模式打开文件
    })
    return writeStream
}

function access(content){
    writeLog(content)
}

module.exports= {
    access
}