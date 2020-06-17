module.exports = (router, database) => {
    const index = require("./functions/index.js");

    router.get('/', function (req, res) {
        index.buildFeaturedPage(req, res, database);
    });

    return router;
}