const fs = require("fs");
const fileUpload = require('express-fileupload');
const Photo = require("../models/Photos");

//GET all photos
exports.getAllPhotos = async (req,res) => {
    const photos = await Photo.find({}).sort('dateCreated')
    res.render("index",{
        photos
    });
};

//GET photo by id
exports.getPhoto = async(req,res) => {
    const photo = await Photo.findById(req.params.id)
    res.render("photo",{
        photo
    });
};

//GET edit photo by id
exports.getEditPhoto = async(req,res) => {
    const photo = await Photo.findById(req.params.id)
    res.render("edit",{
        photo
    });
};

//GET add new photo page
exports.getNewPhoto = (req,res) => {
    res.render("add");
};


//POST add new photo
exports.createNewPhoto = async(req,res)=>{
    const uploadDir = __dirname + "/../public/uploads";
    
    //folder uploads exist?
    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }

    let uploadedImage = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;
    
    //saves in server
    uploadedImage.mv(uploadPath,async()=>{
        await Photo.create({
            ...req.body,
            image:'/uploads/' + uploadedImage.name
        })
        res.redirect("/");
    })
};

//POST edit photo by id
exports.updatePhoto = async(req,res) => {
    const photo = await Photo.findById(req.params.id) //Get data for render
    photo.title = req.body.title;
    photo.description = req.body.description;

    photo.save();//Updated

    res.redirect(`/photos/${req.params.id}`)
};

//POST delete photo by id
exports.deletePhoto = async(req,res)=>{
    const photo = await Photo.findById(req.params.id) //Get data for render
    let deletedImage = __dirname + "/../public" + photo.image;
    fs.unlinkSync(deletedImage);//Deletes image file from folder

    await Photo.findByIdAndRemove(req.params.id);//Deletes item
    res.redirect("/");
};