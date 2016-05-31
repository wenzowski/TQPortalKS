
/**
 * Created by park on 5/22/2016.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers"),
    Rpg = require("../apps/models/rpg_model");

exports.plugin = function(app, environment) {
    var RpgModel = new Rpg(environment);
        CommonModel = environment.getCommonModel(),
        helpers = new Help(environment),
        GuildModel = environment.getGuildModel(),
        QuestModel = environment.getQuestModel();

    console.log("Blog "+RpgModel);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/rpg","Quests");
    /////////////
    // Routes
    /////////////

    /**
     * GET Quests index
     */
    app.get("/rpg", helpers.isPrivate, function(req, res) {
      //TODO more
      var data = environment.getCoreUIData(req),
          //Quest first
          start = parseInt(req.query.qstart),
          count = parseInt(req.query.qcount),
          userId = helpers.getUserId(req),
          userIP = "",
          sToken = null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      QuestModel.fillDatatable(start, count, userId, userIP, sToken, function questFill(err, qdata, countsent, totalavailable) {
          console.log("Quest.index " + qdata);
          var cursor = start + countsent;
          //pagination is based on start and count
          //both values are maintained in an html div
          data.qstart = cursor;
          data.qcount = Constants.MAX_HIT_COUNT; //pagination size
          data.qtotal = totalavailable;
          data.qcargo = data.cargo;
          //now guild
          start = parseInt(req.query.gstart);
          count = parseInt(req.query.gcount);

          GuildModel.fillDatatable(start, count, userId, userIP, sToken, function guildFill(err, gdata, countsent, totalavailable) {
              console.log("Guild.index " + gdata);
              var cursor = start + countsent;
              //pagination is based on start and count
              //both values are maintained in an html div
              data.gstart = cursor;
              data.gcount = Constants.MAX_HIT_COUNT; //pagination size
              data.gtotal = totalavailable;
              data.gcargo = gdata.cargo;
              return res.render("rpg", data);
          });
      });
    });
  };
