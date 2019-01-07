const responseLib = require('./../libs/responseLib')


let errorHandler = (err,req, res, next) => {
    console.log("application error handler called");
    console.log(err);

    let response = responseLib.generateResponse(true, 'Some error occured at global level',500, null);
    res.send(response)
    
}// end request ip logger function 

let notFoundHandler = (req,res,next)=>{

    console.log("Global not found handler called");
    let response = responseLib.generateResponse(true, 'Route not found in the application',404, null);
    res.status(404).send(response)

}// end not found handler

module.exports = {
    globalErrorHandler : errorHandler,
    globalNotFoundHandler : notFoundHandler
}
