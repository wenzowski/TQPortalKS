/**
 * Created by park on 11/17/2015.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var BlogModel = environment.getBlogModel(),
        CommonModel = environment.getCommonModel(),
        helpers = new Help(environment);

    console.log("Blog "+BlogModel);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/blog","Blog");
    /////////////
    // Routes
    /////////////

    /**
     * GET blog index
     */
    app.get("/blog", helpers.isPrivate, function(req, res) {
        var start = parseInt(req.query.start),
            count = parseInt(req.query.count);
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("BLOGS "+start+" "+count);

        var userId= "",
            userIP= "",
            sToken= null;
        if (req.user) {credentials = req.user.credentials;}

        BlogModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Blog.index "+data);
            var cursor = start+countsent,
                json = environment.getCoreUIData(req);
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render("blogindex", json);
        });
    });

    app.get("/blog/:id", helpers.isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("GETBLOG "+q);
        if (q) {
            var userId = req.session[Constants.USER_ID],
                theUser = helpers.getUser(req);
                userIP = "",
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData(req);
                if (rslt.cargo) {
                    CommonModel.populateConversationTopic(rslt.cargo, theUser, "/blog/", userIP, sToken,
                                data, function bC(err, rslt) {
                        data = rslt;
                        console.log("BOOBOO "+JSON.stringify(data));
                    });
                }
                //TODO else flash error
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
     */
    app.get("/blognew", helpers.isLoggedIn, function(req, res) {
        var data =  environment.getCoreUIData(req);
        data.formtitle = "New Blog Post";
        data.isNotEdit = true;
        data.action = "/blog/new";
        return res.render("blogwikiform", data); //,
    });

    app.get("/blogedit", helpers.isLoggedIn, function(req, res) {
        //TODO
    });

    /**
     * Function which ties the app-embedded route back to here
     */
    var _blogsupport = function(body, userId, userIP, sToken,  callback) {
        if (body.locator === "") {
            BlogModel.createBlogPost(body, userId, userIP, sToken, function blsA(err, result) {
                return callback(err, result);
            });
        } else {
            BlogModel.update(body, userId, userIP, sToken, function blSB(err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new blog post
     */
    app.post("/blog/new", helpers.isLoggedIn, function(req, res) {
        var body = req.body,
            usx = req.session[Constants.USER_ID],
            usp = "",
            stok = req.session[Constants.SESSION_TOKEN];
        console.log("BLOG_NEW_POST "+JSON.stringify(usx)+" | "+JSON.stringify(body));
         _blogsupport(body, usx, usp, stok, function(err,result) {
            console.log("BLOG_NEW_POST-1 "+err+" "+result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect("/blog");
        });
    });

    app.post("/blog/edit", helpers.isLoggedIn, function(req, res) {
        //TODO
    });
};