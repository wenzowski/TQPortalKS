/**
 * Created by park on 5/28/2016.
 */
var Constants = require("../constants"),
    QuestModel;

QuestModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("QUEST "+topicDriver);

};
