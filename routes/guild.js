/**
 * Created by park on 5/28/2016.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers"),
    Gm = require("../apps/models/guild_model");

exports.plugin = function(app, environment) {
    var CommonModel = environment.getCommonModel(),
        helpers = new Help(environment),
        GuildModel = new Gm(environment);

    console.log("Guild "+GuildModel);

    // a Guild does not show on the Menu
    /////////////
    // Routes
    /////////////

    app.get("/guild/:id", helpers.isPrivate, function(req, res) {
      //TODO more

    });

    app.get("/guildnew", helpers.isLoggedIn, function (req, res) {
        var data = environment.getCoreUIData(req);
        data.formtitle = "New Guild";
        data.isNotEdit = true;
        data.action = "/guild/new";
        return res.render("blogwikiform", data);
    });

    app.post("/guild/new", helpers.isLoggedIn, function (req, res) {
        var body = req.body;
            //usx = req.user;
        console.log("GUILD_NEW_POST " + JSON.stringify(body));
  //      _wikisupport(body, usx, function (err, result) {
  //          console.log("WIKI_NEW_POST-1 " + err + " " + result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect("/rpg");
  //      });
    });
};
