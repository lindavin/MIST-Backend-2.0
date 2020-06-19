module.exports = (app, database) => {
    const gallery = require('./functions/gallery');

    app.get('/gallery', (req,res) => {
      res.render('gallery', {
          user : req,
          userData : req.user,
          type : "",
          images : "",
          currentPage : "",
          nextPage : "",
      });
    })

    app.get('/gallery/random', (req,res) => {
        res.render('gallery', {
            user : req,
            userData : req.user,
            type : "",
            images : "",
            currentPage : "",
            nextPage : "",
        }); //renders the gallery
      })

      app.get('/gallery/featured', (req,res) => {
        res.render('gallery', {
            user : req,
            userData : req.user,
            type : "",
            images : "",
            currentPage : "",
            nextPage : "",
        }); //renders the gallery
      })

      app.get('/gallery/recent', (req,res) => {
        res.render('gallery', {
            user : req,
            userData : req.user,
            type : "",
            images : "",
            currentPage : "",
            nextPage : "",
        }); //renders the gallery
      })

      app.get('/gallery/toprated', (req,res) => {
        res.render('gallery', {
            user : req,
            userData : req.user,
            type : "",
            images : "",
            currentPage : "",
            nextPage : "",
        }); //renders the gallery
      })

    /* 
    router.get('/featured', function(req, res) {
        gallery.buildFeaturedPage(req, res, database);
    });
    
      /* app.get('/recent', function(req, res) {
        res.redirect('/gallery/recent/1');
      });
    
      app.get('/recent/:pageNumber', function(req, res) {
        gallery.buildRecentsPage(req, res, database);
      });
    
      app.get('/toprated', function(req, res) {
        res.redirect('/gallery/toprated/1');
      });
    
      app.get('/toprated/:pageNumber', function(req, res) {
        gallery.buildTopRatedPage(req, res, database);
      });
*/ 

  
    
};
