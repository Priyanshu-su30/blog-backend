const express = require('express');

const {newComment, getBlogSpecificComments, replyComment} = require("../controllers/commentController");
const{verifyUsingJWT} = require("../middleware/jwt");

const route = express.Router();
route.post("/newComment", newComment);
route.put("/replyComment", verifyUsingJWT, replyComment);
route.get("/getBlogSpecificComments", getBlogSpecificComments);

module.exports = route;