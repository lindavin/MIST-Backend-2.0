/**
 * Functions related to the index's gallery.
 */
var filedatabase;
module.exports.buildFeaturedPage = (function(req, res, database) {
  filedatabase=database;
  // module.exports.getFeaturedImages (4, function(images, error){
  //   res.render('index',{
  //     user: req.session.user,
  //     images: images
  //   });

  // });
  res.render('index', {
    user: req,
    userData : req.user,
  })
});

