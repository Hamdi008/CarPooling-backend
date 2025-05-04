//mongoose is required to connect to MongoDB
const mongoose = require("mongoose")

//this will connect to CarPoolingDB database in mongoDB, if CarPoolingDB does not exist, it will be created automatically.
mongoose.connect("mongodb://localhost:27017/CarPoolingDB")
.then(
    ()=>{
        console.log("CarPoolingDB database is connected");
    }
)
.catch(
    (err)=>{
        console.log(err);
    }
)

module.exports = mongoose