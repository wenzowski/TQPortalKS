/**
 * Created by park on 11/26/2015.
 */
exports.plugin = function(app, environment) {
    var myEnvironment = environment;

    /////////////////
    // Menu
    /////////////////
    myEnvironment.addApplicationToMenu("/research","Research");
    /////////////////
    // Routes
    /////////////////
    app.get('/research', function webResearchGet(req, res) {

        res.render('webresearch', myEnvironment.getCoreUIData());
    });
}