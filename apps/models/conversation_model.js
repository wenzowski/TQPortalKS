/**
 * Created by park on 11/16/2015.
 */
var Constants = require("../constants");

var ConversationModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("Conversation "+topicDriver);

    function getSmallIcon(nodeType) {
        var result = "";
        //TODO
        return result;
    };

    function getLargeIcon(nodeType) {
        var result = "";
        //TODO
        return result;
    };


    /////////////////////////////
    // API
    /////////////////////////////
    self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
        console.log("BookmarkModel.fillDatatable "+userId);
        topicDriver.listInstanceTopics(Constants.CONVERSATION_MAP_TYPE, start, count, userId, userIP, sToken, function bmF(err, rslt) {
            console.log("LISTbookmarks "+err+" | "+JSON.stringify(rslt));
            return callback(err, rslt, 0, 0);
        })
    };

    self.create = function(json, isPrivate, userId, userIP, sToken, callback) {
        console.log("CONVERSATION_MODEL_NEW_POST "+JSON.stringify(json)+" | "+JSON.stringify(userId));
        //BLOG_MODEL_NEW_POST {"locator":"","title":"My First Official Blog Post","body":"
        //Yup","tag1":"","tag2":"","tag3":"","tag4":""} | "jackpark"
        //locator, typeLocator, userId, label,
        //details, language, largeImagePath, smallImagePath,
        //    isPrivate, jsonPivots, userIP,sToken,
        var pivots = CommonModel.jsonBallToPivots(json),
            lang = json.language,
            lox = json.locator;
        if (!lang) { lang = "en";}
        if (lox === "") {lox = null};

        CommonModel
            .createConversationNode(json.nodetype, json.locator, json.context,
                                    userId, json.title, json.body, lang,
                                    getLargeIcon(json.nodetype), getSmallIcon(json.nodetype),
                                    isPrivate, pivots, userIP, sToken, function umC(err, rslt) {
                return callback(err, rslt);
            });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
        //TODO
    };
};