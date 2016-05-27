/**
 * Created by park on 12/29/2015.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        TagModel = environment.getTagModel(),
        CommonModel = environment.getCommonModel();

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/tag","Tags");
    /////////////
    // Routes
    /////////////

    app.get("/tag", helpers.isPrivate, function(req, res) {
        var start = parseInt(req.query.start),
            count = parseInt(req.query.count);
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("Tags "+start+" "+count);

        var userId= "",
            userIP= "",
            sToken= null;
        if (req.user) {credentials = req.user.credentials;}

        TagModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Tag.index "+data);
            var cursor = start+countsent,
                json = environment.getCoreUIData(req);
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render("tagindex", json);
        });
    });

    app.get("/tag/:id", helpers.isPrivate, function(req, res) {
        var q = req.params.id;
        console.log("GETTAG "+q);
        if (q) {
            var userId = req.session[Constants.USER_ID],
                userIP = "",
                theUser = helpers.getUser(req),
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData(req);
                if (rslt.cargo) {
                    data = CommonModel.populateTopic(rslt.cargo, theUser, data);
                }
                return res.render("topic", data);
            });
        } else {
            //That's not good!
            //TODO
        }
    });
};