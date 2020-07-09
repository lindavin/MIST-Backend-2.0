// buildPage function
module.exports.buildReportPage = function (req, res, database) {
    // will have to connect to front-end report page
    database.getIDforUsername(req.params.username,
        function (userid, error) {
            if (error)
                res.end(JSON.stringify(error));
            else
                res.render('report', {
                    user: req.user,
                });
        });

}

module.exports.createReport = function (req, res, database) {
    database.createReport(req, function (success, error) {
        if (!success) {
            console.log("Failed to create flag because " + error);
            res.end("Failed to create flag because of Error: " + error);
        }
        else {
            res.redirect('back');
        }
    });
};