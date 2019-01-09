const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time = require('../libs/timeLib');

const issueSchema = new Schema({
    issueId:{
        type:String,
         
        index:true,
        unique:true
    },
    title:{
        type:String,
        default:''
         
    },
    description:{
        type:String,
        default:''
    },
    uploadedFiles:{
        type:[],
        default:[]
         
    },
    reporterId:{
        type:String
    },
    assigneeId:{
        type:String
    },
    createdOn:{
        type:Date,
        default:time.now(),
    }

});

mongoose.model('IssueModel',issueSchema);