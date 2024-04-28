const myUserModel = require ("../models/userModel");
const cloudinary = require('cloudinary');
const bcryptjs = require("bcryptjs");
var salt = bcryptjs.genSaltSync(10);
const jsonwebtoken = require('jsonwebtoken');

// app.post("/signup", (req, res)=>)
function signup(req, res){
    const {password, email, username} = req.body;

    if(password.length===0 || email.length===0 || username===0){
        return res.status(404).send({message:"You are creating user with unknown details"})
    }

    jsonwebtoken.sign({email: email}, process.env.SECRETKEY,
        {expiresIn: 24*60*60,
        }, (error, result)=>{
            if(error!=null){
                return res.status.send({message: "Server failed to create user."})
            }

            var hash = bcryptjs.hashSync(password, salt);
            
            myUserModel.find({useremail: email}).then((data)=>{
                if(data.length === 0){
                    //new user will create here
                    const newUser = myUserModel({
                        username: username,
                        useremail: email,
                        password: hash,
                    })
        
                    newUser.save().then(()=>{
                        return res.status(201).send({ message: "Successfully created user", token: result})
                    }).catch(()=>{
                        return res.status(500).send({ message:"Server failed to create user"})
                    })
                }else{
                    return res.status(404).send({message: "The account with this email already exist"})
                }
            }).catch((er) => {
                return res.status(500).send({message: " Failed to authenticate user"})
            });
            
        })
    }


// app.get("/login", (req, res)=>);
function login(req, res){
    const {email, password} = req.body;
    if(email.length === 0 || password.length === 0){
        return res.status(404).send({message: "You are trying to access your account without giving info"})
    }

    myUserModel.find({ useremail:email  })
    .then((data)=>{
        if(data.length === 0){
            return res.status(404).send({message: "User does not found, try to create new one"})
        }else{
            const oldUser = data[0];
            const isPasswordMatch = bcryptjs.compareSync(password, oldUser.password);
            if(isPasswordMatch === true){
                jsonwebtoken.sign({email:email}, process.env.SECRETKEY,{
                    expiresIn: 24 * 60 * 60,
                }, (error, result)=>{
                    if(error){
                        return res.status(500).send({message: "User failed to Authenticate"})
                    }

                    return res.status(200).send({
                        message:"user found successfully", 
                        data:oldUser, 
                        token: result,
                    })
                });
            }else{
                return res.status(404).send({
                    message: "User found but password is wrong"
                });
            }
        }
    }).catch((err)=>{
        return res.status(500).send({message: "Server failed to authenticate"})
    });
}

module.exports = {login, signup}
