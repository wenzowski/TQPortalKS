/**
 * Created by park on 11/17/2015.
 */

var Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment);
    console.log("Landing "+environment.getIsPrivatePortal());
    /////////////
    // Routes
    /////////////

    /**
     * Essentially, getOrCreate called by ajax
     * If available, returns json
     * Otherwise, opens an edit form
     */
    app.get("/", helpers.isPrivate, function(req, res) {
        var data = environment.getCoreUIData(req);
        data.title = "TQPortalKS";
        //return res.render('index',  data);
        return res.render("dragons", data);
    });

    app.post("/landing", helpers.isPrivate, function(req, res) {
        //TODO ???
    });
};