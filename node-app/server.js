"use strict";
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const db = "mongodb://localhost:27017";
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const db = require("./config/key").url;
const passport = require("passport");
const bodyParser = require("body-parser");
//db config
// console.log("ss", ss)
mongoose.set('useFindAndModify', false); //全局选项选择使用MongoDB驱动程序的功能。
mongoose.connect(db, { useNewUrlParser: true }).then(() => console.log("mongoos connet")).catch(err => console.log(err))
app.get('/', (req, res) => {
        res.send('holle word')
    })
    //使用routers
    // 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport)
app.use("/api/users", users)
app.use("/api/profile", profile)
const prot = process.env.PORT || 5000;

app.listen(prot, () => {
    console.log(`server running on prot${prot}`);
})