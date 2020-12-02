let mongoose = require('mongoose');

//Article schema
let articleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  price:{
    type: String,
    required: true
  }
});

let Articel = module.exports = mongoose.model('Article', articleSchema);
