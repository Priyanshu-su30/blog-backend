const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require('./routes/commentRoutes');
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: 'https://starlit-creponne-768d70.netlify.app',
};

app.use(cors(corsOptions));

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
const port = 5000;
app.listen(port, () => {
  console.log("Server at 5000");
});