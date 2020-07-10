/**
 * Functions related to the index's gallery.
 */
module.exports.buildFeaturedPage = (function(req, res, database) {
  database.getFeaturedImages(4, (images, error) => {
    res.render('index', {
      user: req,
      userData : req.user,
      images: images
    })
  })
  
});

