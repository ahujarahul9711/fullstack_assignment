const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in user models
let User = require('../models/user');

//Register form
router.get('/admin_register', function(req,res){
  res.render('admin_register');
});

//Register process
router.post('/admin_register', function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const pasword2 = req.body.pasword2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Name is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
      res.render('admin_register',{
        errors:errors
      });
    } else{
      let newUser = new User({
        name:name,
        email:email,
        username:username,
        password:password,
        admin:'yes'
      });
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(function(err){
            if(err){
              console.log(err);
              return;
            }else{
              req.flash('success', 'You are now registered and can login');
              res.redirect('/users/login');
            }
          })
        });
      });
    }
});

module.exports = router;
