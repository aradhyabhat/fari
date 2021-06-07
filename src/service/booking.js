const bookingDb = require("../model/booking")



let bookingService={}

bookingService.createBooking=(bookingobj)=>{
    return bookingDb.createBooking(bookingobj).then((res)=>{
        if(res){
            return true
        }
        else{
            let err= new Error("Operation failed")
            err.status=402
            throw err;
        }
    })
}

bookingService.getbookings=(userId)=>{
    return bookingDb.getbookings(userId).then((res)=>{
        if(res){
            return res
        }
        else{
            let err=new Error()
            throw err
        }
    })
}

bookingService.cancelbooking=(bookingId)=>{
 
return bookingDb.cancelbooking(bookingId).then((res)=>{
    if(res){
        return true
    }
    else{
        let err=new Error("Operation failed")
        err.status=404
        throw err
    }
})
}

module.exports = bookingService