module.exports = (app, database) => {
    const index = require("./functions/index.js");

    app.get('/', function (req, res) {
        index.buildFeaturedPage(req, res, database);
    });

    
}