const userDB = require('../model/userregister');



const userService = {}


userService.register = (req) => {
  //  console.log(req.body);
    
    return userDB.check(req.body.contactNo).then((res) => {
        if (res) {
            let err = new Error("Number already exists")
            err.status = 400
            throw err
        }
        else {
           // console.log(req.body)
            return userDB.updatedata(req.body).then((res) => {
                if (res) {
                    return "User registered successfully"
                }
                else {
                    let err = new Error("Registration failed! Please try again")
                    err.status = 400
                    throw err
                }
            })
        }
    })
}





module.exports = userService