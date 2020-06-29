/**
 * albumContents.js
 *   Functions related to the album contents.
 */

// +---------------------+---------------------------------------------
// | Required Javascript |
// +---------------------+

var utils = require('./utils.js');

// +-----------+-------------------------------------------------------
// | Functions |
// +-----------+

var setLikes = function (imageArray, userID, callback) {
  if (imageArray.length == 0)
    callback([]);
  else {
    callback(imageArray);
  }
  //STUB
}

module.exports.buildPage = (req, res, database) => {
  database.getIDforUsername(req.params.username,
    (userid, error) => {
      if (error) {
        res.end("Error:" + error);
        return;
      }
      database.albumContentsInfo(userid, req.params.albumid,
        function (albumContents, error) {
          if (error) {
            res.end(error)
            return;
          }

          console.log('This is the album document: ' + albumContents);
          console.log('This is the album\'s name: ' + albumContents.name);
          
          console.log('Here are its images ' + albumContents.images);
          
          res.render('album-contents', {
            user: req.user,
            album: {
              contents: albumContents.images,
              title: albumContents.name,
              owner: req.params.username,
            },
          }); //render

          // setLikes(albumContents, (req.user) ? req.user._id : null, function (album) {
          //   res.render('album-contents', {
          //     user: req.user,
          //     album: {
          //       contents: album.images,
          //       title: albumContents.name,
          //       owner: req.params.username,
          //     },
          //   }); //render
          // }); // setLikes


        }); // database.albumContentsInfo
    }); //database.getIDforUsername
}; //database.buildPage

module.exports.deleteAlbum = function (req, res, database) {
  database.deleteAlbum(req.user._id, req.params.albumid, function (success, error) {
    if (!success)
      res.end(JSON.stringify(error));
    else
      res.redirect('/user/' + req.params.username + '/albums');
  });
};

module.exports.deleteFromAlbums = function (req, res, database) {
  database.deleteFromAlbums(req.params.albumid, req.body.deleteImage, function (success, error) {
    if (!success)
      res.end(JSON.stringify(error));
    else
      res.redirect('back');
  });
};
