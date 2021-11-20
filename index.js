const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const sanitize =  require("express-mongo-sanitize");
const authApp = require('./authentication');
const userApp = require('./user');
const districtApp = require('./District');
const CardApp = require('./Card');


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("db connected")
});

const app = express();

app.use(express.json());
app.use(sanitize());

app.use("/api/auth", authApp)
app.use("/api/user", userApp)
app.use("/api/district", districtApp)
app.use("/api/card", CardApp)


app.listen(9999, () => {
    console.log('Server running');
});