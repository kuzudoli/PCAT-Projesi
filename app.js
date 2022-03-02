const express = require('express');
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const methodOverride = require("method-override");//Override POST to PUT and DELETE requests

//Controllers
const photoController = require("./controllers/photoController");
const aboutController = require("./controllers/aboutController");

const app = express();

//Connect DB
mongoose.connect("mongodb+srv://kuzudoli:FfUIQq4VdVqTLzHR@cluster0.lx75i.mongodb.net/pcat-db?retryWrites=true&w=majority")
.then(()=>{
    console.log("DB Connected!")
}).catch((err)=>{
    console.log(err);
});

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

//**GET REQUESTS
app.get('/',photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto)
app.get('/add',photoController.getNewPhoto)
app.get('/photos/edit/:id', photoController.getEditPhoto)
app.get('/about',aboutController.getAbout)
//GET REQUESTS END**


//**POST REQUESTS
app.post("/photos",photoController.createNewPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id',photoController.deletePhoto);
//POST REQUESTS END**


//Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Sunucu ${port} portunda başlatıldı...`);
});
