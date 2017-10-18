'use strict'
const koa=require('koa')
const logger=require('koa-logger')
const session=require('koa-session')
const bodyParser=require('koa-bodyparser')
const app=koa()

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const db = 'mongodb://localhost/myApp'

mongoose.Promise = require('bluebird')
mongoose.connect(db)


const modelsPath = path.join(__dirname,'/app/models')
const walk = function(modelsPath){
  fs.readdirSync(modelsPath)
    .forEach((file)=>{
      const filePath = path.join(modelsPath, '/' +file);
      const stat = fs.statSync(filePath);
      if(stat.isFile()){
        if(/(.*)\.(js)/.test(file)){
          require(filePath)
        }else if(stat.isDirectory()){
          walk(filePath)
        }
      }
    })
}
walk(modelsPath)
const router=require('./config/router')()

app.keys=['summer16017858'];
app.use(logger())
app.use(session(app))
app.use(bodyParser())



app.use(router.routes())
  .use(router.allowedMethods())
// app.use(function *(next){
//   console.log(this.href)
//   console.log(this.method)
//   this.body={
//     sucess:true
//   }
//   yield next;
// })
app.listen(8888,() => {
  console.log('listening port 8888')
})
