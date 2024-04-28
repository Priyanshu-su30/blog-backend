const mongoose = require('mongoose');


const myUserSchema = mongoose.Schema({
    username: String,
    useremail: String,
    password: String,
});

const myUserModel = mongoose.model("User",myUserSchema);
module.exports = myUserModel;