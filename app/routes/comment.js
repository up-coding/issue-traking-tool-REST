const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/comment`;
  app.get(`${baseUrl}/get/for/issue`, auth.isAuthorized, commentController.getUsersComment);

   
   

}