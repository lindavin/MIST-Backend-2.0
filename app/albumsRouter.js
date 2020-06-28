module.exports = (app, database) => {
    const albums = require('./functions/albums');
    //const albumContents = require('./functions/album-contents');

    app.get("/user/:username/albums", (req, res) => {
        console.log('loading albums');
        if (req.isAuthenticated()) {
            albums.buildPage(req, res, database);
        } else {
            res.redirect("/login");
        }
    });

    app.post('/user/:username/albums', function (req,res) {
        if(req.body.newAlbumSubmit != null) {
          albums.createAlbum(req, res, database);
        };
      });
    
}