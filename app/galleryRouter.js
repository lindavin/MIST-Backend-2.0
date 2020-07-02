module.exports = (app, database) => {
  const gallery = require('./functions/gallery');

  app.get('/gallery', (req, res) => {
    res.render('gallery', {
      user: req,
      userData: req.user,
      type: "",
      images: "",
      currentPage: "",
      nextPage: "",
    });
  })

  app.get('/gallery/random', (req, res) => {
    res.render('gallery', {
      user: req,
      userData: req.user,
      type: "",
      images: "",
      currentPage: "",
      nextPage: "",
    }); //renders the gallery
  })

  app.get('/gallery/featured', (req, res) => {
    gallery.buildFeaturedPage(req, res, database);
  })

  app.get('/gallery/recent', (req, res) => {
    res.render('gallery', {
      user: req,
      userData: req.user,
      type: "",
      images: "",
      currentPage: "",
      nextPage: "",
    }); //renders the gallery
  })

  app.get('/gallery/toprated', (req, res) => {
    res.render('gallery', {
      user: req,
      userData: req.user,
      type: "",
      images: "",
      currentPage: "",
      nextPage: "",
    }); //renders the gallery
  })

};
