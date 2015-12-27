/**
 * Created by park on 11/16/2015.
 */

var CommonModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver();

    /////////////////////////////
    // API
    /////////////////////////////

    self.createTopicInstanceWithPivots = function(nodeType, json, userId, userIP, sToken, callback) {
        //TODO
    };

    self.createTopicInstance = function(nodeType, json, userId,userIP,sToken, callback) {
        //TODO
    };

    /**
     * Populate UI data for the topic.hbs template
     * @param jsonTopic
     */
    self.populateTopic = function(jsonTopic) {
        var result = environment.getCoreUIData();
        result.lIco = jsonTopic.lIco;
        result.label = jsonTopic.label;
        result.source = JSON.stringify(jsonTopic);
        //TODO lots more
        return result;
    };

    /**
     * Populate UI data for the ctopic.hbs template
     * @param jsonTopic
     */
    self.populateConversationTopic = function(jsonTopic) {
        var result = environment.getCoreUIData();
        result.lIco = jsonTopic.lIco;
        result.label = jsonTopic.label;
        result.source = JSON.stringify(jsonTopic);
        //TODO lots more
        return result;
    };
};