const express = require('express');
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const Photo = require("./models/Photos");

const app = express();

//Connect DB
mongoose.connect("mongodb://localhost/pcat-db");

//Template Engine
app.set("view engine","ejs");

//Middlewares
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))//parses incoming request's body
app.use(express.json())//converts encoded body data to json

//GET
app.get('/',async(req,res) => {
    const photos = await Photo.find({}) //Get data for render
    res.render("index",{
        photos
    });
})

app.get('/about',(req,res) => {
    res.render("about");
})

app.get('/add',(req,res) => {
    res.render("add");
})

app.get('/photos/:id', async(req,res) => {
    const photo = await Photo.findById(req.params.id) //Get data for render
    res.render("photo",{
        photo
    });
})

//POST
app.post("/photos",async(req,res)=>{
    await Photo.create(req.body)
    res.redirect("/");
});






//Server
const port = 3000;
app.listen(port, () => {
	console.log(`Sunucu ${port} portunda başlatıldı...`);
});
