module.exports = (app, passport, database) => {

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

  //------------------------------------------------

  app.get('/about', (req,res) => {
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


  app.get("/login", (req, res) => {
    if (!req.isAuthenticated()) {
      res.render("login", {message : req.flash('message')});
    } else {
      res.redirect("/");
    }
  });

  app.post(
    "/login",
    passport.authenticate("login", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash : true 
    })
  );

  //------------------------------------------------

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

  //------------------------------------------------

  app.get("/me", (req,res) => {
    if(req.isAuthenticated()) {
      res.redirect("/user/" + req.user.username);
    } else {
      res.redirect("/login");
    }
  })

  //------------------------------------------------

  app.get("/user/:username", (req, res) => {
    res.render("profile", {
      user : req.user
    })
  })

  //------------------------------------------------
   
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  const express = require('express');
  const challengeRouter = require('./challengesRouter')(express.Router(), database);
  const indexRouter = require('./indexRouter')(express.Router(), database);
  const galleryRouter = require('./galleryRouter')(express.Router(), database);

  app.use('/', indexRouter);
  app.use('/challenges', challengeRouter);
  app.use('/gallery', galleryRouter);
  

  app.listen(5000, () => {
    console.log("listening on 5000..");
  });
};
