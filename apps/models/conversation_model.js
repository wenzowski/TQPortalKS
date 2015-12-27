/**
 * Created by park on 11/16/2015.
 */

var ConversationModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver();
    console.log("Conversation "+topicDriver);
};