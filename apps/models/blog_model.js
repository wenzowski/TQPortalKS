/**
 * Created by park on 11/16/2015.
 */
var Constants = require("../constants");

var BlogModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("Blog "+topicDriver);

    /////////////////////
    // API
    /////////////////////


    /**
     *
     * @param start
     * @param count
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback signature (err, json, countSent, countTotal)
     */
    self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
        console.log("BlogModel.fillDatatable "+userId);
         topicDriver.listInstanceTopics(Constants.BLOG_TYPE, start, count, userId, userIP, sToken, function bmF(err, rslt) {
            console.log("LISTBLOGS "+err+" | "+JSON.stringify(rslt));
            return callback(err, rslt, 0, 0);
        });
        //LISTBLOGS undefined | {"rMsg":"ok","rToken":"","cargo":[{"crDt":"2015-12-27T14:50:24-08:00",
        // "trCl":["TypeType","ClassType","NodeType","BlogNodeType"],"lox":"8ff7356a-f35a-45d9-9660-fe04787a6de5",
        // "sIco":"/images/publication_sm.png","isPrv":false,"_ver":"1451256624788","lEdDt":"2015-12-27T14:50:24-08:00",
        // "details":["In which I shall say nothing!"],"lIco":"/images/publication.png","inOf":"BlogNodeType"},
        // {"crDt":"2015-12-27T14:53:32-08:00","trCl":["TypeType","ClassType","NodeType","BlogNodeType"],
        // "lox":"54b53c75-ffcc-47b2-9a19-75abcc6cc710","sIco":"/images/publication_sm.png","isPrv":false,
        // "_ver":"1451256812114","lEdDt":"2015-12-27T14:53:32-08:00","details":["Yup!"],
        // "lIco":"/images/publication.png","inOf":"BlogNodeType"}]}
    };

    self.createBlogPost = function(json, userId, userIP, sToken, callback) {
        console.log("BLOG_MODEL_NEW_POST "+JSON.stringify(json)+" | "+JSON.stringify(userId));
        //BLOG_MODEL_NEW_POST {"locator":"","title":"My First Official Blog Post","body":"
        //Yup","tag1":"","tag2":"","tag3":"","tag4":""} | "jackpark"
        //locator, typeLocator, userId, label,
        //details, language, largeImagePath, smallImagePath,
        //    isPrivate, jsonPivots, userIP,sToken,
        var pivots = CommonModel.jsonBallToPivots(json),
            lang = json.language;
        if (!lang) { lang = "en";}
        CommonModel.createTopicInstance(null, Constants.BLOG_TYPE, userId, json.title, json.body, lang,
            Constants.PUBLICATION, Constants.PUBLICATION_SM, false, null, pivots,
            userIP, sToken, function umC(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
        //TODO
    };
};