/**
 * Created by park on 5/26/2016.
 */

var Help = require("./helpers/helpers"),
    Rpg = require("../apps/models/rpg_model");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        RpGModel = new Rpg(environment)

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/rpg","Quests");
    /////////////
    // Routes
    /////////////

    /**
     * GET blog index
     */
    app.get("/rpg", helpers.isPrivate, function(req, res) {
        var data =  environment.getCoreUIData(req);
        //TODO
        return res.render("rpg", data);
    });
};