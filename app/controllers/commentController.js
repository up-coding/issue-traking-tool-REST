 
const mongoose = require('mongoose');
 
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
 
const check = require('../libs/checkLib')
 

 
const CommentModel = mongoose.model('Comment')
 

 
let getUsersComment = (req, res) => {
   
  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (check.isEmpty(req.query.issueId)) {
        logger.info('parameters missing', 'getUsersComment handler', 9)
        let apiResponse = response.generate(true, 'parameters missing.', 403, null)
        reject(apiResponse)
      } else {
        resolve(apiResponse)
      }
    })
  }  
  let findComments = () => {
    return new Promise((resolve, reject) => {
      CommentModel.find(req.query.issueId)
        .select('-_id -__v')
        .sort('-createdOn')
         
        .lean()
        .exec((err, result) => {
          if (err) {
            console.log(err)
            logger.error(err.message, 'Comment Controller: getUsersComments', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            reject(apiResponse)
          } else if (check.isEmpty(result)) {
            logger.info('No Comment Found', 'Comment Controller: getUsersComments')
            let apiResponse = response.generate(true, 'No Comment Found', 404, null)
            reject(apiResponse)
          } else {
            console.log('Comment found and listed.')
            resolve(result)
          }
        })
    })
  }  
  validateParams()
    .then(findComments)
    .then((result) => {
      let apiResponse = response.generate(false, 'All Comments Listed', 200, result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
}  

 
 
 

   
module.exports = {
  getUsersComment: getUsersComment,
   
}