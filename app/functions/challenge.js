/**
* challenge.js
*   Functions for handling challenge pages.
*/

var utils = require('./utils.js');

// +-----------+-------------------------------------------------------
// | Utilities |
// +-----------+



// +--------------------+--------------------------------------------
// | Exported Functions |
// +--------------------+

/**
 * The api for adding challenges.
 */
module.exports.add = function (req, res, database, info) {
    // name is the url route
    // title is what is shown
    let challenge = new database.Challenge({
        category: database.sanitize(info.category),
        position: database.sanitize(info.position),
        title: database.sanitize(info.title),
        name: database.sanitize(info.name),
        description: database.sanitize(info.description),
        code: database.sanitize(info.code),
        rating: 0,
    });// create new challenge

    // we need to check that there isn't already challenge with the same name.

    // need to check if this is actually safe to do
    challenge.save()
        .then(doc => {
            console.log(doc)
        })
        .catch(err => {
            console.error(err)
        });

}; // add

/**
 * A form for editing challenges.
 */
module.exports.edit = function (req, res, database) {
    res.send("Editing challenges is not yet implemented.");
}; // edit

module.exports.gallery = function (req, res, database, info) {

    let level = database.sanitize(info.level || "Beginning");
    let color = database.sanitize(info.color || "Greyscale");
    let animation = database.sanitize(info.animation || "Static");
    let category = level + ", " + color + ", " + animation;

    let query = database.Challenge.find({
        category: category,
    });

    // since we only need the name title and code
    query.select("name title code")

    query.exec((err, challenges) => {
        console.log(challenges);
        // Sanity check
        if (err) {
            res.send(error);
            return;
        };
        // We got a result, so render it
        res.render('challenge-gallery', {
            user: req.session.user,
            challenge: {},
            level: level,
            color: color,
            animation: animation,
            sample: [
                { id: 1, name: "First", code: "x" },
                { id: 9, name: "Second", code: "y" }
            ],
            challenges: challenges,
        }); // res.render
    });// execute query
}; // gallery

/**
 * The page for showing challenges.
 */
module.exports.view = function (req, res, database) {
    let name = database.sanitize(req.params.name);
    console.log(name);
    // // First try to query by name
    // var query = "SELECT title,description,code FROM challenges WHERE name='"
    //     + TITLE + "';";
    let query = database.Challenge.find({
        name: name
    });

    // since we only need title description and code fields
    query.select("title description code");

    query.exec((err, challenges) => {
        console.log(challenges);
        // Sanity check 1
        if (err) {
            utils.error(req, res, "Database problem", error);
            return;
        }; // if (error)

        // Make sure that we have a row.
        if (challenges.length > 0) {
            console.log("Rendering by name", challenges[0]);
            res.render('view-challenge.ejs', {
                user: req,
                challenge: challenges[0]
            }); // render
            return;
        }; // if (rows.length > 0)

    });

    return;
};
