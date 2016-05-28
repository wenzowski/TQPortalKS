
/**
 * Created by park on 5/22/2016.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers"),
    Rpg = require("../apps/models/rpg_model");

exports.plugin = function(app, environment) {
    var RpgModel = new Rpg(environment);
        CommonModel = environment.getCommonModel(),
        helpers = new Help(environment);

    console.log("Blog "+BlogModel);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/rpg","Quests");
    /////////////
    // Routes
    /////////////

    /**
     * GET Quests index
     */
    app.get("/rpg", helpers.isPrivate, function(req, res) {
      //TODO more
      var data = environment.getCoreUIData(req);
      return res.render("rpg", json);
    });
