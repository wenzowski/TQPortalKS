/**
 * Created by park on 5/28/2016.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var CommonModel = environment.getCommonModel(),
        helpers = new Help(environment);


    console.log("Topic ");

    // a Guild does not show on the Menu
    /////////////
    // Routes
    /////////////

    app.get("/topic/:id", helpers.isPrivate, function(req, res) {
      var q = req.params.id;
      console.log("GETTOPIC "+q);
      if (q) {
          var userId = req.session[Constants.USER_ID],
              theUser = helpers.getUser(req);
              userIP = "",
              sToken = req.session[Constants.SESSION_TOKEN];

          CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
              var data =  environment.getCoreUIData(req);
              if (rslt.cargo) {
                  CommonModel.populateConversationTopic(rslt.cargo, theUser, "/topic/", userIP, sToken,
                              data, function bC(err, rslt) {
                      data = rslt;
                      console.log("BOOBOOBOO "+JSON.stringify(data));
                  });
              }
              //TODO else flash error
              helpers.checkContext(req, data);
              helpers.checkTranscludes(req, data);

              return res.render("ctopic", data);
          });
      } else {
          //That's not good!
          //TODO
      }
    });
  };
