'use strict';
const mongoose = require('mongoose');
const Audio = mongoose.model('Audio')
exports.list = function *(next){
  const page = this.query.page - 1
  let list = yield Audio.find({}).skip(page * 5)
        .limit(5).sort({_id: -1}).exec();
  let allList = yield Audio.find({}).sort({'create_at':'asc'}).exec()
  let total = allList.length
  console.log(this.query.page,list.length,total,'list')
  this.body={
    success:true,
    data:list,
    total
  }
}
