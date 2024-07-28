const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require('./routes/commentRoutes');
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//parse application/jason
app.use(bodyParser.json());
app.use("/comment", commentRoutes);
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

const connectdb = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://buzzerbreaker909:${process.env.MONGOPASSWORD}@cluster0.cxu1w50.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Mongodb connected successfully");
  } catch (error) {
    console.log(error);
    console.log("Mongodb failed to connect");
  }
};

connectdb();

app.listen(5000, () => {
  console.log("Server at 5000");
});


//------------------

// const cloudinary = require('cloudinary');    

// const jsonwebtoken = require("jsonwebtoken");
// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// module.exports = upload;

// const myBlogSchema = new mongoose.Schema({
//     blogImage: String,
//     userId: String,
//     uploadeDate: Date,
//     h1: String,
//     p1: String,
//     h2: String,
//     p2: String,
//     h3: String,
//     p3: String,
// })

// const myBlogModel = mongoose.model("Blogs", myBlogSchema);


// cloudinary.config({ 
//     cloud_name: 'dryycfayi', 
//     api_key: process.env.APIKEY, 
//     api_secret: process.env.APISECRET
// });


// app.post("/newBlog", upload.single("blogImage"),(req, res)=>{
//     const blogImage = req.file;
//     const body = req.body;
//     console.log(body);
//     if (blogImage === undefined) {
//       return res.status(404).send({ message: "You forgot to include image." });
//     }
  
//     // jsonwebtoken.verify(req.token, process.env.SECRETKEY, (error, result) => {
//     //   console.log(error);
//     //   if (error !== null) {
//     //     return res.status(404).send({ message: "Token verification failed." });
//     //   }
  
//     //   if (result !== undefined) {
//         cloudinary.v2.uploader
//           .upload_stream((error, result) => {
//             if (error !== undefined) {
//               return res
//                 .status(500)
//                 .send({ message: "Server failed to upload image." });
//             }
  
//             const newBlog = myBlogModel({
//               blogImage: result.url,
//               ...body,
//             });
//             newBlog
//               .save()
//               .then(() => {
//                 return res
//                   .status(201)
//                   .send({ message: "Congratulations for new blog." });
//               })
//               .catch(() => {
//                 return res
//                   .status(500)
//                   .send({ message: "Server failed to save blog." });
//               });
//           })
//           .end(blogImage.buffer);
//       }
//     // }
// );
// })
// function newBlog(req, res) {    }    