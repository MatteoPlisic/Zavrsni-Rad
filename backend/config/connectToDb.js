//load env variables

const mongoose = require("mongoose")

async function connectToDb(){
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to db mongo " + process.env.DB_URL)
    }
    catch(err){
        console.log(err)
    }
}
module.exports = connectToDb;