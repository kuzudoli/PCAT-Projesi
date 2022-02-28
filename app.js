const express = require('express');
const app = express();
const port = 3000;
const ejs = require("ejs");

const path = require("path");

//Template Engine
app.set("view engine","ejs");

//Middlewares
app.use(express.static("public"))

app.get('/',(req,res) => {
    res.render("index");
})

app.get('/about',(req,res) => {
    res.render("about");
})

app.get('/add',(req,res) => {
    res.render("add");
})

app.listen(port, () => {
	console.log(`Sunucu ${port} portunda başlatıldı...`);
});
