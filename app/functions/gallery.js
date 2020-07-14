const e = require("express");



// builds top rated gallery page
module.exports.buildTopRatedPage = function (req, res, database) {
    // if user is not logged in, show all images
    if (!req.user) {
        database.getTopRatedLoggedOut(9, req.params.pageNumber, function (images, nextPage, error) {
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
    } else {
        // Alternate function that doesn't show hidden images, but the user must be logged in 
        database.getTopRatedLoggedIn(req.user._id, 9, req.params.pageNumber, function (images, nextPage, error) {
            //database.getTopRated(9, req.params.pageNumber, function (images, nextPage, error) {
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
    }
};

// builds recent gallery page
module.exports.buildRecentsPage = function (req, res, database) {
    if (!req.user) {
        database.getRecentImagesLoggedOut(9, req.params.pageNumber, function (images, nextPage, error) {
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
    } else {
        database.getRecentImagesLoggedIn(req.user._id, 9, req.params.pageNumber, function (images, nextPage, error) {
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
    }
};

// builds random gallery page
module.exports.buildRandomPage = function (req, res, database) {
    if (!req.user) {
        database.getRandomImagesLoggedOut(9, function (images, error) {
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
    } else {
        database.getRandomImagesLoggedIn(req.user._id, 9, function (images, error) {
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
    }
};

// builds featured gallery page
module.exports.buildFeaturedPage = function (req, res, database) {
    if (!req.user) {
        // there are 9 images on a page
        database.getFeaturedImagesLoggedOut(9, function (images, error) {
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
    } else {
        // there are 9 images on a page
        database.getFeaturedImagesLoggedIn(req.user._id, 9, function (images, error) {
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
    }
};