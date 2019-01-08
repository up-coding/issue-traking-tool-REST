const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const secretKey = 'thisKeyIsWritenByTheKingInNorth';


let generateToken = (data,callBack) =>{
    
    try{
        let claims = {
            jwtid: shortId.generate(),
            iat: Date.now(),
            exp: Math.floor(Date.now()/1000)+ (60*60*24),
            sub:'authToken',
            iss:'issueTrakingTool',
            data:data
        };
        let tokenDetails = {
            token: jwt.sign(claims,secretKey),
            tokenSecret: secretKey
        };
        callBack(null,tokenDetails);
    }catch(err){
        console.log(err);
        callBack(err,null);
    }
};

let verifyClaim = (token,secretKey,callBack)=>{
    jwt.verify(token,secretKey,(err,decodedInfo)=>{
        if(err){
           console.log('error while verify token');
           console.log(err);
           callBack(err,null);
        } else {
           console.log('User verified.');
           console.log(decodedInfo);
           callBack(null,decodedInfo);
        }
    });
};

module.exports = {
    generateToken:generateToken,
    verifyClaim:verifyClaim
}