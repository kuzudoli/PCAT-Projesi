const express = require('express');
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const methodOverride = require("method-override");//Override POST request to PUT request
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const Photo = require("./models/Photos");
const { redirect } = require('express/lib/response');

const app = express();

//Connect DB
mongoose.connect("mongodb://localhost/pcat-db");

//Template Engine
app.set("view engine","ejs");

//Middlewares
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))//parses incoming request's body
app.use(express.json())//converts encoded body data to json
app.use(fileUpload());
app.use(methodOverride('_method',{
    methods:['POST','GET']
}));

//GET REQUESTS
//Index
app.get('/',async(req,res) => {
    const photos = await Photo.find({}).sort('-dateCreated') //Get data for render
    res.render("index",{
        photos
    });
})

//About
app.get('/about',(req,res) => {
    res.render("about");
})

//New photo
app.get('/add',(req,res) => {
    res.render("add");
})

//Single page photo details
app.get('/photos/:id', async(req,res) => {
    const photo = await Photo.findById(req.params.id) //Get data for render
    res.render("photo",{
        photo
    });
})

//Photo edit page
app.get('/photos/edit/:id', async(req,res) => {
    const photo = await Photo.findById(req.params.id)
    res.render("edit",{
        photo
    });
})
//GET REQUESTS END

//POST REQUESTS
//New photo
app.post("/photos",async(req,res)=>{
    const uploadDir = "public/uploads";
    
    //folder uploads exist?
    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }

    let uploadedImage = req.files.image;
    let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;
    
    //saves in server
    uploadedImage.mv(uploadPath,async()=>{
        await Photo.create({
            ...req.body,
            image:'/uploads/' + uploadedImage.name
        })
        res.redirect("/");
    })
});

//Update photo
app.put('/photos/:id', async(req,res) => {
    const photo = await Photo.findById(req.params.id) //Get data for render
    photo.title = req.body.title;
    photo.description = req.body.description;

    photo.save();//Updated

    res.redirect(`/photos/${req.params.id}`)
});

app.delete('/photos/:id',async(req,res)=>{
    const photo = await Photo.findById(req.params.id) //Get data for render
    let deletedImage = __dirname + "/public/" + photo.image;
    fs.unlinkSync(deletedImage);//Deletes image file from folder

    await Photo.findByIdAndRemove(req.params.id);//Deletes item
    res.redirect("/");
});

//POST REQUESTS END




//Server
const port = 3000;
app.listen(port, () => {
	console.log(`Sunucu ${port} portunda başlatıldı...`);
});
