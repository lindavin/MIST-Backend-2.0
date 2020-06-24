module.exports = (app, database) => {

    const image = require('./functions/single-image');
    app.get('/image/:imageid', function (req, res) {
        image.buildPage(req, res, database);
    });

    app.post('/image/:imageid', function(req,res) {
        if(req.body.commentSubmit != null) {
          image.saveComment(req, res, database);
        }
        else if(req.body.delete != null) {
          image.deleteImage(req, res, database);
        }
        else if (req.body.add != null){
          image.addtoAlbum(req, res, database);
        }
        else if (req.body.profile != null){
          image.setProfilePicture(req, res, database);
        };
      });

}