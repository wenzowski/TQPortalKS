/**
 * Created by park on 12/27/2015.
 */
exports.plugin = function(app, environment) {
    var self = this,
        isPrivatePortal = environment.getIsPrivatePortal();

    function isPrivate(req, res, next) {
        if (isPrivatePortal) {
            if (req.isAuthenticated()) {return next();}
            return res.redirect('/login');
        } else {
            return next();
        }
    };

    app.get('/contact', isPrivate, function(req, res) {
        res.render('contact' , environment.getCoreUIData());
    });
};