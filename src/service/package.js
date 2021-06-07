const packageDb = require("../model/package")



const packageService = {}



packageService.gethotdeals = () => {
    return packageDb.gethotdeals().then((res) => {
        if (res) {
            return res
        }
        else {
            let err = new Error("Couldn't fetch data")
            err.status = 400
            throw err
        }
    })
}

packageService.getdestination = (continent) => {
    //console.log(continent)
    return packageDb.getdestination(continent).then((res) => {
        if (res) {
            return res
        }
        else {
            let err = new Error("Couldn't fetch data")
            err.status = 400
            throw err
        }
    })
}

module.exports = packageService