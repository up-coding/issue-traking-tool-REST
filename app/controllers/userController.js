const mongoose = require('mongoose');
const shortId = require('shortid');
const time = require('./../libs/timeLib');
const responseLib = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const passwordLib = require('../libs/generatePasswordLib');
const token = require('../libs/tokenLib');
const AuthModel = require('../models/AuthModel');

/* Models */
const UserModel = mongoose.model('UserModel')


// start user signup function 

let signUpFunction = (req, res) => {
    
    let validateUserInput = ()=>{
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                if(!validateInput.checkEmail(req.body.email)){
                    let response = responseLib.generateResponse(true,'Email is not correct',400,null);
                    reject(response);
                }else if(check.isEmpty(req.body.password)){
                    let response = responseLib.generateResponse(true,'Password is empty',400,null);
                    reject(response);
                }else{
                    resolve(req);
                }
            }else{
                logger.error("Fields Missing during signup","userControler(): create user",10);
                let response = responseLib.generateResponse(true,'One more parameter(s) is missing',400,10);
                reject(response);
            }
        });
    }//end validate user input

    let createUser = ()=>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({email:req.body.email})
            .exec((err,retrivedUserDetails)=>{
                if(err){
                   logger.error(err.message,'userController: createUser',10);
                   let response = responseLib.generateResponse(true,'Failed to create new user',500,null);
                   reject(response);
                }else if(check.isEmpty(retrivedUserDetails)){
                   console.log(req.body);
                   console.log(req.body.password);
                   let newUser = new UserModel({
                       userId:shortId.generate(),
                       firstName:req.body.firstName,
                       lastName:req.body.lastName || '',
                       email: req.body.email.toLowerCase(),
                       mobileNumber:req.body.mobileNumber,
                       password: passwordLib.hashPassword(req.body.password),
                       createdOn:time.now()

                   });
                   console.log(newUser.password);
                   newUser.save((err,newUser)=>{
                       if(err){
                          console.log(err);
                          logger.error(err.message,'userController: error user saving',10);
                          let response = responseLib.generateResponse(true,'failed to create new user while saving',500,null);
                          reject(response);
                       }else{
                           let newUserObj = newUser.toObject();
                           resolve(newUserObj);
                       }
                   });
                }else{
                    logger.error('User cannot be created:user already exist','usercontroller: createUser',10);
                    let response = responseLib.generateResponse(true,'user already presendt with thei email',500,null);
                    reject(response);
                }
            });
        });
    }


    validateUserInput(req,res)
    .then(createUser)
    .then((resolve)=>{
        delete resolve.password;
        let response = responseLib.generateResponse(false,'User Created',200,resolve);
        res.send(response);
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    })
  

}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    let findUser = () =>{
        console.log('find user');
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                console.log('req body email is there');
                console.log(req.body);
                UserModel.findOne({email:req.body.email},(err,userDetails)=>{
                    console.log('user details in finduser ' + userDetails);
                    if(err){
                       console.log(err);
                       logger.error('Failed to Retrive User','userController: findUser()',10);
                       let response = responseLib.generateResponse(true,'Failed to find user',500,null);
                       reject(response);
                    }else if(check.isEmpty(userDetails)){
                        logger.error('NO user found','userController: findUser()',7);
                        let response = responseLib.generateResponse(true,'No user details found',404,null);
                        reject(response);

                    }else{
                        logger.info('user found','userControler(): findUser()',10);
                        resolve(userDetails);
                    }
                });

            }else{
                let response = responseLib.generateResponse(true,'email parameter is missing',400,null);
                reject(response);
            }
        });
    }

    let validatePassword = (retrievedUserDetails)=>{
        console.log('validate password');
        return new Promise((resolve,reject)=>{
            passwordLib.comparePassword(req.body.password,retrievedUserDetails.password,(err,isMatch)=>{
               if(err){
                 console.log(err);
                 logger.error(err.message,'userController: validatePassword()',10);
                 let response = responseLib.generateResponse(true,'Login Failed',500,null);
                 reject(response);
               }else if(isMatch){
                 let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                 delete retrievedUserDetailsObj.password;
                 delete retrievedUserDetailsObj.__v;
                 delete retrievedUserDetailsObj._id;
                 delete retrievedUserDetailsObj.createdOn;
                 resolve(retrievedUserDetailsObj);
               }else{
                   logger.info('Login failed due to Invalid Password','userController: validatePassword()',10);
                   let response = responseLib.generateResponse(true,'Wrong Password',400,null);
                   reject(response);
               }
            });
        });
    }

    let generateToken = (userDetails)=>{
        console.log('generate token');
        return new Promise((resolve,reject)=>{
            token.generateToken(userDetails,(err,tokenDetails)=>{
                 if(err){
                    console.log(err);
                    let response = responseLib.generateResponse(true,'Failed to generate token',500,null);
                    reject(response);
                 }else{
                     tokenDetails.userId = userDetails.userId;
                     tokenDetails.userDetails = userDetails;
                     resolve(tokenDetails);
                 }
            });
        });
    }

    let saveToken = (tokenDetails)=>{
        console.log('save token');
        return new Promise((resolve,reject)=>{
            AuthModel.findOne({userId:tokenDetails.userId},(err,retrievedTokenDetails)=>{
               if(err){
                  logger.error(err.message,'userController: saveToken()',10);
                  let response = responseLib.generateResponse(true,'Failed to generate token',500,null);
                  reject(response);
               }else if(check.isEmpty(retrievedTokenDetails)){
                  let newAuthToken = new AuthModel({
                       userId:tokenDetails.userId,
                       authToken:tokenDetails.token,
                       tokenSecret:tokenDetails.tokenSecret,
                       tokenGenerationTime:time.now()
                  });
                  newAuthToken.save((err,newTokenDetails)=>{
                      if(err){
                         console.log(err);
                         logger.error(err.message,'userController: saveToken()',10);
                         let response = responseLib.generateResponse(true,'Failed ot generate token',500,null);
                         reject(response);
                      }else{
                          let responseBody = {
                              authToken:newTokenDetails.authToken,
                              userDetails:tokenDetails.userDetails
                          };
                          resolve(responseBody);
                      }
                  });
               }else{
                   retrievedTokenDetails.authToken = tokenDetails.authToken;
                   retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret;
                   retrievedTokenDetails.tokenGenerationTime = time.now();
                   retrievedTokenDetails.save((err,newTokenDetails)=>{
                        if(err){
                          console.log(err);
                          logger.error(err.message,'userController: saveToken',10);
                          let response = responseLib.generateResponse(true,'failed to generate token',500,null);
                          reject(response);
                        }else{
                            let responseBody = {
                                authToken:newTokenDetails.authToken,
                                userDetails:tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                   });
               }
            });

        });
    }


    findUser(req,res)
    .then(validatePassword)
    .then(generateToken)
    .then(saveToken)
    .then((resolve)=>{
        let response = responseLib.generateResponse(false,'Login successfull',200,resolve);
        res.status(200);
        res.send(response);
    })
    .catch((err)=>{
       console.log('error handler');
       console.log(err);
       res.status(err.status);
       res.send(err);
    });
}


// end of the login function 


let logout = (req, res) => {
   AuthModel.remove({userId:req.user.userId},(err,result)=>{
      if(err){
         console.log(err);
         logger.error(err.message,'userController: logout',10);
         let response = responseLib.generateResponse(true,`error occurred: ${err.message}`,500,null);
         res.send(response);
      }else if(check.isEmpty(result)){
         let response = responseLib.generateResponse(true,'Already logged out or invalid user',404,null);
         res.send(response);
      }else{
          let response = responseLib.generateResponse(false,'Logged out successfully',200,null);
          res.send(response);
      }
   });
} // end of the logout function.

let editUser = (req,res)=>{
    let options = req.body;
    UserModel.update({'userId':req.params.userId},options).exec((err,result)=>{
       if(err){
          console.log(err);
          logger.error(err.message,'userController: editUser',10);
          let response = responseLib.generateResponse(true,'Failed to edit user details',500,null);
          res.send(response);
       }else if(check.isEmpty(result)){
          logger.info('No user found','userController: edit user');
          let response = responseLib.generateResponse(true,'no user found',404,null);
          res.send(response);
       }else{
           let response = responseLib.generateResponse(false,'User details edited',200,result);
           res.send(response);
       }
    });
}


let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let response = responseLib.generateResponse(true, 'Failed To delete user', 500, null)
            res.send(response)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let response = responseLib.generateResponse(true, 'No User Found', 404, null)
            res.send(response)
        } else {
            let response = responseLib.generateResponse(false, 'Deleted the user successfully', 200, result)
            res.send(response)
        }
    });
}

    let getSingleUser = (req, res) => {
        UserModel.findOne({ 'userId': req.params.userId })
            .select('-password -__v -_id')
            .lean()
            .exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller: getSingleUser', 10)
                    let response = responseLib.generateResponse(true, 'Failed To Find User Details', 500, null)
                    res.send(response)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller:getSingleUser')
                    let response = responseLib.generateResponse(true, 'No User Found', 404, null)
                    res.send(response)
                } else {
                    let response = responseLib.generateResponse(false, 'User Details Found', 200, result)
                    res.send(response)
                }
            })
    }


    let getAllUser = (req, res) => {
        UserModel.find()
            .select(' -__v -_id -password')
            .lean()
            .exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller: getAllUser', 10)
                    let response = responseLib.generateResponse(true, 'Failed To Find User Details', 500, null)
                    res.send(responselib)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller: getAllUser')
                    let response = responseLib.generateResponse(true, 'No User Found', 404, null)
                    res.send(response)
                } else {
                    let response = responseLib.generateResponse(false, 'All User Details Found', 200, result)
                    res.send(response)
                }
            })
    }


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout,
    editUser:editUser,
    getAllUser:getAllUser,
    deleteUser:deleteUser,
    getSingleUser:getSingleUser

}