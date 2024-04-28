const myCommentModel = require('../models/commentModel');
const {isEmpty} = require("../common/common")
const jsonwebtoken = require('jsonwebtoken');

// app.get("/getBlogSpecificComments", (req, res)=>)
function getBlogSpecificComments(req, res) {
    const blogId = req.query;
    if(Object.hasOwn(blogId, "commentId") === false && blogId.blogId.length===0){
        return res.status(404).send({message: "You forgot to tell which blog's comment you want to fetch."})
    }

    myCommentModel.find({blogId: blogId.blogId}).then((data)=>{
        console.log(data);
        return res.status(200).send({message:"here are your comments", data:data})
    }).catch((error)=>{
        return res.status(500).send({message:"Server failed to fetch comments"})
    })
}


// app.put("/replyComment", verifyUsingJWT, (req, res)=>)
function replyComment(req,res){
    const body = req.body;
    const commentId = req.query;
    
    jsonwebtoken.verify(req.token, process.env.SECRETKEY, (error, result) =>{
        if(error == null){
            return res.status(404).send({message: "Token verification failed"})
        }
        if(result!=undefined){            

            if(Object.hasOwn(commentId, "commentId") === false && commentId.commentId.length===0){
                return res.status(404).send({message: "You forgot to tell which blog's comment you are writing."})
            }
    
            if(isEmpty(body)){
                return res.status(404).send({message: "you forgot to tell what repky you are writing."})
            }
    
            myCommentModel.findByIdAndUpdate(commentId.commentId, {...body}).then(()=>{
                return res.status(201).send({message:"Successfully stored your reply."})
            }).catch(()=>{
                return res.status(500).send({message:"Server failed to store your reply"})
            });
    
        }else{
            return res.status(404).send({message: "Token verification failed"})
        }
    })
}


// app.post("/newComment", (req, res)=>)
function newComment(req, res){
    const body = req.body;
    const blogId = req.query;
    console.log(body, blogId);
    // userid = {id: "idjfks"} This id will refer to user id. 
    if(Object.hasOwn(blogId, "blogId") === false && blogId.blogId.length===0){
        return res.status(404).send({message: "You forgot to tell which blog's comment you are writing."})
    }

    if(isEmpty(body)){
        return res.status(404).send({message: "you forgot to tell what comment you are writing."})
    }

    const newComment = myCommentModel({blogId: blogId.blogId, ...body})
    newComment.save().then(()=>{
        return res.status(201).send({message:"Successfully stored your comment."})
    }).catch(()=>{
        return res.status(500).send({message:"Server failed to store your comment"})
    });
}


module.exports= {newComment, getBlogSpecificComments, replyComment}