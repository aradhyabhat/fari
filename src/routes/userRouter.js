const express = require('express');
const router = express.Router();
const setupUser = require("../model/setupUser")
const userservice = require('../service/userslogin')
const userregister=require("../service/userregister")

router.get("/setup", (req, res, next) => {
    setupUser.userSetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));
})

//router to login
router.post('/login', function (req, res, next) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    userservice.login(parseInt(contactNo), password).then(function (userDetails) {
        res.json(userDetails);
    }).catch(err => next(err));
})

//router to register
router.post('/register',(req,res,next)=>{
    userregister.register(req).then((response)=>{
       // console.log("successs");
        
        res.json(response)
    }).catch(err => next(err));
})

module.exports = router;

