/**
 * Functions related to the index's gallery.
 */
//var filedatabase;
//this still needs to build the featured page
module.exports.buildFeaturedPage = (function(req, res, database) {
  // filedatabase=database;
  // module.exports.getFeaturedImages (4, function(images, error){
  //   res.render('index',{
  //     user: req.session.user,
  //     images: images
  //   });

  // });

  database.getFeaturedImages(4, (images, error) => {
    res.render('index', {
      user: req,
      userData : req.user,
      images: images
    })
  })
  
});

