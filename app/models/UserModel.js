const mongoose = require('mongoose'),
Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    index: true,
    unique: true,
    
  },
  firstName: {
    type: String,
    required:true
  },
  lastName: {
    type: String,
    required:true
     
  },
  password: {
    type: String,
    required:true,
    default:'passrkkhkhkhkhkhkhkk'
  },
  email: {
    type: String,
    required:true,
    unique:true
  },
  mobileNumber: {
    type: Number,
    required:true
  },
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('UserModel', userSchema);