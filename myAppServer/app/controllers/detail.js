'use strict';
const mongoose = require('mongoose');
const Audio = mongoose.model('Audio')
exports.list = function *(next){
  const page = this.query.page - 1
  let list = yield Audio.find({}).skip(page * 5)
        .limit(5).exec();
  let allList = yield Audio.find({}).exec()
  let total = allList.length
  console.log(this.query.page,allList,total,'list')
  if((page+1) * 5 <= total){
    this.body={
      success:true,
      data:list,
      total
    }
  }else{
    this.body={
      success:true,
      data:allList,
      total
    }
  }
}
