const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index:true
    },
    password: {
        type:String,
        require: true,

    },
    superUser:{
        type:Boolean,
        default:false
    }
    
  });

  const User = mongoose.model('User', userSchema);

  module.exports = User;