'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User')
const Video = mongoose.model('Video')
const Audio = mongoose.model('Audio')
const Cloudinary = require('cloudinary');
const qiniu = require('qiniu')
const qiniuKey = {
  AK: 'M1CtFEHVsK2c3u4YCXMxh9jItMR4ttez81R14EMt',
  SK: 'Emb_j1FWd37xF5bD84T-d77s7RsaCveRQ5mwAXu1'
}
var accessKey = qiniuKey.AK;
var secretKey = qiniuKey.SK;
qiniu.conf.ACCESS_KEY = accessKey;
qiniu.conf.SECRET_KEY = secretKey;
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var config = new qiniu.conf.Config();
const Promise = require('bluebird')
const CLOUDINARY = {
  'cloud_name': 'dasd',
  'api_key': '496296485779136',
  'api_secret': 'QdFOIsjngw9cZ6DUVzvg0g0ScNU',
  'base':'http://res.cloudinary.com/dasd',
  'image':'https://api.cloudinary.com/v1_1/dasd/image/upload',
  'video':'https://api.cloudinary.com/v1_1/dasd/video/upload',
  'audio':'https://api.cloudinary.com/v1_1/dasd/raw/upload',
}
Cloudinary.config(CLOUDINARY)
function AsyncMedia(videoId,audioId){
  if(!videoId){
    return
  }
  let query = {
    _id: audioId
  }
  if(!audioId){
    query = {
      video:videoId
    }
  }
  Promise.all([Video.findOne({_id:videoId}).exec(),Audio.findOne(query).exec()]).then(data => {
    let video = data[0]
    let audio = data[1];
    console.log(data)
    console.log('检查数据有效性')
    if(!video || !video.public_id || !audio || !audio.public_id){
      return
    }
    console.log('开始同步音频视频');
    const audioPublicId = audio.public_id.replace('/',':');
    const videoPublicId = video.public_id;
    const videoName  = videoPublicId.replace('/','_') + '.mp4';
    const videoUrl  = 'http://res.cloudinary.com/dasd/video/upload/e_volume:-100/e_volume:400,l_video:' + audioPublicId + '/' + videoPublicId + '.mp4';
    const thumbName = videoPublicId.replace('/','_') + '.jpg';
    const thumbUrl = 'http://res.cloudinary.com/dasd/video/upload/' + videoPublicId + '.jpg'
    console.log('同步到七牛',new qiniu.rs.BucketManager(mac,config))
    new Promise((resolve,reject) => {
      new qiniu.rs.BucketManager(mac,config).fetch(videoUrl,'myapp-video',videoName,(err,ret)=>{
        if(err){
          reject(err)
        }else{
          resolve(ret)
        }
      })
    }).catch(err => {
      console.log('err:' + err)
    }).then(res => {
      if(res && res.key){
        audio.qiniu_video = res.key
        audio.save();
        console.log('同步成功')
      }
    })
    new Promise((resolve,reject) => {
      new qiniu.rs.BucketManager(mac,config).fetch(thumbUrl,'myapp-video',thumbName,(err,ret)=>{
        if(err){
          reject(err)
        }else{
          resolve(ret)
        }
      })
    }).catch(err => {
      console.log('err:' + err)
    }).then(res => {
      if(res && res.key){
        audio.qiniu_thmub = res.key
        audio.save().then(_audio => {console.log('_audio:' + _audio)});
        console.log('同步封面成功')
      }
    })
  })
}
exports.video = function *(next){
  const body = this.request.body;
  const videoData = body.video;
  const user = this.session.user;
  if(!videoData || !videoData.key){
    this.body = {
      success:false,
      error:'视频没有上传成功'
    }
    return next;
  }
  let video = yield Video.findOne({
    qiniu_key:videoData.key
  }).exec()
  if(!video){
    video = new Video({
      author:user._id,
      qiniu_key:videoData.key,
      persistentId: videoData.persistentId
    })
    video = yield video.save();
  }
  const url = 'http://oxshaoiv8.bkt.clouddn.com/' + videoData.key
  new Promise((resolve,reject) => {
    Cloudinary.uploader.upload(url,(res) => {
      if(res.public_id){
        resolve(res)
      }else{
        reject(res)
      }
    },{
      resource_type:'video',
      folder: 'video',
    })
  }).then(data => {
    if(data){
      video.public_id = data.public_id;
      video.detail = data
      video.save().then((_video)=>{
        AsyncMedia(_video._id)
      })
    }
  })
  this.body={
    success: true,
    data: video._id
  }
}
exports.audio = function *(next){
  const body = this.request.body;
  const audioData = body.audio;
  const videoId = body.videoId;
  const user = this.session.user;
  if(!audioData || !audioData.public_id){
    this.body = {
      success:false,
      error:'音频没有上传成功'
    }
    return next;
  }
  let audio = yield Audio.findOne({
    public_id:audioData.public_id
  }).exec()
  let video = yield Video.findOne({
    _id:videoId
  }).exec()
  if(!audio){
    let _audio = {
      author: user._id,
      public_id: audioData.public_id,
      detail: audioData
    }
    if(video){
      _audio.video = video.id
    }
    audio = new Audio(_audio)
    audio = yield audio.save();
  }
  AsyncMedia(video._id,audio._id)
  this.body={
    success: true,
    data: audio._id
  }
}
exports.save = function *(next){
  const body = this.request.body;
  const videoId = body.videoId;
  const audioId = body.audioId;
  const title = body.title;
  console.log(videoId,audioId,title)
  let data = yield Audio.findOne({
    video:videoId
  }).exec()
  // console.log(data,'initData');
  if(!data){
    this.body = {
      success: false,
      error: '未找到对应信息'
    }
    return next
  }
  data.title = title;
  console.log('save data:' + data)
  data.save();
  this.body={
    success: true,
    data
  }
  // console.log('save success')
  // data.title = title
  // data.save();

  // return next;
}
