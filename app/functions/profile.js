/**
 * User's Profile page
 */
module.exports.buildPage = function (req, res, database) {
	database.getIDforUsername(req.params.username, function (userid, error) {
		if (error)
			res.end(JSON.stringify(error)); // Error Landing page
		else
			database.getUser(userid, function (userObject, error) {
				if (userObject.featuredImage !== 0) {
					database.imageInfo(userid, userObject.featuredImage, function (featuredImage, error) {
						res.render('profile', {
							user: req.user,
							viewing: userObject,
							image: featuredImage,
						});
					});
				}
				else
					res.render('profile', {
						user: req.user,
						viewing: userObject,
						image: null,

					});
			});
	});
};

module.exports.changeAboutSection = function (req, res, database) {
	database.getIDforUsername(req.user.username, function (userid, error) {
		if (error)
			res.end(JSON.stringify(error));
		else
			database.changeAboutSection(req.user._id, req.body.aboutSection, function (success, error) {
				if (!success)
					res.end(JSON.stringify(error));
				else
					res.redirect('/me');
			});
	});
}