module.exports = (app, database) => {

    const image = require('./functions/single-image');
    app.get('/image/:imageid', function (req, res) {
        image.buildPage(req, res, database);
    });

}