module.exports = (app, database) => {
    const challenge = require('./functions/challenge');

    app.get('/challenges', (req, res) => {
        challenge.gallery(req, res, database, req.query);//renders the gallery of challenges
    });

    app.get('/create', (req, res) => {
        res.render('create-challenge', {
            user: req,
            userData: req.user
        }); //renders the form to create a challenge
    });

    app.get('/view/:name', (req, res) =>{
        challenge.view(req, res, database);
    })

    app.post('/add', (req, res) => {
        console.log('Trying to add a new challenge.');
        challenge.add(req, res, database, req.body);
        res.redirect('/challenges/create');
    });

    
};

