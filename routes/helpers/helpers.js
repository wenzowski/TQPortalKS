/**
 * Created by park on 4/14/2016.
 */
var Constants = require("../../apps/constants"),
    Helpers;

Helpers = function (environment) {
    var self = this,
        isPrivatePortal = environment.getIsPrivatePortal();

    self.isPrivate = function (req, res, next) {
        if (isPrivatePortal) {
            if (req.isAuthenticated()) {
                return next();
            }
            return res.redirect("/login");
        } else {
            return next();
        }
    };

    self.isLoggedIn = function (req, res, next) {
        if (environment.getIsAuthenticated()) {
            return next();
        }
        // if they aren't redirect them to the home page
        // really should issue an error message
        if (isPrivatePortal) {
            return res.redirect("/login");
        }
        return res.redirect("/");
    };

    self.isAdmin = function (req, res, next) {
        var theUser = req.session[Constants.THE_USER];
        console.log("ADMINUSER "+theUser);
        if (theUser) {
            var roles = theUser.uRole;
            var where = roles.indexOf(Constants.ADMIN_CREDENTIALS);
            console.log("ADMINROLES "+roles+" "+where);
            if (where > -1) {
                return next();
            } else {
                return res.redirect("/");
            }
        } else {
            return res.redirect("/");
        }
    };

    self.getUser = function (req) {
        var result = req.session[Constants.THE_USER];
        if (!result) {
            result = {};
            result.uName = Constants.GUEST_USER;
        }
        return result;
    };

    self.checkTranscludes = function(req, data) {
      var transclusion = req.session.transclude,
          evidence = req.session.tevidence;
      if (transclusion !== null && transclusion !== "") {
        data.transcludelocator = transclusion;
      } else if (evidence !== null && evidence !== "") {
        data.transcludeevidencelocator = evidence;
      }
    };

    self.checkContext = function(req, data) {
      var contextLocator = req.query.contextLocator,
          q = req.params.id;
          data.locator = q;
          if (contextLocator && contextLocator !== "") {
              data.context = contextLocator;
          } else {
              data.context = q; // we are talking about responding to this blog
          }
    };
};

module.exports = Helpers;
