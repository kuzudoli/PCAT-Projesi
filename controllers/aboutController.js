//GET about page
exports.getAbout = (req,res) => {
    const currentPage = req.url;
    res.render("about",{
        currentPage: currentPage
    });
};