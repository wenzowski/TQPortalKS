/**
 * Created by park on 11/16/2015.
 * A container for all things related to applications
 * Booted in app.js
 */
var Req = require('./models/drivers/http_request'),
    Blog = require('./models/blog_model'),
    Bm = require('./models/bookmark_model'),
    Common = require('./models/common_model'),
    Admin = require('./models/admin_model'),
    Conver = require('./models/conversation_model'),
    Kan = require('./models/kanban_model'),
    Tag = require('./models/tag_model'),
    Srch = require('./models/search_model'),
    Usr = require('./models/user_model'),
    Wiki = require('./models/wiki_model'),
    Tdrvr = require('./models/drivers/topic_driver'),
    Udrvr = require('./models/drivers/user_driver'),
    fs = require('fs'),
    url = require('url'),
//TODO defaults will be replaced by config.json values
    defaults = {
        server: {
            host: 'localhost',
            port: 9200
        }
    };

var Environment = function() {
     var self = this,
         configProperties,
         httpClient,
         commonModel,
         adminModel,
         blogModel,
         bookmarkModel,
         conversationModel,
         kanbanModel,
         tagModel,
         userModel,
         wikiModel,
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
    console.log("Envirionment starting "+httpClient);

    /**
     *
     * @param callback signature err
     */
    self.init = function(callback) {
        console.log("Environment initializing");
        var path = __dirname+"/../config/config.json";
        //read the config file
        fs.readFile(path, function environmentReadConfig(err, configfile) {
            configProperties = JSON.parse(configfile);
            if (process.env.BACKSIDE_URL) {
              var backside = url.parse(process.env.BACKSIDE_URL);
              configProperties.backsideHost = backside.hostname;
              configProperties.backsidePort = backside.port || (backside.protocol === 'https:' ? 443 : 80);
              configProperties.backsideProtocol = backside.protocol.slice(0, -1);
            }
            console.log('CONFIG '+JSON.stringify(configProperties));
            //boot in order of need
            //configure HttpClient to talk to BacksideServlet
            httpClient = new Req(configProperties.backsideHost, configProperties.backsidePort, configProperties.backsideProtocol);
            topicDriver = new Tdrvr(self);
            userDriver = new Udrvr(self);
            //have drivers, now app models
            commonModel = new Common(self);
            adminModel = new Admin(self);
            blogModel = new Blog(self);
            bookmarkModel = new Bm(self);
            conversationModel = new Conver(self);
            kanbanModel = new Kan(self);
            tagModel = new Tag(self);
            userModel = new Usr(self);
            wikiModel = new Wiki(self);
            searchModel = new Srch(self);
            backsideURL = configProperties.backsideProtocol+'://'+configProperties.backsideHost+':'+configProperties.backsidePort+'/';
            isInvitationOnly = configProperties.invitationOnly;
            return callback(err);
        });

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
    self.getCoreUIData = function() {
        var result = {};
        result.isAuthenticated = isAuthenticated;
        result.isAdmin = isAdmin;
        result.themessage = theMessage;
        result.email = userEmail;
        result.appmenu = appMenu;
        result.isInvitationOnly = isInvitationOnly;
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
        return httpClient;
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

    self.getConversationModel = function() {
        return conversationModel;
    };

    console.log("FOO "+self.getHttpClient());
};

module.exports = Environment;
