/**
 * Created by park on 11/27/2015.
 */
var Constants = require("../constants"),
     SearchModel;

SearchModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver();

    console.log("Search");

    //////////////////////////
    //API
    //////////////////////////

    /**
     * Each line of hits should include locator, label
     * Locator must include the object type, e.g. /blog/locator
     * @param query
     * @param user
     * @param language
     * @param start
     * @param count
     * @param callback: signature (err,data)
     */
    self.runSearch = function (query, user, language, start, count, callback) {
        //TODO
    };
};
