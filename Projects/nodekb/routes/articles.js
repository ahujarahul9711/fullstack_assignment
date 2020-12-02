const express = require('express');
const router = express.Router();

//Article models
let Article = require('../models/article');

//Bring in user models
let User = require('../models/user');

//add route
router.get('/add', ensureAuthenticated, function(req,res){
  res.render('add', {
    title:'Add Book'
  });
});

//add submit post route
router.post('/add', function(req,res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.user._id;
  article.description = req.body.description;
  article.price = req.body.price;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('success', 'Article added');
      res.redirect('/');
    }
  })
});

//Load edit form
router.get('/edit/:id',ensureAuthenticated, function(req,res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'not authorized');
      res.redirect('/');
    }else{
    res.render('edit_article', {
      title:'Edit book',
      article:article
    });
    }
  });
});

//submit edit post route
router.post('/edit/:id', function(req,res){
  let article = {};
  article.title = req.body.title;
  article.description = req.body.description;
  article.price = req.body.price;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('success', 'Article updated');
      res.redirect('/');
    }
  })
});

//Delete route
router.delete('/:id', function(req,res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}
  Article.findById(req.params.id, function(err, article){
    if(req.user.admin != "yes"){
      res.status(500).send();
    }else{
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

//get single route
router.get('/:id',function(req,res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      res.render('article', {
        article:article,
        author: user.name
      });
    });

  })
});

//Access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please login');
    res.redirect('/users/login')
  }
}

module.exports = router;
