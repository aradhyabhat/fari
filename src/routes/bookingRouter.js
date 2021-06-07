const express = require('express');
const router = express.Router();
const bookings = require("../model/booking")
const service=require("../service/booking")
const Bookingobj= require("../model/beanClasses/booking")



router.get("/setupbookings", (req, res, next) => {
    bookings.bookingsetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));
})

router.post("/:userId/:dealId",(req,res,next)=>{
    let bookingobj= new Bookingobj(req.body)
    bookingobj.userId=req.params.userId
    bookingobj.destId=req.params.dealId
    service.createBooking(bookingobj).then((data)=>{
        res.json(data)
    }).catch(err => next(err));
})


router.get("/:userId",(req,res,next)=>{
    let userId=req.params.userId
    service.getbookings(userId).then((data)=>{
        res.json(data)
    }).catch(err => next(err));
})


router.delete("/cancelBooking/:bookingId",(req,res,next)=>{
   
    let bookingId=req.params.bookingId
    service.cancelbooking(bookingId).then((data)=>{
        res.json(data)
    }).catch(err => next(err));
})




module.exports = router;