const express = require('express');
const {getAllBlogs, fetchSingleBlog, updateBlog, deleteBlog, userSpecificBlogs, newBlog} = require("../controllers/blogControllers")

const upload = require("../middleware/multer");
const route = express.Router();

route.get("/getallblogs", getAllBlogs);
route.delete("/deleteBlog", deleteBlog);
route.get("/userSpecificBlogs",userSpecificBlogs);
route.get("/fetchSingleBlog",fetchSingleBlog);
route.put("/updateBlog", updateBlog);
route.post("/newBlog",  newBlog);

module.exports = route;