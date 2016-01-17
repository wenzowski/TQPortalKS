/**
 * Created by park on 12/31/2015.
 * SESSION OBJECTS USED HERE:
 *  transclude = locator for node to transclude
 *  tevidence = locator for node to transclude as evidence
 */
var Constants = require('../apps/constants');

exports.plugin = function(app, environment) {
    var self = this,
        isPrivatePortal = environment.getIsPrivatePortal(),
        ConversationModel = environment.getConversationModel(),
        CommonModel = environment.getCommonModel();

    console.log("Conversation "+ConversationModel);

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
    environment.addApplicationToMenu("/conversation","Conversation");
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
    app.get("/conversation", isPrivate, function(req, res) {
        var start = parseInt(req.query.start);
        var count = parseInt(req.query.count);
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("Conversation "+start+" "+count);

        var userId= '';
        var userIP= '';
        var sToken= null;
        if (req.user) {credentials = req.user.credentials;}

        ConversationModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Conversation.index "+data);
            var cursor = start+countsent;
            var json = environment.getCoreUIData();
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render('conversationindex', json);
        });
    });

    app.get('/conversation/:id', isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("GETCON "+q);
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
                return res.render('ctopic', data);
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
    app.get('/conversationnew', isLoggedIn, function(req, res) {
        var query = req.query,
            data =  environment.getCoreUIData(req);
        data.formtitle = "New Conversation";
        data.nodeicon = "/images/ibis/map.png";
        data.nodetype = Constants.CONVERSATION_MAP_TYPE;
        data.isNotEdit = true;
        data.url = query.url;
        data.title = query.title;
        data.action = '/conversation/new';
        return res.render('conversationform', data); //,
    });

    /**
     * Capture <code>id</code> and save to Session for later transclusion
     */
    app.get('/conversationtransclude/:id', isLoggedIn, function(req, res) {
        var q = req.params.id;
        //TODO
    });

    /**
     * Capture <code>id</code> and save to Session for later transclusion as evidence
     */
    app.get('/conversationtranscludeevidence/:id', isLoggedIn, function(req, res) {
        var q = req.params.id;
        //TODO
    });

    ////////////////////////////////////
    // RESPONDING TO NODES WITH CONVERSATION
    // Based on buttons with an href, e.g.
    //  /newquestion/<someId>?contextLocator=<somecontextlocator>
    /////////////////////////////////////
    app.get('/newquestion/:id', isLoggedIn, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("NEWQUESTION "+q+" "+contextLocator);
        //TODO
    });

    app.get('/newanswer/:id', isLoggedIn, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("NEWANSWER "+q+" "+contextLocator);
        if (q) {
            var userId = req.session[Constants.USER_ID],
                theUser = req.session[Constants.THE_USER],
                userIP = '',
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData();
                if (rslt.cargo) {
                    //TODO ??? will populateTopic understand the need for MillerColumn?
                    data = CommonModel.populateTopic(rslt.cargo);
                }
                data.locator = q;
                return res.render('ctopic', data);
            });
        } else {
            //That's not good!
            //TODO
        }
    });
    app.get('/newpro/:id', isLoggedIn, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("NEWPRO "+q+" "+contextLocator);
        //TODO
    });
    app.get('/newcon/:id', isLoggedIn, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("NEWCON "+q+" "+contextLocator);
        //TODO
    });
    app.get('/newreference/:id', isLoggedIn, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("NEWREFERENCE "+q+" "+contextLocator);
        //TODO
    });

    /**
     * PROBABLY NOT USED in favor of newquestion,newanswer, ...
     * Create a conversation child node
     * where query is /conversationrespond/<type>:<locator>
     */
    app.get('conversationrespond/:type', isPrivate, function(req, res) {
        var q = req.params.type;
        var v = q.split(':');
        var type = v[0].trim(),
            lox = lox = v[1].trim();
        console.log("ConversationRespond "+type+" "+lox);
        //TPDP
    });

    app.get('conversationedit', isLoggedIn, function(req, res) {
        //TODO
    });

    /**
     * Function which ties the app-embedded route back to here
     */
    var _consupport = function(json, isPrivate, userId, userIP, sToken,  callback) {
        if (body.locator === "") {
            ConversationModel.create(json, isPrivate, userId, userIP, sToken, function blsA(err, result) {
                return callback(err, result);
            });
        } else {
            ConversationModel.update(json, userId, userIP, sToken, function blSB(err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new blog post
     */
    app.post('/conversation/new', isLoggedIn, function(req, res) {
        var body = req.body,
            usx = req.session[Constants.USER_ID],
            usp = '',
            stok = req.session[Constants.SESSION_TOKEN];
        console.log('BOOKMARK_NEW_POST '+JSON.stringify(usx)+' | '+JSON.stringify(body));
        _consupport(body, usx, usp, stok, function(err,result) {
            console.log('BOOKMARK_NEW_POST-1 '+err+' '+result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect('/bookmark');
        });
    });

    app.post('/bookmark/edit', isLoggedIn, function(req, res) {
        //TODO
    });
};