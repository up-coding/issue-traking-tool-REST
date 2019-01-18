const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time = require('../libs/timeLib');

const issueSchema = new Schema({
    issueId:{
        type:String,
         
        index:true,
        unique:true
    },
    status:{
      type:String,
      default:''
    },
    title:{
        type:String,
        default:''
         
    },
    description:{
        type:String,
        default:''
    },
    files:{
        type:[],
        default:[]
         
    },
    reporterId:{
        type:String,
        required:true
    },
    reporterName:{
        type:String,
        required:true
    },
    assigneeId:{
        type: String,
        default:''
    },
    assigneeName:{
        type: String,
        default:''
    },
    createdOn:{
        type:Date,
        default:time.now(),
    },
    modifiedOn:{
        type:Date,
        default:time.now()
    },
    filesLocation:{
        type:[],
        default:[]
    }


});

mongoose.model('IssueModel',issueSchema);