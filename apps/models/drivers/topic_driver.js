/**
 * Created by park on 11/16/2015.
 */
var Qu = require('./query_util'),
    Constants = require('../../constants');

var TopicDriver =  module.exports = function(environment) {
    var self = this,
        httpClient = environment.getHttpClient(),
        queryUtil = new Qu();
    console.log("TopicDriver "+httpClient);

    //////////////////////////////
    //API
    //////////////////////////////

    /**
     * Fetch a topic identified by <code>locator</code>
     * @param locator
     * @param userId
     * @param userIP
     * @param sToken can be <code>null</code>
     * @param callback signature (err, rslt)
     */
    self.grabTopic = function(locator, userId, userIP, sToken, callback) {
        console.log("xGRABBING- "+locator);
        var urx = '/tm/',
            verb = Constants.GET_TOPIC,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.lox = locator;
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.getTopicByURL = function(url, userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.GET_TOPIC_BY_URL,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.url = url;
        console.log("GETBYURL "+JSON.stringify(query));
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

    /**
     * If a bookmark node exists for the given <code>url</code>, return it.
     * Otherwise, create a new bookmark node and return it.
     * @param url
     * @param title
     * @param language
     * @param tagLabelArray  can be empty array or null
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.findOrCreateBookmark = function(url, title, language, tagLabelArray,
                                   userId, userIP, sToken, callback) {
        console.log("FOCB "+url+" | "+title+" | "+language+" | "+tagLabelArray+
            " | "+userId+" | "+userIP+" | "+sToken);
        var urx = '/tm/',
            verb = Constants.FIND_OR_CREATE_BOOKMARK,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.url = url;
        query.label = title;
        query.Lang = language;
        if (tagLabelArray !== null)
            query.ListProperty = tagLabelArray;
       //TODO
    };

    /**
     * Does not really return anything except a success message unless errors
     * @param bookmarkLocator -- the bookmark node for which tags are related
     * @param tagLabelArray -- a list of tagLabel strings
     * @param language
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.findOrProcessTags = function(bookmarkLocator, tagLabelArray, language, userId,
                                userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.FIND_OR_PROCESS_TAG,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.lox = bookmarkLocator;
        query.ListProperty = tagLabelArray;
        query.Lang = language;
       //TODO
    };

    self.listUserTopics = function(start, count, userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.LIST_USERS,

            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.localVerb = "ListUsers";
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.listInstanceTopics = function(typeLocator, start, count, userId, userIP, sToken) {
        var urx = '/tm/',
            verb = Constants.LIST_INSTANCE_TOPICS,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.inOf = typeLocator;
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.listSubclassTopics = function(superClassLocator, start, count, userId, userIP, sToken) {
        //TODO
    };

    self.submitNewInstanceTopic = function(jsonTopic, userId, userIP, sToken, callback) {
        console.log("SubmitNewInstanceTopic "+jsonTopic+" "+userId+" "+userIP+" "+sToken);
        var urx = '/tm/',
            verb = Constants.NEW_INSTANCE_TOPIC,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.cargo = jsonTopic;
        console.log("SubmitNewInstanceTopic+ "+JSON.stringify(query));
        //TODO
    };

    self.submitNewSubclassTopic = function(jsonTopic, userId, userIP, sToken, callback) {
        console.log("SubmitNewSubclassTopic "+jsonTopic+" "+userId+" "+userIP+" "+sToken);
        var urx = '/tm/',
            verb = Constants.NEW_SUBCLASS_TOPIC,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.cargo = jsonTopic;
        console.log("SubmitNewSubclassTopic+ "+JSON.stringify(query));
        //TODO
    };

    /**
     * Ask Backside to create a new ConversationMapNode
     * @param jsonCargo must conform to cargo requirement of backside servlet
     * @param userId
     * @param userIP,
     * @param sToken,
     * @param callback -- will return the created node
     */
    self.submitNewConversationNode = function(jsonCargo, userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.NEW_CONVERSATION_NODE,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.cargo = jsonTopic;
        console.log("NewConversationNode+ "+JSON.stringify(query));
        //TODO
    };

    ///////////////////////////////////////////////
    // Below, we have app-specific index fetches
    // We use the concept of "localVerb" because the generalized
    // BacksideServlet is LIST_INSTANCE_TOPICS,  and that's not specific
    // enough for the function "checkVerb" defined above.
    // The process is first: remove the list object from Topics, then
    // later insert it back after the fetch, ready for the client to paint
    ////////////////////////////////////////////////
    self.listBookmarkTopics = function(start, count, userId, userIP, sToken) {
        console.log("ServerListBookmarkTopics-");
        console.log("ServerListBookmarkTopics-1");
        var urx = '/tm/',
            verb = Constants.LIST_INSTANCE_TOPICS,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.inOf = 'BookmarkNodeType';
        query.localVerb = "ListBookmarks";
        console.log("ServerListBookmarkTopics "+JSON.stringify(query));
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.listTagTopics = function(start, count, userId, userIP, sToken) {
        var urx = '/tm/',
            verb = Constants.LIST_INSTANCE_TOPICS,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.inOf = 'TagNodeType';
        query.localVerb = "ListTags";
        console.log("ServerListTagTopics "+JSON.stringify(query));
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

};