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

  app.get('/about', (req,res) => {
    res.render('about', {
        user : req,
        userData : req.user
    });
  })

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

  app.get("/albums", (req, res) => {
    if (req.isAuthenticated()) {
      res.render("albums",{ 
        user : req,
        userData : req.user,
        username : req.user.username,
        albums : "",
      }, 
      );
    } else {
      res.redirect("/login");
    }
  });

  app.get('/me', function(req, res) {
    if (req.session.user){
    res.redirect("/user/"+req.session.user.username)
  }
  else {
    res.redirect("/");
  }
  });

  app.post('/me', function(req,res) {
    if(req.body.aboutSubmit != null) {
      profile.changeAboutSection(req, res, database);
    }
  });

  app.listen(5000, () => {
    console.log("listening on 5000..");
  });
};
