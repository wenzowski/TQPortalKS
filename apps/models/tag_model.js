/**
 * Created by park on 11/16/2015.
 */

var TagnModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver();
    console.log("Tag "+topicDriver);
};