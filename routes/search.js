/**
 * Created by park on 11/27/2015.
 */
var Constants = require('../apps/constants');

exports.plugin = function(app, environment) {
    var self = this,
        isPrivatePortal = environment.getIsPrivatePortal(),
        SearchModel = environment.getSearchModel();

    function isPrivate(req, res, next) {
        if (isPrivatePortal) {
            if (req.isAuthenticated()) {return next();}
            return res.redirect('/login');
        } else {
            return next();
        }
    };

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
    app.get('/search', isPrivate, function(req, res) {
        var data = environment.getCoreUIData();
        data.start=0;
        data.count=Constants.MAX_HIT_COUNT; //pagination size
        data.total=0;

        res.render('search' , data);
    });

    app.post('/search', function(req, res) {
        var q = req.params.id,
            start = parseInt(req.query.start),
            count = parseInt(req.query.count);
        //TODO req.user ???
        SearchModel.runSearch(q, req.user, "en", start, count, function searchRunSearch(data, countsent, totalavailable) {
           //TODO
        });
    });
};