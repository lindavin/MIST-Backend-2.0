
module.exports = (app, passport) => {

  app.get('/signup', (req,res) => {
      res.render('signup', {
          user : req,
          message : req.flash("message")
      });
  })

  app.post('/signup', 
  passport.authenticate("signup", {
    successRedirect: "/login",
    failureRedirect: "/signup",
    failureFlash : true
  })
  )

  app.get('/', (req,res) => {
      res.render('about', {
          user : req,
          userData : req.user
      });
  })

  app.get("/login", (req, res) => {
    if (!req.isAuthenticated()) {
      res.render("login", {message : req.flash('message')});
    } else {
      res.redirect("/logged");
    }
  });

  app.post(
    "/login",
    passport.authenticate("login", {
      successRedirect: "/logged",
      failureRedirect: "/login",
      failureFlash : true 
    })
  );

  app.get("/logged", (req, res) => {
    if (req.isAuthenticated()) {
      res.render("logged");
    } else {
      res.redirect("/signup");
    }
  });

  app.listen(5000, () => {
    console.log("listening on 5000..");
  });
};
