/**
 * Created by park on 11/27/2015.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        SearchModel = environment.getSearchModel();

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/search","Search");
    /////////////
    // Routes
    /////////////

    /**
     * Initial fetch of the /blog landing page
     */
    app.get("/search", helpers.isPrivate, function(req, res) {
        var query = req.query.srch-term,
            data = environment.getCoreUIData(req);
        data.start=0;
        data.count=Constants.MAX_HIT_COUNT; //pagination size
        data.total=0;

        res.render("search" , data);
    });

    app.post("/search", helpers.isPrivate,function(req, res) {
        var q = req.params.id,
            start = parseInt(req.query.start),
            count = parseInt(req.query.count);
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        //TODO req.user ???
        SearchModel.runSearch(q, req.user, "en", start, count, function searchRunSearch(data, countsent, totalavailable) {
           //TODO
        });
    });
};