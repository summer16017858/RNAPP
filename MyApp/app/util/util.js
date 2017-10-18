const queryString = require('query-string');
const request={}
const config=require('./config')
const _ = require('lodash');
import Mock from 'mockjs'
request.get=(url,params)=>{
  if(params){
    url+="?"+queryString.stringify(params);
  }
  console.log(url,'url')
  return fetch(url).
          then((res)=>res.json())
          .then(res=>Mock.mock(res))
}

request.post=(url,body)=>{
  console.log(JSON.stringify(body),'body')
  const options=_.extend(config.header,{
    body:JSON.stringify(body)
  })
  console.log(options,'options post')
  return fetch(url,options).
          then((res)=>{console.log(res,'res');return res.json()})
          .then(res=>Mock.mock(res))
}
module.exports=request
