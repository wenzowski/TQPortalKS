/**
 * Created by park on 11/17/2015.
 */
var Constants = require('../apps/constants');
exports.plugin = function(app, environment) {
    var self = this,
        isPrivatePortal = environment.getIsPrivatePortal(),
        BlogModel = environment.getBlogModel(),
        CommonModel = environment.getCommonModel();

    console.log("Blog "+BlogModel);

    function isPrivate(req, res, next) {
        if (isPrivatePortal) {
            if (req.isAuthenticated()) {return next();}
            return res.redirect('/login');
        } else {
            return next();
        }
    };

    function isLoggedIn(req, res, next) {
        if (environment.getIsAuthenticated()) {return next();}
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
    environment.addApplicationToMenu("/blog","Blog");
    /////////////
    // Routes
    /////////////

    /**
     * Initial fetch of the /blog landing page
     */
  //  app.get('/blog', isPrivate, function(req, res) {
 //       res.redirect('blogindex');
 //   });

    /**
     * GET blog index
     */
    app.get("/blog", isPrivate, function(req, res) {
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

        BlogModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Blog.index "+data);
            var cursor = start+countsent;
            var json = environment.getCoreUIData();
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render('blogindex', json);
        });
    });

    app.get('/blog/:id', isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("GETBLOG "+q);
        if (q) {
            var userId = req.session[Constants.USER_ID],
                theUser = getUser(req);
                userIP = '',
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData();
                if (rslt.cargo) {
                    CommonModel.populateConversationTopic(rslt.cargo, theUser, '/blog/', userIP, sToken,
                                function bC(err, rslt) {
                        data = rslt;
                        console.log("BOOBOO "+data);
                    });
                }
                data.locator = q;
                if (contextLocator && contextLocator !== "") {
                    data.context = contextLocator;
                } else {
                    data.context = q; // we are talking about responding to this blog
                }
                return res.render('ctopic', data);
            });
        } else {
            //That's not good!
            //TODO
        }
    });
    /**
     * GET new blog post form
     */
    app.get('/blognew', isLoggedIn, function(req, res) {
        var data =  environment.getCoreUIData(req);
        data.formtitle = "New Blog Post";
        data.isNotEdit = true;
        data.action = '/blog/new';
        return res.render('blogwikiform', data); //,
    });

    app.get('blogedit', isLoggedIn, function(req, res) {
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
    app.post('/blog/new', isLoggedIn, function(req, res) {
        var body = req.body,
            usx = req.session[Constants.USER_ID],
            usp = '',
            stok = req.session[Constants.SESSION_TOKEN];
        console.log('BLOG_NEW_POST '+JSON.stringify(usx)+' | '+JSON.stringify(body));
         _blogsupport(body, usx, usp, stok, function(err,result) {
            console.log('BLOG_NEW_POST-1 '+err+' '+result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect('/blog');
        });
    });

    app.post('/blog/edit', isLoggedIn, function(req, res) {
        //TODO
    });
};