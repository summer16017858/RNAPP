'use strict'

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  phoneNumber:{
    unique:true,
    type:String
  },
  areaCode:{type:String},
  verifyCode:{type:String},
  accessToken:{type:String},
  nickname:{type:String},
  gender:{type:String,default:'男'},
  age:{type:Number,default:1},
  avator:{type:String},
  verified:{
    type:Boolean,
    default:false
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
  },
  format:{type:String,default:'jpg'},
  version:{type:String,default:'0'}
})

UserSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt=this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next()
})
const UserModel = mongoose.model('User',UserSchema)

module.exports = UserModel;
