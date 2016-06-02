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

    self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
      console.log("QuestModel.fillDatatable "+userId);
      topicDriver.listInstanceTopics(Constants.QUEST_TYPE, start, count,
          userId, userIP, sToken, function bmF(err, rslt) {
        console.log("LISTQUESTS"+err+" | "+JSON.stringify(rslt));
        return callback(err, rslt, 0, 0);
      });
    };

    self.create = function(json, userId, userIP, sToken, callback) {
      console.log("QUEST_MODEL_NEW_TOPIC "+JSON.stringify(json)+" | "+JSON.stringify(userId));

      var pivots = CommonModel.jsonBallToPivots(json),
          lang = json.language;
      if (!lang) { lang = "en";}
      CommonModel.createTopicInstance(null, Constants.QUEST_TYPE, userId,
          json.title, json.body, lang, Constants.QUEST, Constants.QUEST_SM,
          false, null, pivots, userIP, sToken, function umC(err, rslt) {
        return callback(err, rslt);
      });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
        //TODO
    };
};
