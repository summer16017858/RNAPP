'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;
const VideoSchema = new Schema({
  author:{
    type:ObjectId,
    ref:'User'
  },
  qiniu_key:{type:String},
  persistentId:{type:String},
  qiniu_final_key:{type:String},
  qiniu_detail:{
    type: Mixed
  },
  public_id:{
    type:String
  },
  detail:{
    type: Mixed
  },
  meta:{
    createAt:{
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }
  }
})

VideoSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt=this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next()
})
const VideoModel = mongoose.model('Video',VideoSchema)

module.exports = VideoModel;
