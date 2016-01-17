/**
 * Created by park on 12/31/2015.
 */
var Constants = require('../constants');

var BookmarkModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("Tag "+topicDriver);

    /////////////////////////////
    // API
    /////////////////////////////
    self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
        console.log("BookmarkModel.fillDatatable "+userId);
        topicDriver.listInstanceTopics(Constants.BOOKMARK_NODE_TYPE, start, count, userId, userIP, sToken,
                function bmF(err, rslt) {
            console.log("LISTbookmarks "+err+" | "+JSON.stringify(rslt));
            return callback(err, rslt, 0, 0);
        });
    };

    /**
     * <p>Create a bookmark (topic) for a given URL if it does not already exist.</p>
     * <p>Process any tags if they are supplied</p>
     * @param json
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.createBookmark = function(json, userId, userIP, sToken, callback) {
        console.log('BOOKMARK_MODEL_NEW_POST '+JSON.stringify(json)+' | '+JSON.stringify(userId));
        //BLOG_MODEL_NEW_POST {"locator":"","title":"My First Official Blog Post","body":"
        //Yup","tag1":"","tag2":"","tag3":"","tag4":""} | "jackpark"
        //locator, typeLocator, userId, label,
        //details, language, largeImagePath, smallImagePath,
        //    isPrivate, jsonPivots, userIP,sToken,
        var pivots = CommonModel.jsonBallToPivots(json),
            lang = json.language;
        if (!lang) { lang = 'en';}
        topicDriver.findOrCreateBookmark(json.url, json.title, lang, pivots, userId, userIP, sToken,
                function bmC(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
        //TODO
    };
};