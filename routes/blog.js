/**
 * Created by park on 11/17/2015.
 */
var Constants = require('../apps/constants');
exports.plugin = function(app, environment) {
    var self = this,
        isPrivatePortal = environment.getIsPrivatePortal(),
        BlogModel = environment.getBlogModel();
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
    app.get('/blog', isPrivate, function(req, res) {
        res.render('blogindex' , environment.getCoreUIData());
    });

    /**
     * GET blog index
     */
    app.get("/blog/index", isPrivate,function(req,res) {
        var start = parseInt(req.query.start);
        var count = parseInt(req.query.count);
        var userId= '';
        var userIP= '';
        var sToken= null;
        if (req.user) {credentials = req.user.credentials;}

        BlogModel.fillDatatable(start,count, userId, userIP, sToken, function blogFill(data, countsent, totalavailable) {
            console.log("Blog.index "+data);
            var cursor = start+countsent;
            var json = environment.getCoreUIData();
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.table = data;
            return res.render('blogindex', json);
        });
    });

    /**
     * GET new blog post form
     */
    app.get('/blog/new', isLoggedIn, function(req,res) {
        var data =  environment.getCoreUIData(req);
        data.formtitle = "New Blog Post";
        data.isNotEdit = true;
        return res.render('blogform', data); //,
    });

    /**
     * Function which ties the app-embedded route back to here
     */
    var _blogsupport = function(body, usx, callback) {
        if (body.locator === "") {
            BlogModel.create(body, usx, function(err, result) {
                return callback(err, result);
            });
        } else {
            BlogModel.update(body, usx, function(err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new blog post
     */
    app.post('/blog', isLoggedIn, function(req, res) {
        var body = req.body;
        var usx = req.user;
        console.log('BLOG_NEW_POST '+JSON.stringify(usx)+' | '+JSON.stringify(body));
         _blogsupport(body, usx, function(err,result) {
            console.log('BLOG_NEW_POST-1 '+err+' '+result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect('/blog');
        });
    });

};