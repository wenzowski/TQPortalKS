/**
 * Created by park on 5/28/2016.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers"),
    Qm = require("../apps/models/quest_model");

exports.plugin = function(app, environment) {
    var CommonModel = environment.getCommonModel(),
        helpers = new Help(environment),
        QuestModel = new Qm(environment);

    console.log("Quest "+QuestModel);

    // a Quest does not show on the Menu
    /////////////
    // Routes
    /////////////

    app.get("/quest/:id", helpers.isPrivate, function(req, res) {
      //TODO more

    });

    app.get("/questnew", helpers.isLoggedIn, function (req, res) {
        var data = environment.getCoreUIData(req);
        data.formtitle = "New Quest";
        data.isNotEdit = true;
        data.action = "/quest/new";
        return res.render("blogwikiform", data);
    });

    app.post("/quest/new", helpers.isLoggedIn, function (req, res) {
        var body = req.body;
            //usx = req.user;
        console.log("QUeST_NEW_POST " + JSON.stringify(body));
  //      _wikisupport(body, usx, function (err, result) {
  //          console.log("WIKI_NEW_POST-1 " + err + " " + result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect("/rpg");
  //      });
    });

};
