const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
var path = require('path');
var serveStatic = require('serve-static');
app.use(serveStatic(__dirname + "/dist"));
var Post = require("./models/post");
var mongoose = require('mongoose');
var mongodb =  'mongodb://yubi:12tomhanks@ds255332.mlab.com:55332/posts'; //mongodob url using mLab
//mongoose.connect('mongodb://localhost:27017/posts'); //for running locally
mongoose.connect(mongodb);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())


  // Fetch all posts
app.get('/posts', (req, res) => {
  Post.find({}, 'title description', function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

  app.post('/posts', (req,res) => {
    var title = req.body.title;
    var description = req.body.description;
    var new_post = new Post({
      title: title,
      description: description
    })

    new_post.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true,
        message: 'Post saved successfully!'
      })
    })
  })

  // Fetch single post
app.get('/post/:id', (req, res) => {
  
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) { console.error(error); }
    res.send(post)
  })
})

// Update a post
app.put('/posts/:id', (req, res) => {
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) { console.error(error); }

    post.title = req.body.title
    post.description = req.body.description
    post.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete a post
app.delete('/posts/:id', (req, res) => {
  
  Post.remove({
    _id: req.params.id
  }, function(err, post){
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})
  
app.listen(process.env.PORT || 8081)