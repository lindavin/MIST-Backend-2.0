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
  // STUB
}

module.exports.buildPage = function (req, res, database) {
  database.getIDforUsername(req.params.username,
    function (userid, error) {
      if (error) {
        res.end("Error:" + error);
        return;
      } else {
        database.getImagesFromAlbum(userid, req.params.albumid, (album, images, err)=> {
          if (err)
            res.end('Error: ' + err);
          else{
          res.render('album-contents', {
            user: req.user,
            album: {
              contents: images,
              title: album.name,
              owner: req.params.username
            }
          });
        }
        });
      }
    })


  /*
database.getIDforUsername(req.params.username,
  function (userid, error) {
    if (error) {
      res.end("Error:" + error);
      return;
    }
    database.albumContentsInfo(userid, req.params.albumid,
      function (albumDocument, error) {
        if (error) {
          res.end(error)
          return;
        }
        setLikes(albumDocument, (req.user) ? req.user.userid : null, function (images) {
          
          database.getAlbumInfo(req.params.albumid, function (albumInfo, error) {
            if (error) {
              utils.error(req, res, "Could not load album", error.toString());
              return;
            }
            res.render('album-contents', {
              user: req.user,
              album: {
                contents: images,
                title: albumInfo.name,
                owner: req.params.username
              }
            });
          }); // database.getAlbumInfo

        }); // setLikes
      }); // database.albumContentsInfo
  });
  */
}


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
