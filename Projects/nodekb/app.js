const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

//init app
const app = express();

//Bring in models
let Article = require('./models/article');

//check connection
db.once('open', function(){
  console.log('connected to mongodb');
})
//Check for db errors
db.on('error', function(err){
  console.log(err);
});

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Home route
app.get('/', function(req,res){
  Article.find({},function(err, articles){
    if(err){
      console.log(err);
    }else{
    res.render('index', {
      title:'Articles',
      articles: articles
    });
    }
  });
});

//Router files
let articles = require('./routes/articles');
let users = require('./routes/users');
let admins = require('./routes/admins');
app.use('/articles', articles);
app.use('/users', users);
app.use('/admins', admins);

//Start server
app.listen(3000, function(){
  console.log('Server started on port 3000.....')
});
