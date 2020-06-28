
module.exports.buildPage = function (req, res, database) {
    database.getIDforUsername(req.params.username,
        function (userid, error) {
            if (error)
                res.end(JSON.stringify(error));
            else
                database.albumsInfo(userid, function (albums, error) {
                    if (error)
                        res.end(JSON.stringify(error));
                    else
                        res.render('albums', {
                            user: req.user,
                            username: req.params.username,
                            albums: albums
                        });
                });
        });
};

// consider changing the callback function since success does not seem necessary
module.exports.createAlbum = function (req, res, database) {
    database.createAlbum(req.user._id, req.body.newAlbum, function (success, error) {
        if (!success) {
            console.log("Failed to create album because" + error);
            res.end(JSON.stringify(error));
        }
        else {
            res.redirect('back');
        }
    });
};
