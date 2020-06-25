/**
 * api.js
 *   Functions for handling requests to the API.
 */

// +-------+-----------------------------------------------------------
// | Notes |
// +-------+

/*
The API looks for actions specified by "funct" or "action" in
either GET or POST requests.  You should pass along the appropriate
object (body or whatever) to the run method, along with the request
and the response objects.  (Yes, the method needs a better name
than "run".)

In most cases, the handlers for the actions are found in
handlers.action (see the section about Handlers).  That way,
we can add another action to the API just by adding another
handler.
*/

// +--------------------+--------------------------------------------
// | Required Libraries |
// +--------------------+

var database = require('../database.js');

// +--------------------+--------------------------------------------
// | Exported Functions |
// +--------------------+

/**
* Run the API.
*/
module.exports.run = function (info, req, res) {
  // Support both Sam's and Alex's model of specifying what to do
  var action = info.action || info.funct;

  // Make sure that there's an action
  if (!action) {
    fail(res, "No action specified.");
  } // if there's no action

  // Deal with actions with a handler.
  else if (handlers[action]) {
    handlers[action](info, req, res);
  } // if (handlers[action])

  // Everything else is undefined
  else {
    fail(res, "Invalid action: " + action);
  } // invalid action
} // run

// +-----------+-------------------------------------------------------
// | Utilities |
// +-----------+

/**
 * Indicate that the operation failed.
 */
fail = function (res, message) {
  console.log("FAILED!", message);
  res.send(400, message);       // "Bad request"
} // fail

// +----------+--------------------------------------------------------
// | Handlers |
// +----------+

/**
 * The collection of handlers.
 */
var handlers = {};

// Note: Each handler should have parameters (info, req, res).

// Please keep each set of handlers in alphabetical order.

// +----------------+--------------------------------------------------
// | Image Handlers |
// +----------------+

/**
 * Check if an image exists (should be imagetitleexists)
 *   info.action: imageexists
 *   info.title: The title of the image
 */
handlers.imageexists = function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.send("logged out");
  } else {
    console.log("images under " + req.user.username + req.user.images);
    let exists = false;
    const arr = req.user.images.slice();
    arr.forEach((image) => {
      if (image.title === info.title) {
        exists = true;
        return;
      };
    });
    res.send(exists);

  }
};

/**
 * Save an image
 *   info.action: saveimage
 *   info.title: The title of the image
 *   info.code: the code of the image for display
 *   info.codeVisible: is the code visible (boolean)
 *   info.license: A license string
 *   info.public: is the image public (boolean)
 *   info.replace: Replace an existing image (boolean, optional)
 * Precondition : THe user should not already own an image by the same name
 */
handlers.saveimage = function (info, req, res) {
  if (!req.isAuthenticated()) {
    fail(res, "Could not save image because you're not logged in");
  }
  else if (!info.title) {
    fail(res, "Could not save image because you didn't title it");
  }
  else {
    // create the image object
    let image = new database.Image({
      title: database.sanitize(info.title),
      userId: req.user._id,
      code: database.sanitize(info.code),
      ratings: 0,
      createdAt: Date(),
      updatedAt: Date(),
      comments: [], // of (of comment _ids)
      flag: false,
      publicity: 0,
      caption: "",
      delete: false,
    });

    database.User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { images: image } },
      (err, writeUpResult) => {
        if (err) {
          console.log(err);
          fail(res, "Error: " + error);
        } else {
          // this needs to be fixed. we need to send something so that the popup can load the single-image page
          res.send(image);
        }
      }
    );
  }
}; // handlers.saveimage

// +--------------------+----------------------------------------------
// | Workspace Handlers |
// +--------------------+

/**
 * Check if an image exists
 *   info.action: wsexists
 *   info.title: The title of the image
 */
handlers.wsexists = function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.send("logged out");
  }
  else {
    // check if the user already has a workspace by the same name that they're trying to save it as.
    let workspaces = req.user.workspaces;
    let exists = false;
    workspaces.forEach(ws => {
      if (ws.name === info.name) {
        exists = true;
        return;
      }
    });
    res.send(exists);
  } // else
};

/**
* Save a workspace.
*   action: savews
*   name: the name of the workspace
*   data: The information about the workspace
*   replace: true or false [optional]
* Precondition:
* The user does not already own a workspace by the same name.
*/
handlers.savews = function (info, req, res) {
  if (!req.isAuthenticated()) {
    fail(res, "Could not save workspace because you're not logged in");
  }
  else if (!info.name) {
    fail(res, "Could not save workspace because you didn't title it");
  }
  else {

    // create the workspace object
    let workspace = new database.Workspace({
      name: database.sanitize(info.name),
      data: info.data,
      createdAt: Date(),
      updatedAt: Date(),
    }) // create workspace document object
    // save it to their array
    // find the user doc and embed the album object into the userdoc
    let query = database.User.updateOne(
      { _id: req.user._id },
      { $push: { workspaces: workspace } }
    )// create Mongoose query object

    query.exec((err, writeOpResult) => {
      //we need to change this callack
      if (err) {
        console.log("Failed to save workspace because", err);
        res.end(JSON.stringify(error));
      } else {
        console.log('operation result ' + writeOpResult);
        res.end();
      }
    })// execute query 
  }
} // handlers.savews



// +------------+------------------------------------------------------
// | Challenges |
// +------------+

/**
 * Submit a potential solution to a challenge.
 *   info.action: submitchallenge
 *   info.code: the code submitted by the client
 *   info.id: the id for the challenge
 */
handlers.submitchallenge = function (info, req, res) {
  //var query = "SELECT code FROM challenges WHERE name='"+database.sanitize(info.name)+"';";
  let query = database.Challenge.find({
    name: database.sanitize(info.name),
  });
  query.select("code");
  query.exec((err, challenges) => {
    if (err) {
      fail(res, "Error: " + err);
    } else {
      var answer = challenges[0].code.replace(/ /g, "");
      res.send(info.code == answer);
    }
  });
};


// +---------------+---------------------------------------------------
// | Miscellaneous |
// +---------------+

// +----------+--------------------------------------------------------
// | Comments |
// +----------+


// +------+------------------------------------------------------------
// | Flag |
// +------+

// when comments are rendered, use the objectId to send back to us
handlers.flagComment = (info, req, res) => {
  if (!req.isAuthenticated()) {
    res.send("logged out");
  }  
  else { 
    console.log(req.user);
      database.Comment.findByIdAndUpdate(info.commentId, 
        { $inc: {
          flagged : 1 }
        })
        .exec((err, result) => {
          if (err) {
            fail(res, "Error: " + err);
            console.log(err);
          } else {
            res.end("Comment " + info.commentId + " flagged.");
            console.log(result);
          }
      });
    }
}
