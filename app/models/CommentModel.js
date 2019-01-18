const mongoose = require('mongoose')
 

const Schema = mongoose.Schema;

let commentSchema = new Schema({
  
  commentId: { type: String, unique:true },
  issueId:{type:String,default:''},
  senderName: { type: String, default: '' },
  senderId: { type: String, default: '' },
  comment: { type: String, default: '' },
  createdOn: { type: Date, default: Date.now }

})

module.exports = mongoose.model('Comment', commentSchema)