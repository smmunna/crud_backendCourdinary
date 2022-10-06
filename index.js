const express = require('express');
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const cors = require('cors')
const port = 5000

// Connect DB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected Successfully"))
.catch(()=>console.log("MongoDB not Connected, Something Wrong"))

// Middleware to Parse Request our Body
app.use(express.json());
app.use(cors());

// Route
app.use('/user',require('./routes/user'));

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))