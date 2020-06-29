module.exports = (app, database) => {
  const albums = require('./functions/albums');
  const albumContents = require('./functions/album-contents');

  app.get("/user/:username/albums", (req, res) => {
    albums.buildPage(req, res, database);
  });

  app.get('/user/:username/albums/:albumid', function (req, res) {
    albumContents.buildPage(req, res, database);
  });

  app.post('/user/:username/albums/:albumid', function (req, res) {
    if (req.body.deleteImage != null) {
      albumContents.deleteFromAlbums(req, res, database);
    }
    else if (req.body.deleteWholeAlbum != null) {
      albumContents.deleteAlbum(req, res, database);
    };
  });

  app.get('/user/:username/images', function (req, res) {
    albums.allImagesinAlbum(req, res, database);
  });

  app.post('/user/:username/albums', function (req, res) {
    if (req.body.newAlbumSubmit != null) {
      albums.createAlbum(req, res, database);
    };
  });

}