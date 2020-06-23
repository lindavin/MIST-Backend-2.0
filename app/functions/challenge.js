/**
* challenge.js
*   Functions for handling challenge pages.
*/

var utils = require('./utils.js');

// +-----------+-------------------------------------------------------
// | Utilities |
// +-----------+

/**
 * Put quotes around a string for MySQL.
 */
var quote = function (str) {
    return "'" + str + "'";
}; // quote

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
        createdAt: Date(),
        modifiedAt: Date(),
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

    const LEVEL = database.sanitize(info.level || "Beginning");
    const COLOR = database.sanitize(info.color || "Greyscale");
    const ANIMATION = database.sanitize(info.animation || "Static");
    const CATEGORY = LEVEL + ", " + COLOR + ", " + ANIMATION;

    const QUERY = database.Challenge.find({
        category: CATEGORY,
    });

    // since we only need the name title and code
    QUERY.select("name title code")

    QUERY.exec((err, challenges) => {
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
            level: LEVEL,
            color: COLOR,
            animation: ANIMATION,
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
    const NAME = database.sanitize(req.params.name);
    console.log(NAME);
    // // First try to query by name
    // var query = "SELECT title,description,code FROM challenges WHERE name='"
    //     + TITLE + "';";
    const QUERY = database.Challenge.find({
        name: NAME
    });

    // since we only need title description and code fields
    QUERY.select("title description code");

    QUERY.exec((err, challenges) => {
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
