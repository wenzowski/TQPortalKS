/**
 * Created by park on 11/26/2015.
 */
exports.plugin = function(app, environment) {
    /////////////////
    // Menu
    /////////////////
    environment.addApplicationToMenu("/dbpedia","DbPedia");
    /////////////////
    // router
    /////////////////
    app.get("/dbpedia", function dbPediaGet(req, res) {
        var data = environment.getCoreUIData();
        return res.render("dbpedia", data);
    });

};