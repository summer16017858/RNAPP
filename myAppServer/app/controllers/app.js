'use strict';
const CLOUDINARY = {
  'cloud_name': 'dasd',
  'api_key': '496296485779136',
  'api_secret': 'QdFOIsjngw9cZ6DUVzvg0g0ScNU',
  'base':'http://res.cloudinary.com/dasd',
  'image':'https://api.cloudinary.com/v1_1/dasd/image/upload',
  'video':'https://api.cloudinary.com/v1_1/dasd/video/upload',
  'audio':'https://api.cloudinary.com/v1_1/dasd/raw/upload',
}
const qiniu = require('qiniu')
const qiniuKey = {
  AK: 'M1CtFEHVsK2c3u4YCXMxh9jItMR4ttez81R14EMt',
  SK: 'Emb_j1FWd37xF5bD84T-d77s7RsaCveRQ5mwAXu1'
}
const sha1 = require('sha1');
var accessKey = qiniuKey.AK;
var secretKey = qiniuKey.SK;
let bucket = 'myapp-avator'
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
  scope: bucket,
  expires: 7200
};
var signature;
exports.signature = function *(next){
  const body = this.request.body;
  const key = body.key;
  const type = body.type;
  if(type === 'avator'){
    bucket='myapp-avator'
    options.scope = bucket
  }else if(type === 'video'){
    bucket='myapp-video'
    options.scope = bucket;
    options.persistentOps = 'avthumb/mp4/an/1'
  }else if(type === 'audio'){
    bucket='myapp-audio'
    options.scope = bucket
  }
  console.log(options)
  if(key){
    //上传七牛
    var putPolicy = new qiniu.rs.PutPolicy(options);
    signature=putPolicy.uploadToken(mac);
  }else{
    //cloudinary
    console.log(body,'body')
    const type = body.type;
    const timestamp = body.timestamp;
    let folder = body.folder;
    let tags = body.tags;
    switch(type){
      case 'avator':
        folder = 'avator'
        tags = 'app,avator'
        break;
      case 'video':
        folder = 'video'
        tags = 'app,video'
        break;
      case 'audio':
        folder = 'audio'
        tags = 'app,audio'
        break;
      default:
        folder = 'avator'
        tags = 'app,avator'
        break;
    }
    console.log(folder,tags,timestamp,CLOUDINARY.api_secret)
    signature = 'folder=' + folder +'&tags=' + tags +'&timestamp=' + timestamp + CLOUDINARY.api_secret
    signature = sha1(signature)
  }
  console.log(signature,'signature')
  this.body={
    success:true,
    data:signature
  }
  return next
}
