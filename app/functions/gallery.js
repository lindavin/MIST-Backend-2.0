
module.exports.buildFeaturedPage = function (req, res, database) {

    // there are 9 images on a page
    // might want to pull this out to a global variable
    database.getFeaturedImages(9, function (images, error) {
        if (error) {
            //res.redirect("/404");
            res.redirect("/");
        }
        else {
            res.render('gallery', {
                user: req,
                userData: req.user,
                //user: req.user,
                images: images,
                //images: imageArray,
                nextPage: false,         // featured is one page long
                currentPage: 1,
                type: "featured"
            }
            );
        }
    });
};