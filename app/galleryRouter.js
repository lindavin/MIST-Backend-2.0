module.exports = (app, database) => {
  const gallery = require('./functions/gallery');

  app.get('/gallery', (req, res) => {
    res.redirect('/gallery/random')
  })

  app.get('/gallery/random', (req, res) => {
    gallery.buildRandomPage(req, res, database);
  })

  app.get('/gallery/featured', (req, res) => {
    gallery.buildFeaturedPage(req, res, database);
  });

  app.get('/gallery/recent', (req, res) => {
    res.redirect('/gallery/recent/1');
  });

  app.get('/gallery/recent/:pageNumber', function (req, res) {
    gallery.buildRecentsPage(req, res, database);
  });

  app.get('/gallery/toprated', (req, res) => {
    res.redirect('/gallery/toprated/1');
  });

  app.get('/gallery/toprated/:pageNumber', function (req, res) {
    gallery.buildTopRatedPage(req, res, database);
  });
}