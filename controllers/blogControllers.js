const myBlogModel = require("../models/blogModel");
const cloudinary = require("cloudinary");
const { isEmpty } = require("../common/common");
const jsonwebtoken = require("jsonwebtoken");

cloudinary.config({
  cloud_name: "dryycfayi",
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

// app.get("/fetchSingleBlog", (req,res)=>)
function fetchSingleBlog(req, res) {
  const blogId = req.query;
  // userid = {id: "idjfks"} This id will refer to user id.
  if (Object.hasOwn(blogId, "id") === false && blogId.id.length === 0) {
    return res
      .status(404)
      .send({ message: "You forgot to tell which user's blog you want." });
  }

  myBlogModel
    .findById(blogId.id)
    .then((data) => {
      console.log(data);
      return res
        .status(200)
        .send({ message: "Blog fetched successfully", blogData: data });
    })
    .catch(() => {
      return res.status(500).send({ message: "Server failed to send blogs" });
    });
}

// app.get("/userSpecificBlogs", (req, res)=>)
function userSpecificBlogs(req, res) {
  const userid = req.query;
  // userid = {id: "idjfks"} This id will refer to user id.
  if (Object.hasOwn(userid, "id") === false && userid.id.length === 0) {
    return res
      .status(404)
      .send({ message: "You forgot to tell which user's blog you want." });
  }
  myBlogModel
    .find({
      userId: userid.id,
    })
    .then((data) => {
      return res
        .status(200)
        .send({ message: "Blog fetched successfully", blogData: data });
    })
    .catch(() => {
      return res.status(500).send({ message: "Server failed to send blogs" });
    });
}

// app.get('/getAllBlogs', (req, res) => )
function getAllBlogs(req, res) {
  console.log(req, "Hello");
  myBlogModel
    .find()
    .then((data) => {
      return res
        .status(200)
        .send({ message: "Blog fetched successfully", blogData: data });
    })
    .catch(() => {
      return res.status(500).send({ message: "Server failed to send blogs" });
    });
}

// app.delete("/deleteBlog", (req,res)=>)
function deleteBlog(req, res) {
  const blogId = req.query;
  // userid = {id: "idjfks"}

  if (Object.hasOwn(blogId, "id") === false && blogId.id.length === 0) {
    return res
      .result(404)
      .send({ message: "You forgot to tell which blog to delete" });
  }

  myBlogModel
    .findByIdAndDelete(blogId.id)
    .then(() => {
      return res.status(200).send({ message: "blog deleted successfully." });
    })
    .catch(() => {
      return res.status(404).send({ message: "Failed to delete blog." });
    });
}

// app.put("/updateBlog", uplaod.single("blogImage"),(req, res)=>)
function updateBlog(req, res) {
  const blogImage = req.file;
  const body = req.body;
  console.log(body);
  const blogId = req.query;
  // blogId = {id: "idjfks"}

  if (Object.hasOwn(blogId, "id") === false && blogId.id.length === 0) {
    return res
      .result(404)
      .send({ message: "You forgot to tell which blog to update" });
  }

  if (blogImage !== undefined) {
    cloudinary.v2.uploader
      .upload_stream((error, result) => {
        if (error !== undefined) {
          return res
            .status(500)
            .send({ message: "Server failed to uplaod image" });
        }

        if (isEmpty(body) === true) {
          myBlogModel
            .findByIdAndUpdate(blogId.id, { blogImage: result.url, ...body })
            .then(() => {
              return res
                .status(201)
                .send({ message: "Blog updated succesfully" });
            })
            .catch(() => {
              return res
                .status(404)
                .send({ message: "Required blog doesnt found" });
            });
        } else {
          myBlogModel
            .findByIdAndUpdate(blogId.id, { blogImage: result.url })
            .then(() => {
              return res
                .status(201)
                .send({ message: "Blog updated succesfully" });
            })
            .catch(() => {
              return res
                .status(404)
                .send({ message: "Required blog doesnt found" });
            });
        }
      })
      .end(blogImage.buffer);
  } else {
    myBlogModel
      .findByIdAndUpdate(blogId.id, { ...body })
      .then(() => {
        return res.status(201).send({ message: "Blog updated succesfully" });
      })
      .catch(() => {
        return res.status(404).send({ message: "Required blog doesnt found" });
      });
  }
}

// app.post("/newBlog", uplaod.single("blogImage"),(req, res)=>)
function newBlog(req, res) {
  const blogImage = req.file;
  const body = req.body;
  console.log(req.token);
  if (blogImage === undefined) {
    return res.status(404).send({ message: "You forgot to include image." });
  }

  jsonwebtoken.verify(req.token, process.env.SECRETKEY, (error, result) => {
    console.log(error, result);
    if (error !== null) {
      return res.status(404).send({ message: "Token verification failed." });
    }

    if (result !== undefined) {
      cloudinary.v2.uploader
        .upload_stream((error, result) => {
          if (error !== undefined) {
            return res
              .status(500)
              .send({ message: "Server failed to upload image." });
          }

          const newBlog = myBlogModel({
            blogImage: result.url,
            ...body,
          });
          newBlog
            .save()
            .then(() => {
              return res
                .status(201)
                .send({ message: "Congratulations for new blog." });
            })
            .catch(() => {
              return res
                .status(500)
                .send({ message: "Server failed to save blog." });
            });
        })
        .end(blogImage.buffer);
    }
  });
}

const obj = {
  newBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  userSpecificBlogs,
  fetchSingleBlog,
};
module.exports = obj;
