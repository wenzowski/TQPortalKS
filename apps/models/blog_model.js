/**
 * Created by park on 11/16/2015.
 */

var BlogModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        commonModel = environment.getCommonModel();
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
        var err,
            result = [];
        //TODO
        return callback(err, result, 0, 0);
    };

    self.create = function(json, user, callback) {

    };

    self.update = function(json, user, callback) {

    };
};