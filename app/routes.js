module.exports = (app, passport, database) => {
  app.get("/signup", (req, res) => {
    res.render("index");
  });

  app.get('/signup', (req,res) => {
      res.render('signup', {
          user : req
      });
  })

  app.post('/signup', 
  passport.authenticate("signup", {
    successRedirect: "/login",
    failureRedirect: "/signup"
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
      res.render("login");
    } else {
      res.redirect("/");
    }
  });

  app.post(
    "/login",
    passport.authenticate("login", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.listen(5000, () => {
    console.log("listening on 5000..");
  });
};
