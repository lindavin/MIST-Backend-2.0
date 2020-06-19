module.exports = (app, database) => {
    
    app.get("/me", (req, res) => {
        if (req.isAuthenticated()) {
          res.redirect("/me/" + req.user.username);
        } else {
          res.redirect("/login");
        }
      })

      app.get("/me/:username", (req, res) => {
        res.render("profile", {
          user: req,
          userData : req.user
        })
      })

    
}