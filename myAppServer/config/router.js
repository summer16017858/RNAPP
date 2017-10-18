'use strict'
const Router=require('koa-router');
const User = require('../app/controllers/users')
const App = require('../app/controllers/app')
const List = require('../app/controllers/list')
const Creation = require('../app/controllers/creation')
module.exports = function(){
  const router= new Router({
    prefix:'/api'
  })
  router.get('/index',List.list)

  router.post('/user/signup',User.signUp)
  router.post('/user/verify',User.verify)
  router.post('/user/update',User.update)

  router.post('/signature',App.signature)

  router.post('/creations',Creation.save)
  router.post('/creations/video',Creation.video)
  router.post('/creations/audio',Creation.audio)
  return router
}
