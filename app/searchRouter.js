module.exports = (app, database) => {
const search = require('./functions/search');

//  app.get('/search', function(req, res) {
//     res.render("search", {
//       user: req.session.user,
//       results: results
//     });
//   });

//   app.get('/png/:imageid', function(req,res) {
//     png.build(req, res, database, req.query);
//   });

  app.get('/search', function(req, res) {
    search.buildPage(req, res, database);
  }); 

};