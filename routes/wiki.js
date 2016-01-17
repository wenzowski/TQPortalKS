/**
 * Created by park on 11/26/2015.
 */
var Constants = require('../apps/constants');
exports.plugin = function(app, environment) {
    var self = this,
        isPrivatePortal = environment.getIsPrivatePortal(),
        WikiModel = environment.getWikiModel(),
        CommonModel = environment.getCommonModel();
    console.log("Wiki " + WikiModel);

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
        // if user is authenticated in the session, carry on
        return next();
        /*       console.log('ISLOGGED IN '+req.isAuthenticated());
         if (req.isAuthenticated()) {return next();}
         // if they aren't redirect them to the home page
         // really should issue an error message
         if (isPrivatePortal) {
         return res.redirect('/login');
         }
         return res.redirect('/'); */
        sd
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
    environment.addApplicationToMenu("/wiki", "Wiki");
    /////////////
    // Routes
    /////////////

    /**
     * Initial fetch of the /blog landing page
     */
    app.get('/wiki', isPrivate, function (req, res) {
        res.render('wikiindex', environment.getCoreUIData());
    });

    /**
     * GET blog index
     */
    app.get("/wiki/index", isPrivate, function (req, res) {
        var start = parseInt(req.query.start);
        var count = parseInt(req.query.count);
        var userId = '';
        var userIP = '';
        var sToken = null;
        if (req.user) {
            credentials = req.user.credentials;
        }

        WikiModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(data, countsent, totalavailable) {
            console.log("Wiki.index " + data);
            var cursor = start + countsent;
            var json = environment.getCoreUIData();
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.table = data;
            return res.render('wikiindex', json);
        });
    });

    app.get('/wiki/:id', isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("GETWIKI"+q);
        if (q) {
            var userId = req.session[Constants.USER_ID],
                userIP = '',
                theUser = getUser(req),
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData();
                if (rslt.cargo) {
                    //TODO populateConversationTopic
                    data = CommonModel.populateTopic(rslt.cargo, theUser);
                }
                data.locator = q;
                if (contextLocator && contextLocator !== "") {
                    data.context = contextLocator;
                } else {
                    data.context = q; // we are talking about responding to this blog
                }
                return res.render('topic', data);
            });
        } else {
            //That's not good!
            //TODO
        }
    });
    /**
     * GET new wiki post form
     */
    app.get('/wiki/new', isLoggedIn, function (req, res) {
        var data = environment.getCoreUIData(req);
        data.formtitle = "New Wiki Topic";
        data.isNotEdit = true;
        return res.render('blogform', data); //,
    });

    /**
     * Function which ties the app-embedded route back to here
     */
    var _blogsupport = function (body, usx, callback) {
        if (body.locator === "") {
            WikiModel.createWikiTopic(body, usx, function (err, result) {
                return callback(err, result);
            });
        } else {
            BlogModel.update(body, usx, function (err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new blog post
     */
    app.post('/wiki', isLoggedIn, function (req, res) {
        var body = req.body;
        var usx = req.user;
        console.log('WIKI_NEW_POST ' + JSON.stringify(usx) + ' | ' + JSON.stringify(body));
        _blogsupport(body, usx, function (err, result) {
            console.log('WIKI_NEW_POST-1 ' + err + ' ' + result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect('/blog');
        });
    });
};