/**
 * Created by Admin on 11/29/2015.
 */

exports.plugin = function(app, environment) {
    var self = this
        isPrivatePortal = environment.getIsPrivatePortal();

    function isPrivate(req, res, next) {
        if (isPrivatePortal) {
            if (req.isAuthenticated()) {return next();}
            return res.redirect('/login');
        } else {
            return next();
        }
    };

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/globe","Globe");
    /////////////
    // Routes
    /////////////

    /**
     * Initial fetch of the /blog landing page
     */
    app.get('/globe', isPrivate, function(req, res) {
        var data = environment.getCoreUIData();

        res.render('globe' , data);
    });

};
