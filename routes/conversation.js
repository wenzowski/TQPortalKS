/**
 * Created by park on 12/31/2015.
 * SESSION OBJECTS USED HERE:
 *  transclude = locator for node to transclude
 *  tevidence = locator for node to transclude as evidence
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        ConversationModel = environment.getConversationModel(),
        CommonModel = environment.getCommonModel();

    console.log("Conversation "+ConversationModel);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/conversation","Conversation");
    /////////////
    // Routes
    /////////////

    /**
     * GET conversation index
     */
    app.get("/conversation", helpers.isPrivate, function(req, res) {
        var start = parseInt(req.query.start),
            count = parseInt(req.query.count);
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("Conversation "+start+" "+count);

        var userId= "",
            userIP= "",
            sToken= null,
            usx = helpers.getUser(req);
            credentials = usx.uRole;

        ConversationModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Conversation.index "+data);
            var cursor = start+countsent,
                json = environment.getCoreUIData(req);
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render("conversationindex", json);
        });
    });

    app.get("/conversation/:id", helpers.isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("GETCON "+q);
        if (q) {
            var userId = req.session[Constants.USER_ID],
                userIP = "",
                theUser = helpers.getUser(req),
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData(req);
                if (rslt.cargo) {
                    //TODO populateConversationTopic
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
          console.log("FOOIE "+q);
            //That's not good!
            //TODO
        }
    });
    /**
     * GET new blog post form
     * WE GET HERE FROM A BOOKMARKLET
     */
    app.get("/conversationnew", helpers.isLoggedIn, function(req, res) {
        var query = req.query,
            data =  environment.getCoreUIData(req);
        data.formtitle = "New Conversation";
        data.nodeicon = Constants.MAP;
        data.nodeType = Constants.CONVERSATION_MAP_TYPE;
        data.isNotEdit = true;
        data.url = query.url; //TODO likely not for here, for bookmarks
        data.title = query.title;
        data.action = "/conversation/new";
        return res.render("conversationform", data); //,
    });

    /**
     * Capture <code>id</code> and save to Session for later transclusion
     */
    app.get("/conversationtransclude/:id", helpers.isLoggedIn, function(req, res) {
        var q = req.params.id;
        //TODO
    });

    /**
     * Capture <code>id</code> and save to Session for later transclusion as evidence
     */
    app.get("/conversationtranscludeevidence/:id", helpers.isLoggedIn, function(req, res) {
        var q = req.params.id;
        //TODO
    });

    ////////////////////////////////////
    // RESPONDING TO NODES WITH CONVERSATION
    // Based on buttons with an href, e.g.
    //  /newquestion/<someId>?contextLocator=<somecontextlocator>
    /////////////////////////////////////
    app.get("/newquestion/:id", helpers.isLoggedIn, function(req, res) {
        var q = req.params.id, //parent locator
            contextLocator = req.query.contextLocator, // context loator
            data =  environment.getCoreUIData(req);
        data.formtitle = "New Question";
        data.nodeicon = Constants.ISSUE;
        data.nodeType = Constants.ISSUE_TYPE;
        data.parent = q;
        data.context = contextLocator;
        data.isNotEdit = true;
        data.action = "/conversation/new";
        return res.render("conversationform", data); //,

    });

    app.get("/newanswer/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id, //parent locator
          contextLocator = req.query.contextLocator, // context loator
          data =  environment.getCoreUIData(req);
      data.formtitle = "New Answer";
      data.nodeicon = Constants.POSITION;
      data.nodeType = Constants.POSITION_TYPE;
      data.parent = q;
      data.context = contextLocator;
      data.isNotEdit = true;
      data.action = "/conversation/new";
      return res.render("conversationform", data); //,

    });
    app.get("/newpro/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id, //parent locator
          contextLocator = req.query.contextLocator, // context loator
          data =  environment.getCoreUIData(req);
      data.formtitle = "New Pro Argument";
      data.nodeicon = Constants.PRO;
      data.nodeType = Constants.PRO_TYPE;
      data.parent = q;
      data.context = contextLocator;
      data.isNotEdit = true;
      data.action = "/conversation/new";
      return res.render("conversationform", data); //,
    });

    app.get("/newcon/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id, //parent locator
          contextLocator = req.query.contextLocator, // context loator
          data =  environment.getCoreUIData(req);
      data.formtitle = "New Con Argument";
      data.nodeicon = Constants.CON;
      data.nodeType = Constants.CON_TYPE;
      data.parent = q;
      data.context = contextLocator;
      data.isNotEdit = true;
      data.action = "/conversation/new";
      return res.render("conversationform", data); //,
    });
    app.get("/newreference/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id, //parent locator
          contextLocator = req.query.contextLocator, // context loator
          data =  environment.getCoreUIData(req);
      data.formtitle = "New Reference";
      data.nodeicon = Constants.REFERENCE;
      data.nodeType = Constants.REFERENCE_TYPE;
      data.isURL = true;
      data.parent = q;
      data.context = contextLocator;
      data.isNotEdit = true;
      data.action = "/conversation/new";
      return res.render("conversationform", data); //,
    });

    /**
     * PROBABLY NOT USED in favor of newquestion,newanswer, ...
     * Create a conversation child node
     * where query is /conversationrespond/<type>:<locator>
     */
    app.get("conversationrespond/:type", helpers.isPrivate, function(req, res) {
        var q = req.params.type,
            v = q.split(":"),
            type = v[0].trim(),
            lox = lox = v[1].trim();
        console.log("ConversationRespond "+type+" "+lox);
        //TPDP
    });

    app.get("/conversationedit", helpers.isLoggedIn, function(req, res) {
        //TODO
    });

    /**
     * Function which ties the app-embedded route back to here
     */
    var _consupport = function(json, isPrivate, userId, userIP, sToken,  callback) {
        if (json.locator === "") {
            ConversationModel.create(json, isPrivate, userId, userIP, sToken, function blsA(err, result) {
                return callback(err, result);
            });
        } else {
            ConversationModel.update(json, userId, userIP, sToken, function cl(err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new blog post
     */
    app.post("/conversation/new", helpers.isLoggedIn, function(req, res) {
        var body = req.body,
            userId = req.session[Constants.USER_ID],
            userIP = "",
            sToken = req.session[Constants.SESSION_TOKEN],
            isPrivate = false; //TODO
        console.log("CONVERSATION_NEW_POST "+JSON.stringify(body));
        _consupport(body, isPrivate, userId, userIP, sToken, function cP(err,result) {
            console.log("CONVERSATION_NEW_POST-1 "+err+" "+result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect("/conversation");
        });
    });

    app.post("/conversation/edit", helpers.isLoggedIn, function(req, res) {
        //TODO
    });
};
