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
      res.redirect("/logged");
    }
  });

  app.post(
    "/login",
    passport.authenticate("login", {
      successRedirect: "/logged",
      failureRedirect: "/login"
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
