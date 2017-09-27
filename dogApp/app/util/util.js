const queryString = require('query-string');
const request={}
const config=require('./config')
import Mock from 'mockjs'
request.get=(url,params)=>{
  if(params){
    url+="?"+queryString.stringify(params);
  }
  return fetch(url).
          then((res)=>res.json())
          .then(res=>Mock.mock(res))
}

request.post=(url,body)=>{
  const options=Object.assign({},config.header,{
    body:JSON.stringify(body)
  })
  return fetch(url).
          then((res)=>res.json())
          .then(res=>Mock.mock(res))
}

module.exports=request
