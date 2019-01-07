const mongoose = require('mongoose');
const shortId = require('shortid');
const time = require('./../libs/timeLib');
const responseLib = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const passwordLib = require('../libs/generatePasswordLib');

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
                   let newUser = new UserModel({
                       userId:shortId.generate(),
                       firstName:req.body.firstName,
                       lastName:req.body.lastName || '',
                       email: req.body.email.toLowerCase(),
                       mobileNumber:req.body.mobileNumber,
                       password: passwordLib.hashPassword(req.body.password),
                       createdOn:time.now()

                   });
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
    
}


// end of the login function 


let logout = (req, res) => {
  
} // end of the logout function.


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout

}// end exports