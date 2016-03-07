/**
 * Created by park on 11/17/2015.
 */

exports.plugin = function(app, environment) {
    console.log("Landing "+environment.getIsPrivatePortal());
    /////////////
    // Routes
    /////////////

    /**
     * Essentially, getOrCreate called by ajax
     * If available, returns json
     * Otherwise, opens an edit form
     */
    app.get("/", function(req, res) {
        var data = environment.getCoreUIData();
        data.title = "TQPortalKS";
        //return res.render('index',  data);
        return res.render('dragons', data);
    });

    app.post("/landing", function(req, res) {

    });
};