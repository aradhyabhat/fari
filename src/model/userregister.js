const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")


const usersDB = {}




usersDB.generateId=()=>{
    // arr=[]
    return connection.getUserCollection().then(model=>{
        return model.distinct("userId").then((ids)=>{
            //console.log(ids)
           let lastid=ids[ids.length-1]
            lastid=lastid.slice(1)
         //   console.log(lastid)
           let num=parseInt(lastid,10)+1
           //console.log(num)
           return "U"+num
        })
    })
   
}
usersDB.check=(contactNo)=>{
    
    return connection.getUserCollection().then((collection) => {
        return collection.findOne({ "contactNo": contactNo }).then((customerContact) => {
            if (customerContact) {
                return new userDetails(customerContact);
            }
            else return null;
        })
    })
}
usersDB.updatedata=(req)=>{
   // console.log(req)
    return connection.getUserCollection().then((collection) => {
       return usersDB.generateId().then((userid)=>{
        req.userId=userid
      //  console.log(req)
        return collection.insertMany(req).then((res)=>{
            if(res.length!=0){
               // console.log(res)
                return true
            }
            else{
                return false
            }
        })
        })
    })
}
module.exports = usersDB;