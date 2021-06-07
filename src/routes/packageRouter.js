const express = require('express');
const router = express.Router();
 const setuppackage = require("../model/setuppackage")
const packageservice = require('../service/package')

router.get("/setuphotdeals", (req, res, next) => {
    setuppackage.packagesetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));
})

router.get("/setupdestinations", (req, res, next) => {
    setuppackage.destinationsetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));
})

router.get('/hotdeals',(req,res,next)=>{
    packageservice.gethotdeals().then((response)=>{
        res.json(response)
    }).catch(err => next(err));
})

router.get('/destinations/:continent',(req,res,next)=>{
    let continent=(req.params.continent.slice(0,1)).toUpperCase()+(req.params.continent.slice(1)).toLowerCase()
    //console.log(continent)
    packageservice.getdestination(continent).then((response)=>{
        res.json(response)
    }).catch(err => next(err));
})




module.exports = router;