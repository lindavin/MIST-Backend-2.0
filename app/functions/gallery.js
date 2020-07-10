

// builds top rated gallery page
module.exports.buildTopRatedPage = function (req, res, database) {
    database.getTopRated(9, req.params.pageNumber, function (images, nextPage, error) {
        if (error) {
            res.redirect("/404");
        }
        else {
            res.render('gallery', {
                user: req,
                userData: req.user,
                images: images,
                currentPage: req.params.pageNumber,
                nextPage: nextPage,
                type: "toprated"
            });
        }
    });
};

// builds recent gallery page
module.exports.buildRecentsPage = function (req, res, database) {
    database.getRecentImages(9, req.params.pageNumber, function (images, nextPage, error) {
        if (error) {
            res.redirect("/");
            //res.redirect("/404");
        }
        else {
            res.render('gallery', {
                user: req,
                userData: req.user,
                images: images,
                nextPage: nextPage,
                currentPage: req.params.pageNumber,  // mulitple pages long
                type: "recent"
            }
            );
        }
    });
};

// builds random gallery page
module.exports.buildRandomPage = function (req, res, database) {
    database.getRandomImages(9, function (images, error) {
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
                nextPage: false,
                currentPage: req.params.pageNumber,
                type: "featured"
            }
            );
        }
    });
};

// builds featured gallery page
module.exports.buildFeaturedPage = function (req, res, database) {
    // there are 9 images on a page
    database.getFeaturedImages(9, function (images, error) {
        if (error) {
            //res.redirect("/404");
            res.redirect("/");
        }
        else {
            res.render('gallery', {
                user: req,
                userData: req.user,
                images: images,
                nextPage: false,         // featured is one page long
                currentPage: 1,
                type: "featured"
            }
            );
        }
    });
};