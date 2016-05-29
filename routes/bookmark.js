/**
 * Created by park on 12/31/2015.
 */

var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        BookmarkModel = environment.getBookmarkModel(),
        CommonModel = environment.getCommonModel();

    console.log("Bookmark "+BookmarkModel);

    function isLoggedIn(req, res, next) {
        if (environment.getIsAuthenticated()) {return next();}
        // if they aren't redirect them to the home page
        // really should issue an error message
        if (isPrivatePortal) {
            return res.redirect("/login");
        }
        return res.redirect("/");
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
    environment.addApplicationToMenu("/bookmark","Bookmark");
    /////////////
    // Routes
    /////////////
    // Bookmarklet
    // javascript:location.href='http://localhost:3000/bookmarknew?url='+
    //     encodeURIComponent(location.href)+'&title='+ encodeURIComponent(document.title)

    /**
     * GET blog index
     */
    app.get("/bookmark", helpers.isPrivate, function(req, res) {
        var start = parseInt(req.query.start),
            count = parseInt(req.query.count);
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("Bookmark "+start+" "+count);

        var userId= "",
            userIP= "",
            sToken= null,
            usx = helpers.getUser(req),
            credentials = usx.uRole;

        BookmarkModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Bookmark.index "+data);
            var cursor = start+countsent,
                json = environment.getCoreUIData(req);
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render("bookmarkindex", json);
        });
    });

    app.get("/bookmark/:id", helpers.isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("GETBLOG "+q);
        if (q) {
            var userId = req.session[Constants.USER_ID],
                theUser = getUser(req),
                userIP = "",
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData(req);
                if (rslt.cargo) {
                    data = CommonModel.populateTopic(rslt.cargo, theUser, data);
                }
                data.locator = q;
                if (contextLocator && contextLocator !== "") {
                    data.context = contextLocator;
                } else {
                    data.context = q; // we are talking about responding to this blog
                }
                return res.render("ctopic", data);
            });
        } else {
            //That's not good!
            //TODO
        }
    });
    /**
     * GET new blog post form
     * WE GET HERE FROM A BOOKMARKLET
     */
    app.get("/bookmarknew", helpers.isLoggedIn, function(req, res) {
        var query = req.query,
            data =  environment.getCoreUIData(req);
        data.formtitle = "New Bookmark";
        data.isNotEdit = true;
        data.url = query.url;
        data.title = query.title;
        data.action = "/bookmark/new";
        console.log("BM "+data.url);
        return res.render("blogwikiform", data); //,
    });

    app.get("/bookmarkedit", helpers.isLoggedIn, function(req, res) {
        //TODO
    });

    /**
     * Function which ties the app-embedded route back to here
     */
    var _bookmarksupport = function(body, userId, userIP, sToken,  callback) {
        if (body.locator === "") {
            BookmarkModel.createBookmark(body, userId, userIP, sToken, function blsA(err, result) {
                return callback(err, result);
            });
        } else {
            BookmarkModel.update(body, userId, userIP, sToken, function blSB(err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new blog post
     */
    app.post("/bookmark/new", helpers.isLoggedIn, function(req, res) {
        var body = req.body,
            userId = req.session[Constants.USER_ID],
            userIP = "",
            sToken = req.session[Constants.SESSION_TOKEN];
        console.log("BOOKMARK_NEW_POST "+JSON.stringify(body));
        _bookmarksupport(body, userId, userIP, sToken, function bP(err,result) {
            console.log("BOOKMARK_NEW_POST-1 "+err+" "+result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect("/bookmark");
        });
    });

    app.post("/bookmark/edit", helpers.isLoggedIn, function(req, res) {
        //TODO
    });
};
