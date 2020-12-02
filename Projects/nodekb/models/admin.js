//This js file is not required
const mongoose = require('mongoose');

//User schema
const AdminSchema = mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  }
});

const Admin = module.exports = mongoose.model('Admin', AdminSchema);
