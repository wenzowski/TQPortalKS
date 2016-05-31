/**
 * Created by park on 11/16/2015.
 * A container for all things related to applications
 * Booted in app.js
 */
var Req = require("./models/drivers/http_request"),
    Blog = require("./models/blog_model"),
    Bm = require("./models/bookmark_model"),
    Common = require("./models/common_model"),
    Admin = require("./models/admin_model"),
    Conver = require("./models/conversation_model"),
    Kan = require("./models/kanban_model"),
    Tag = require("./models/tag_model"),
    Srch = require("./models/search_model"),
    Usr = require("./models/user_model"),
    Gm = require("./models/guild_model"),
    Qm = require("./models/quest_model"),
    Wiki = require("./models/wiki_model"),
    Tdrvr = require("./models/drivers/topic_driver"),
    Udrvr = require("./models/drivers/user_driver"),
    fs = require("fs"),
    Environment,
//TODO defaults will be replaced by config.json values
    defaults = {
        server: {
            host: "localhost",
            port: 9200
        }
    };

Environment = function() {
     var self = this,
         configProperties,
         commonModel,
         adminModel,
         blogModel,
         bookmarkModel,
         conversationModel,
         kanbanModel,
         tagModel,
         userModel,
         wikiModel,
         questModel,
         guildModel,
         searchModel,
         topicDriver,
         userDriver,
         backsideURL,
     //view data
         appMenu,
         isAuthenticated,
         isAdmin,
         isInvitationOnly,
         theMessage,
         userEmail;
    var path = __dirname+"/../config/config.json";
    configfile = fs.readFileSync(path);
        configProperties = JSON.parse(configfile);
        console.log("CONFIG "+JSON.stringify(configProperties));
        backsideURL = "http://"+configProperties.backsideHost+":"+configProperties.backsidePort+"/";
        isInvitationOnly = configProperties.invitationOnly;


    console.log("Envirionment starting "+configProperties);

    /**
     *
     * @param callback signature err
     */
    self.init = function(callback) {
        console.log("Environment initializing");
        var err;
        topicDriver = new Tdrvr(this);
        userDriver = new Udrvr(this);
        //have drivers, now app models
        commonModel = new Common(this);
        adminModel = new Admin(this);
        blogModel = new Blog(this);
        bookmarkModel = new Bm(this);
        conversationModel = new Conver(this);
        kanbanModel = new Kan(this);
        tagModel = new Tag(this);
        userModel = new Usr(this);
        wikiModel = new Wiki(this);
        questModel = new Qm(this);
        guildModel = new Gm(this);
        searchModel = new Srch(this);
        return callback(err);
    };

    //////////////////////
    // API
    //////////////////////
    self.addApplicationToMenu = function(url, name, isNew) {
        console.log("EnvAddApp "+name);
        if (!appMenu) {appMenu = [];}
        var urx = {};
        urx.url = url;
        urx.name = name;
        urx.isNew = isNew;
        appMenu.push(urx);
    };
    self.getApplicationMenu = function() {
        return appMenu;
    };
    self.setIsAuthenticated = function(truth) {
        isAuthenticated = truth;
    };


    self.getIsAuthenticated = function() {
        return isAuthenticated;
    };
    self.setIsAdmin = function(truth) {
        isAdmin = truth;
    };
    self.getIsAdmin = function(truth) {
        return isAdmin;
    };
    self.setMessage = function(msg) {
        theMessage = msg;
    };
    self.setUserEmail = function(email) {
        userEmail = email;
    };

    self.getCoreUIData = function (req) {
        var result = {};
        result.isAuthenticated = isAuthenticated;
        result.isAdmin = isAdmin;
        result.themessage = theMessage;
        result.email = userEmail;
        result.appmenu = appMenu;
        result.isInvitationOnly = isInvitationOnly;
        if (req.flash) {
            result.flashMsg = req.flash("error") || req.flash("success");
        }

        return result;
    };

    self.getBacksideURL = function() {
        return backsideURL;
    };

    self.getConfigProperties = function() {
        return configProperties;
    };

    self.getIsInvitationOnly = function() {
        return configProperties.invitationOnly;
    };

    self.getIsPrivatePortal = function() {
        return configProperties.portalIsPrivate;
    };

    self.getHttpClient = function() {
      //Create a fresh client for each user
      var result = new Req(defaults);
      //configure HttpClient to talk to BacksideServlet
      result.init(configProperties.backsideHost, configProperties.backsidePort);

      return result;
    };

    self.getTopicDriver = function() {
        return topicDriver;
    };

    self.getUserDriver = function() {
        return userDriver;
    };

    self.getSearchModel = function() {
        return searchModel;
    };

    self.getCommonModel = function() {
        return commonModel;
    };

    self.getAdminModel = function() {
        return adminModel;
    };

    self.getBlogModel = function() {
        return blogModel;
    };

    self.getBookmarkModel = function() {
        return bookmarkModel;
    };

    self.getTagModel = function() {
        return tagModel;
    };

    self.getKanbanModel = function() {
        return kanbanModel;
    };

    self.getUserModel = function() {
        return userModel;
    };

    self.getWikiModel = function() {
        return wikiModel;
    };

    self.getQuestModel = function() {
      return questModel;
    };

    self.getGuildModel = function() {
      return guildModel;
    };

    self.getConversationModel = function() {
        return conversationModel;
    };

    console.log("FOO ");
};

module.exports = Environment;
