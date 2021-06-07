const { Schema } = require("mongoose");
const Mongoose = require("mongoose")
Mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/Wanderlust_DB";

let userSchema = Schema({
    name: String,
    userId: String,
    emailId: String,
    contactNo: Number,
    password: String,
    bookings: [String]
}, { collection: "User" })


let packageSchema=Schema({
    destinationId:String,
    continent:String,
    name:String,
    imageUrl:String,
    details:{
        about:String,
        itinerary:{
            dayWiseDetails:{
                firstDay:String,
                restDaysSightSeeing:[String],
                lastDay:String
            },
            packageInclusions:[String],
            tourHighlights:[String],
            tourPace:[String]
        }
    },
    noOfNights:Number,
    flightCharges:Number,
    chargesPerPerson:Number,
    discount:Number,
    availability:Number
},
{ collection: "Hotdeals" })


let destinationSchema=Schema({
    destinationId:String,
    continent:String,
    name:String,
    imageUrl:String,
    details:{
        about:String,
        itinerary:{
            dayWiseDetails:{
                firstDay:String,
                restDaysSightSeeing:[String],
                lastDay:String
            },
            packageInclusions:[String],
            tourHighlights:[String],
            tourPace:[String]
        }
    },
    noOfNights:Number,
    flightCharges:Number,
    chargesPerPerson:Number,
    discount:Number,
    availability:Number
},
{ collection: "Destinations" })

let bookingchema=Schema({
    bookingId:String,
    userId:String,
    destId:String,
    destinationName:String,
    checkInDate:String,
    checkOutDate:String,
    noOfPersons:Number,
    totalCharges:Number,
    timeStamp:String
},
{collection:"Bookings"})


let collection = {};

collection.getUserCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }).then((database) => {
        return database.model('User', userSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

collection.getpackageCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }).then((database) => {
        return database.model('Hotdeals', packageSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}


collection.getdestinationCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true}).then((database) => {
        return database.model('Destinations', destinationSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

collection.getbookingCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true}).then((database) => {
        return database.model('Bookings', bookingchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

module.exports = collection;
