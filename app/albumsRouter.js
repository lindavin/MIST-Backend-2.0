module.exports = (app, database) => {
  const albums = require('./functions/albums');
  //const albumContents = require('./functions/album-contents');

  app.get("/user/:username/albums", (req, res) => {
    albums.buildPage(req, res, database);
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