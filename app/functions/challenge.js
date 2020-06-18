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

    // database.query(query, function (rows, error) {
    //     // Sanity check 1
    //     if (error) {
    //         utils.error(req, res, "Database problem", error);
    //         return;
    //     } // if (error)

    //     // Make sure that we have a row.
    //     if (rows.length > 0) {
    //         console.log("Rendering by name", rows[0]);
    //         res.render('view-challenge.ejs', {
    //             user: req.session.user,
    //             challenge: rows[0]
    //         }); // render
    //         return;
    //     } // if (rows.length > 0)

    //     // If it's not a number, we can't search by numeric id
    //     if (isNaN(ID)) {
    //         utils.error(req, res, "Unknown challenge", "Challenge " + ID +
    //             " does not exist");
    //     } // if isNaN(id)

    //     // OKay, if we got to here, we didn't generate a page, so we should
    //     // try the other query
    //     var query = "SELECT title,description,code FROM challenges WHERE id="
    //         + ID + ";";
    //     console.log(query);
    //     database.query(query, function (rows, error) {
    //         // Sanity check 1
    //         if (error) {
    //             utils.error(req, res, "Database problem", error);
    //             return;
    //         } // if (error)

    //         // Make sure that we have a row.
    //         if (rows.length > 0) {
    //             console.log("Rendering by id", rows[0]);
    //             res.render('view-challenge.ejs', {
    //                 user: req.session.user,
    //                 challenge: rows[0]
    //             }); // render
    //             return;
    //         } // if (rows.length > 0)

    //         // If we got to here, we couldn't find the challenge.
    //         utils.error(req, res, "Unknown challenge", "Challenge " + ID +
    //             " does not exist.");
    //     }); // inner database.query
    // }); // outer database.query

    return;
};

module.exports.submission = function (req, res, database, info) {
    //need to set up sending of INFO
    var info = [ // submission
        ['userid', req.session.user.userid],
        ['code', quote(database.sanitize(info.code))]
    ];

    var id = database.sanitize(req.params.id); // challenge
    var query = "SELECT code FROM challenges WHERE id=" + id + ";";
    database.query(query, function (rows, error) {
        //positive match with 90% jpeg similarity
        if (error) {
            res.send(error);
            return;
        } // if error
        var similarity = 0;
        var code1 = MIST.sanitize(builtinsPattern, info.code);
        var code2 = MIST.sanitize(builtinsPattern, rows[0]['code']);
        var code1Parsed = MIST.parse(code1);
        var code2Parsed = MIST.parse(code2);
        //Find how MIST.render works with parsed code (mistui-animator.js)
        var rows = img1.width;
        var cols = img1.height;
        var d = new Date();
        var t = {
            s: d.getMilliseconds() / 500 - 1,
            m: (d.getSeconds() * 1000 + d.getMilliseconds()) / 30000 - 1,
            h: (d.getMinutes() * 60 + d.getSeconds()) / 1800 - 1,
            d: (d.getHours() * 60 + d.getMinutes()) / 720 - 1
        };
        var m = {
            x: MIST.mouseX,
            y: MIST.mouseY,
            X: MIST.clickX,
            Y: MIST.clickY
        };
        var fun1 = MIST.expToRGB("untitled image", code1Parsed, context); // NEED CONTEXT VARIABLE
        // Evaluate the function
        var rgb = fun(x, y, t, m);
        for (var i = 0; i < rows; i += 4) //y
        {
            for (var j = 0; j < cols; j += 4) //x
            {
                var pixel1 = [0, 0, 0];
                var pixel2 = [0, 0, 0];
                var diffR = abs(pixel2[0] - pixel1[0]);
                var diffG = abs(pixel2[1] - pixel1[1]);
                var diffB = abs(pixel2[2] - pixel1[2]);
                // apply how MIST render works with code
                if (diffR < .01 && diffG < .01 && diffB < .01) {
                    similarity++;
                }
            }
        }
        if (similarity >= (pixelData1.length * .9)) {
            //res.redirect(); // need to redirect to a submission correct page
        }
        else {
            //res.redirect(); // need to redirect to a submission incorrect page
        }
        console.log(code);
    })
};
