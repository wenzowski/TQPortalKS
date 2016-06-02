/**
 * Created by park on 11/16/2015.
 */
var Constants = require("../constants"),
    TagModel;

TagModel =  module.exports = function(environment) {
  var self = this,
      topicDriver = environment.getTopicDriver();
  console.log("Tag "+topicDriver);

  self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
      console.log("TagModel.fillDatatable "+userId);
      topicDriver.listInstanceTopics(Constants.TAG_TYPE, start, count, userId,
          userIP, sToken, function bmF(err, rslt) {
        console.log("LISTTags "+err+" | "+JSON.stringify(rslt));
        //TODO
        return callback(err, rslt, 0, 0);
      });
   };
};
