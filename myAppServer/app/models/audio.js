'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;
const AudioSchema = new Schema({
  author:{
    type:ObjectId,
    ref:'User'
  },
  title:{type:String},
  video:{
    type:ObjectId,
    ref:'Video'
  },
  qiniu_thmub:{
    type:String
  },
  qiniu_video:{
    type:String
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

AudioSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt=this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next()
})
const AudioModel = mongoose.model('Audio',AudioSchema)

module.exports = AudioModel;
