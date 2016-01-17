/**
 * Created by park on 12/29/2015.
 */
var Constants = require('../apps/constants');
exports.plugin = function(app, environment) {
    var self = this,
        isPrivatePortal = environment.getIsPrivatePortal(),
        TagModel = environment.getTagModel(),
        CommonModel = environment.getCommonModel();

    function isPrivate(req, res, next) {
        if (isPrivatePortal) {
            if (req.isAuthenticated()) {
                return next();
            }
            return res.redirect('/login');
        } else {
            return next();
        }
    };

    function isLoggedIn(req, res, next) {
        if (environment.getIsAuthenticated()) {
            return next();
        }
        // if they aren't redirect them to the home page
        // really should issue an error message
        if (isPrivatePortal) {
            return res.redirect('/login');
        }
        return res.redirect('/');
    };

    function getUser(req) {
        var result = req.session[Constants.THE_USER];
        if (!result) {
            result = {};
            result.uName = Constants.GUEST_USER;
        }
        return result;
    };
    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/tag","Tags");
    /////////////
    // Routes
    /////////////

    app.get('/tag', isPrivate, function(req, res) {
        var start = parseInt(req.query.start);
        var count = parseInt(req.query.count);
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("BLOGS "+start+" "+count);

        var userId= '';
        var userIP= '';
        var sToken= null;
        if (req.user) {credentials = req.user.credentials;}

        TagModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Blog.index "+data);
            var cursor = start+countsent;
            var json = environment.getCoreUIData();
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render('tagindex', json);
        });
    });

    app.get('/tag/:id', isPrivate, function(req, res) {
        var q = req.params.id;
        console.log("GETTAG "+q);
        if (q) {
            var userId = req.session[Constants.USER_ID],
                userIP = '',
                theUser = getUser(req),
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData();
                if (rslt.cargo) {
                    data = CommonModel.populateTopic(rslt.cargo, theUser);
                }
                return res.render('topic', data);
            });
        } else {
            //That's not good!
            //TODO
        }
    });
};