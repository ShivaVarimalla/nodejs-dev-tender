const moongose = require("mongoose");

const {Schema} = moongose;
const userSchema = new Schema({
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String
    },
    password :{
        type : String
    },
    age : {
        type : String
    },
    gender : {
        type : String
    }
});

module.exports = moongose.model("User",userSchema)