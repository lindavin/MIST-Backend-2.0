module.exports = (app, database) => {
    const report = require('./report');
  
    app.get("/report", (req, res) => {
      report.buildPage(req, res, database);
    });
  
    app.post('/report', function (req, res) {
      if (req.body.createReport != null) {
        report.createReport(req, res, database);
      };
    });
  
  }