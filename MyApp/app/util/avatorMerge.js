const CLOUDINARY = {
  'cloud_name': 'dasd',
  'api_key': '496296485779136',
  'api_secret': 'QdFOIsjngw9cZ6DUVzvg0g0ScNU',
  'base':'https://res.cloudinary.com/dasd',
  'image':'https://api.cloudinary.com/v1_1/dasd/image/upload',
  'video':'https://api.cloudinary.com/v1_1/dasd/video/upload',
  'audio':'https://api.cloudinary.com/v1_1/dasd/raw/upload',
}
const avatorMerge = function (id,type,version,format){
  console.log(id,'iddddd')
  if(id.indexOf('http') > -1){
    return id
  }
  if(id.indexOf('data:image') > -1){
    return id
  }
  if(id.indexOf('avator') > -1){
    return CLOUDINARY.base + '/' + type + '/upload/v'+ version + '/' + id +'.' + format
  }
  return 'http://oxoxcahp0.bkt.clouddn.com/' + id
}
module.exports=avatorMerge
