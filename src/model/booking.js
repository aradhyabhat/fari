const connection = require("../utilities/connections")

let bookingData = [
    { bookingId: "B1001", userId: "U1001", destId: "D1001", destinationName: "A Week in Greece: Athens, Mykonos & Santorini", checkInDate: "2018-12-09", checkOutDate: "2018-12-16", noOfPersons: 2, totalCharges: 5998, timeStamp: new Date().getTime().toString() },
    { bookingId: "B1002", userId: "U1001", destId: "D1002", destinationName: "Romantic Europe: Paris, Venice & Vienna", checkInDate: "2019-1-10", checkOutDate: "2019-1-24", noOfPersons: 1, totalCharges: 4549, timeStamp: new Date().getTime().toString() },
    { bookingId: "B1003", userId: "U1002", destId: "D1002", destinationName: "Romantic Europe: Paris, Venice & Vienna", checkInDate: "2019-1-10", checkOutDate: "2019-1-24", noOfPersons: 1, totalCharges: 4549, timeStamp: new Date().getTime().toString() }
]

const bookingDb = {}

bookingDb.bookingsetup = () => {
    return connection.getbookingCollection().then((myCollection) => {
        return myCollection.deleteMany().then((data) => {
            return myCollection.insertMany(bookingData).then((data) => {
                if (data) {
                    return "Insertion Successfull"
                } else {
                    throw new Error("Insertion failed")
                }
            })
        })

    })
}

bookingDb.generateId = () => {
    // arr=[]
    return connection.getbookingCollection().then(model => {
        return model.distinct("bookingId").then((ids) => {
            //console.log(ids)
            let lastid = ids[ids.length - 1]
            lastid = lastid.slice(1)
            //   console.log(lastid)
            let num = parseInt(lastid, 10) + 1
            //console.log(num)
            return "B" + num
        })
    })

}

bookingDb.createBooking = (bookingobj) => {

    return connection.getbookingCollection().then((collection) => {
        return bookingDb.generateId().then((bookingId) => {
            bookingobj.bookingId = bookingId
          
            return collection.insertMany(bookingobj).then((res) => {
                if (res.length != 0) {
                    return connection.getUserCollection().then((collection) => {

                        return collection.updateOne({ userId: bookingobj.userId }, { $push: { bookings: bookingId } }).then((data) => {

                            if (data.nModified > 0) {
                                return connection.getdestinationCollection().then((collection) => {
                                    return collection.findOne({ destinationId: bookingobj.destId }).then((data) => {
                                        if (data) {
                                            var availability = data.availability
                                            if (availability < bookingobj.noOfPersons) {
                                                let err = new Error("Booking failed due to less availability")
                                                err.status = 400
                                                throw err
                                            }
                                            else {
                                                return connection.getdestinationCollection().then((collection) => {
                                                    return collection.updateOne({ destinationId: bookingobj.destId }, { $inc: { availability: -bookingobj.noOfPersons } }).then((data) => {
                                                        if (data.nModified > 0) {
                                                            return true
                                                        }
                                                        else {
                                                            return false
                                                        }

                                                    })
                                                })
                                            }
                                        }
                                        else {
                                            return connection.getpackageCollection().then((collection) => {
                                                return collection.findOne({ destinationId: bookingobj.destId }).then((data) => {
                                                    if (data) {
                                                        let hotdealavailability = data.availability
                                                        if (hotdealavailability < bookingobj.noOfPersons) {
                                                            let err = new Error("Booking failed due to less availability")
                                                            err.status = 400
                                                            throw err
                                                        }
                                                        else {
                                                            return connection.getpackageCollection().then((collection) => {

                                                                return collection.updateOne({ destinationId: bookingobj.destId }, { $inc: { availability: -bookingobj.noOfPersons } }).then((data) => {
                                                                    if (data.nModified > 0) {
                                                                        return true
                                                                    }
                                                                    else {
                                                                        return false
                                                                    }
                                                                })
                                                            })
                                                        }
                                                    }
                                                    else {
                                                        return false
                                                    }
                                                })
                                            })
                                        }
                                    })

                                })





                            }
                            else {
                                return false
                            }
                        })
                    })
                }
                else {
                    return false
                }
            })
        })
    })
}

bookingDb.getbookings = (userId) => {
    return connection.getbookingCollection().then((collection) => {
        return collection.find({ userId: userId }, { _id: 0 }).then((res) => {
            if (res.length > 0) {
                return res
            }
            else {
                return null
            }
        })
    })
}

bookingDb.cancelbooking = (bookingId) => {

    return connection.getbookingCollection().then((collection) => {

        return collection.findOne({ bookingId: bookingId }).then((data) => {
            if (data) {
                let userId = data.userId
                let destId = data.destId
                let noOfPersons = data.noOfPersons
                return collection.deleteOne({ bookingId: bookingId }).then((data) => {
                    if (data.deletedCount > 0) {
                        return connection.getUserCollection().then((collection) => {

                            return collection.updateOne({ userId: userId }, { $pull: { bookings: bookingId } }).then((data) => {
                                if (data.nModified > 0) {
                                    return connection.getdestinationCollection().then((collection) => {
                                        return collection.updateOne({ destinationId: destId }, { $inc: { availability: noOfPersons } }).then((data) => {
                                            if (data.nModified > 0) {
                                                return true
                                            }
                                            else {
                                                return connection.getpackageCollection().then((collection) => {
                                                    return collection.updateOne({ destinationId: destId }, { $inc: { availability: noOfPersons } }).then((data) => {
                                                        if (data.nModified > 0) {
                                                            return true
                                                        }
                                                        else { return false }
                                                    })
                                                })
                                            }
                                        })
                                    })
                                }
                                else { return false }
                            })
                        })
                    }
                    else { return false }
                })
            }
            else {
                return false
            }
        })
    })
}



module.exports = bookingDb