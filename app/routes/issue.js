const express = require('express');
const router = express.Router();
const appConfig = require('../../config/appConfig');


const issueController = require('../controllers/issueController');
 
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/fileUpload');
 
 
 

module.exports.setRouter = (app)=>{
    let baseUrl = `${appConfig.apiVersion}/issues`;
    app.get(`${baseUrl}/view/all`,authMiddleware.isAuthorized,issueController.getAllIssue);
    app.get(`${baseUrl}/:issueId/details`,authMiddleware.isAuthorized,issueController.getSingleIssue);
    //app.put(`${baseUrl}/:issueId/edit`,issueController.editIssue);
    app.post(`${baseUrl}/:issueId/delete`,authMiddleware.isAuthorized,issueController.deleteAIssue);
    app.post(`${baseUrl}/createIssue`,authMiddleware.isAuthorized,upload.upload, issueController.createIssue);
}