module.exports = (app, database) => {
    const home = require("./functions/home.js");

    app.get('/', function (req, res) {
        home.buildFeaturedPage(req, res, database);
    });

    
}