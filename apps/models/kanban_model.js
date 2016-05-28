/**
 * Created by park on 11/16/2015.
 */
var KanbanModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver();
    console.log("Kanban "+topicDriver);
};