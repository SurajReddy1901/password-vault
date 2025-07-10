const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());

const authRoutes = require("./controllers/authController");
const vaultRoutes = require("./controllers/vaultController");

app.use("/api/auth", authRoutes)
app.use("/api/vault", vaultRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected!")
    app.listen(process.env.PORT, () => {
        console.log("Server Running on Port:", process.env.PORT);
    });
    
})
.catch(err => console.log("MongoDB Error:", err));

