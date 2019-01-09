const mongoose = require('mongoose');
const shortId = require('shortid');


const IssueModel =  mongoose.model('IssueModel');
const time = require('./../libs/timeLib');
const responseLib = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');



let getAllIssue = (req,res)=>{
    try{
        IssueModel.find()
        .select('-_id -__v')
        .lean()
        .exec((err,result)=>{
            if (err) {
                logger.error(err.message, 'issueController: getAllUser', 10)
                res.send(responseLib.generateResponse(true, 'Issue details not found.', 500, null))
            } else if (check.isEmpty(result)) {
                logger.info('No issue found', 'issueController: getAllIssue')
                res.send(responseLib.generateResponse(true, 'No issue found.', 404, null))
            } else {
                res.send(responseLib.generateResponse(false, 'All Issue details found', 200, result))
            }
        });
    }catch(err){
         (err)=>{
            res.send(responseLib.generateResponse(true, `${err.message}`, 404, null))
         }
    }
    
}

let createIssue = (req,res)=>{
   
    let validateIssueInput = ()=>{
        console.log(req.files);
        console.log('inside validateinput');
        return new Promise((resolve,reject)=>{
             if(req.body.title){
                 if(check.isEmpty(req.body.description)){
                    logger.error("Description is missing","issueControler(): createIssue",7);
                     reject(responseLib.generateResponse(true,'Title is description is empty',400,null));
                 }else if(req.files.length === 0 || req.files === undefined || req.files === null){
                    logger.error("Files is missing","issueControler(): createIssue",7);
                     reject(responseLib.generateResponse(true,'Files is  missing',400,null));
                 }else if(check.isEmpty(req.body.reporterId)){
                    logger.error("Reporter Id is missing","issueControler(): createIssue",7);
                     reject(responseLib.generateResponse(true,'Title is description is empty',400,null));
                 }else if(check.isEmpty(req.body.assigneeId)){
                    logger.error("Assignee Id is missing","issueControler(): createIssue",7);
                     reject(responseLib.generateResponse(true,'Title is description is empty',400,null));
                 }else{
                     resolve(req);
                 }
             }else{
                logger.error("Fields Missing during creation of issue","issueControler(): createIssue",10);
                reject(responseLib.generateResponse(true,'Fields Missing.',400,10));
             }
        });
    }

    let createIssue = ()=>{
        console.log('inside createIssue');
        return new Promise((resolve,reject)=>{
             let newIssue = new IssueModel({
                 issueId: shortId.generate(),
                 title: req.body.title,
                 description: req.body.description,
                 uploadedFiles:req.files[0].originalname,
                 reporterId:req.body.reporterId,
                 assigneeId:req.body.assigneeId,
                 createdOn:time.now()
             });
             newIssue.save((err,newUser)=>{
                 if (err) {
                     logger.error(err.message, 'issueController: error issue saving', 10);
                     reject(responseLib.generateResponse(true, 'failed to create new issue while saving', 500, null));
                 } else {
                     resolve(newUser.toObject());
                 }
             });
        });
    }

    validateIssueInput(req,res)
    .then(createIssue)
    .then((resolve)=>{
        res.send(responseLib.generateResponse(false,'Issue Created successfully',200,resolve));
    })
    .catch((err)=>{
        res.send(responseLib.generateResponse(true,`${err.message}`,400,null));  

    });

}

let getSingleIssue = (req,res)=>{
    try{
        IssueModel.findOne({'issueId':req.params.issueId})
        .select('-_id -__v')
        .lean()
        .exec((err,result)=>{
         if (err) {
             logger.error(err.message, 'issueController: getSingleIssue', 10)
             res.send(responseLib.generateResponse(true, 'Failed to find single issue details', 500, null))
         } else if (check.isEmpty(result)) {
             logger.info('No issue found', 'issueController:getSingleIssue')
             res.send(responseLib.generateResponse(true, 'No issue found', 404, null))
         } else {
             res.send(responseLib.generateResponse(false, 'Issue details found', 200, result))
         }
        })
    }catch(err){
        
        (err)=>{
        res.send(responseLib.generateResponse(true, `${err.message}`, 404, null))
        }
   };
}

let deleteAIssue = (req,res)=>{
    try{
        IssueModel.remove({'issueId':req.params.issueId}).exec((err,result)=>{
            if(err){
                logger.error('err.message','issueController: deleteAIssue',10);
                res.send(responseLib.generateResponse(true,'Unable to delete the issue',500,null));
            }else if(check.isEmpty(result)){
                logger.info('No issue found','issueController: deleteAIssue');
                res.send(responseLib.generateResponse(true,'No issue found to delete',400,null));
            }else{
                res.send(responseLib.generateResponse(false,'Issue deleted Successfully',200,result));
            }
     
        });
    }catch(err){
        res.send(responseLib.generateResponse(true,`${err.message}`,404,null));
    }
   
}

module.exports = {
    getAllIssue:getAllIssue,
    createIssue:createIssue,
    getSingleIssue:getSingleIssue,
    deleteAIssue:deleteAIssue
}