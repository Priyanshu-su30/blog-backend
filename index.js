const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();
const app = express();

//parse application/jason
app.use(bodyParser.json());
app.use("/comment", commentRoutes);
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

const connectdb = async()=>{
    try {
        await mongoose.connect(`mongodb+srv://buzzerbreaker909:${process.env.MONGOPASSWORD}@cluster0.cxu1w50.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )
    console.log("Mongodb connected successfully");

    } catch (error) {
        console.log(error);
        console.log("Mongodb failed to connect");
    }

} 

connectdb();

// mongoose.connect("mongodb+srv://buzzerbreaker909:YspqpeIHA5MtTEvk@cluster0.oedtchg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// ).then(()=>{
//     console.log("Mongodb connected successfully");
// }).catch(()=>{
//     console.log("Mongodb failed to connect");
// })

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0ZXZlcm9nZXJzQGdtYWlsLmNvbSIsImlhdCI6MTcxNDE5ODU3OSwiZXhwIjoxNzE0Mjg0OTc5fQ.DOnm-fOGFibDkPJESROi6Vk1pI4D_mWqtXwA7Cla7ak



app.listen(5000, ()=>{
    console.log("Server at 5000");
});
