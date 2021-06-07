const connection = require("../utilities/connections")






const packageDb = {}


packageDb.gethotdeals=()=>{
  return  connection.getpackageCollection().then((model)=>{
       return model.find({},{_id:0}).then((res)=>{
           if(res){
               return res
           }
           else{
               return null
           }
        })
    })
}
packageDb.getdestination=(continent)=>{
   // console.log(continent)
return connection.getdestinationCollection().then((model)=>{
    return model.find({continent:continent},{_id:0}).then((res)=>{
        //console.log(res)
        if(res.length>0){
           return connection.getpackageCollection().then((collection)=>{
              return collection.find({continent:continent},{_id:0}).then((hotdealdata)=>{
                   //console.log(hotdealdata)
                   if(hotdealdata.length>0){
                     let finalarr= hotdealdata.concat(res)
                      // console.log(res)
                       return finalarr
                   }
                   else{
                       return res
                   }
               })
           })
        }
        else{
            return connection.getpackageCollection().then((collection)=>{
                collection.find({continent:continent},{_id:0}).then((hdeals)=>{
                    if(hdeals.length>0){
                        return hdeals
                    }
                    else{
                        return null
                    }
                })
            })
        }
    })
})
}

module.exports = packageDb;