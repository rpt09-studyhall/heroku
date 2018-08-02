const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const KEYS = require('./keys.js')
const app = new express()
const mongoose = require('mongoose')
mongoose.connect('mongodb://rpt09:hackreactorrpt09@ds111082.mlab.com:11082/rpt09-chat');
const message = require('./db.js')
const $ = require('jquery')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected')
});
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  // app.get('/', (req, res) => res.render('pages/index', {KEYS}))
  app.use(express.static(path.join(__dirname, 'public')))



  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

  