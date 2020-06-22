/**
 * albums.js
 *   Functions related to the album.
 */


var setLikes = function (imageArray, userID, database, callback) {
  if (imageArray.length == 0)
    callback([]);
  else {
    var imageArrayClone = imageArray.slice(0, imageArray.length);
    var errorsArray = [];
    var likes = { counter: 0, likes: [] };
    for (var image = 0; image < imageArrayClone.length; image++) {
      (function (currentIndex) {
        database.hasLiked(userID, imageArrayClone[currentIndex].imageid, function (liked, error) {
          likes.likes[currentIndex] = liked;
          likes.counter++;
          if (likes.counter >= imageArray.length) {
            for (var i = 0; i < likes.likes.length; i++) {
              imageArrayClone[i].liked = likes.likes[i];
            }
            callback(imageArrayClone, errorsArray);
          }
          errorsArray.push(error);
        });
      })(image);
    }
  }
}

module.exports.buildPage = (req, res, database) => {
  // find the user document from the users collection
  const QUERY = database.User.findOne({
    username: req.user.username,
  });

  // retrieve that document
  QUERY.exec((err, user) => {
    if (err)
      res.end(JSON.stringify(error));
    else {
      console.log(user);
      res.render('albums', {
        user: req,
        userData: req.user,
        username: req.user.username,
        albums: user.albums,
      });
    };
  });

  // // render the albums page using the albums array under the user document
  // database.getIDforUsername(req.params.username,
  //   function (userid, error) {
  //     if (error)
  //       res.end(JSON.stringify(error));
  //     else
  //       database.albumsInfo(userid, function (albums, error) {
  //         if (error)
  //           res.end(JSON.stringify(error));
  //         else
  //           res.render('albums', {
  //             user: req.session.user,
  //             username: req.params.username,
  //             albums: albums
  //           });
  //       });
  //   });
};

module.exports.buildPageOld = function (req, res, database) {
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
              user: req.session.user,
              username: req.params.username,
              albums: albums
            });
        });
    });
};

module.exports.allImagesinAlbum = function (req, res, database) {
  database.getIDforUsername(req.params.username,
    function (userid, error) {
      if (error)
        res.end(JSON.stringify(error));
      else
        database.getAllImagesforUser(userid, function (images, error) {
          if (error)
            res.end(JSON.stringify(error));
          else
            setLikes(images, (req.session.user) ? req.session.user.userid : null, database, function (imageArray) {
              res.render('full-gallery', {
                user: req.session.user,
                images: imageArray || images,
                username: req.params.username
              });
            });
        });
    });
};

module.exports.createAlbum = function (req, res, database) {
  // later change back to user_id
  // for now we use username
  database.createAlbum(req.user.username, req.body.newAlbum, function (success, error) {
    if (!success) {
      console.log("Failed to create album because", error);
      res.end(JSON.stringify(error));
    }
    else {
      res.redirect('back');
    }
  });
};
