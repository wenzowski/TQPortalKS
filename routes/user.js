/**
 * Created by park on 11/25/2015.
 */
var Constants = require('../apps/constants');
exports.plugin = function(app, environment) {
    var self = this,
        isPrivatePortal = environment.getIsPrivatePortal(),
        UserModel = environment.getUserModel(),
        CommonModel = environment.getCommonModel();

    console.log("User " + UserModel);

    function isPrivate(req, res, next) {
        if (isPrivatePortal) {
            if (req.isAuthenticated()) {
                return next();
            }
            return res.redirect('/login');
        } else {
            return next();
        }
    };

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/user", "User");
    /////////////
    // Routes
    /////////////

    /**
     * Initial fetch of the /blog landing page
     */
    app.get('/user', isPrivate, function (req, res) {
        var data =  environment.getCoreUIData();
        data.start=0;
        UserModel.listUsers(0, -1, function uLU(err, rslt) {
            if (rslt.cargo) {
                data.cargo = rslt.cargo;
            }
            return res.render('userindex', data);
        });

    });

    app.get('/user/:id', isPrivate, function (req, res) {
        var q = req.params.id;
        UserModel.getUser(q, function uGU( err, rslt) {
            var data =  environment.getCoreUIData();
            if (rslt.cargo) {
                data = CommonModel.populateTopic(rslt.cargo);
            }
            return res.render('topic', data);
        });
    });
};