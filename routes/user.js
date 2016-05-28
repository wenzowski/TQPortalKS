/**
 * Created by park on 11/25/2015.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        UserModel = environment.getUserModel(),
        CommonModel = environment.getCommonModel();

    console.log("User " + UserModel);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/user", "User");
    /////////////
    // Routes
    /////////////

    /**
     *
     */
    app.get("/user", helpers.isPrivate, function (req, res) {
        var data =  environment.getCoreUIData(req);
        data.start=0;
        UserModel.listUsers(0, -1, function uLU(err, rslt) {
            if (rslt.cargo) {
                data.cargo = rslt.cargo;
            }
            return res.render("userindex", data);
        });

    });

    app.get("/user/:id", helpers.isPrivate, function (req, res) {
        var q = req.params.id;
        if (q) {
            var userId = req.session[Constants.USER_ID],
                userIP = "",
                theUser = helpers.getUser(req),
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function uFT(err, rslt) {
                var data =  environment.getCoreUIData(req);
                if (rslt.cargo) {
                    data = CommonModel.populateTopic(rslt.cargo, theUser);
                }
                return res.render("topic", data);
            });
        } else {
            //That's not good!
            //TODO
        }
    });
};