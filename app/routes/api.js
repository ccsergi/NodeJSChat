var express = require("express");
var path = require("path");
var router = express.Router();
var controllerDir = "../controllers";
var chatController = require(path.join(controllerDir, "chat"));
var userController = require(path.join(controllerDir, "user"));
var apiController = require(path.join(controllerDir, "api"));


router.get("/createApi", apiController.createApi, async (req, res, next) => {});
  
router.get('/get/:sala/:user', [apiController.authApi, chatController.getMessagesByUserAndRoom], async (req, res, next) => {});
router.get('/get/:sala', [apiController.authApi, chatController.getMessagesByRoom], async (req, res, next) => {});
router.post('/post/msg', [apiController.authApi, chatController.createMessageAPI], async (req, res, next) => {});

module.exports = router;