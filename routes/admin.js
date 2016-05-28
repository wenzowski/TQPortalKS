/**
 * Created by park on 11/17/2015.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        AdminModel = environment.getAdminModel();
    console.log("Admin "+AdminModel);

    function finishAuthenticate(req, jsonUser) {
        console.log("AA "+JSON.stringify(jsonUser));
        //\"rToken\":\"f4d3f872-0cae-444c-badf-632de6c5a118\"
        var rToken = jsonUser.rToken;
        console.log("BB "+rToken);
        req.session[Constants.SESSION_TOKEN] = rToken;
        // \"cargo\":{\"uGeoloc\":\"|\",\"uEmail\":\"sam@slow.com\",\"uHomepage\":\"\",
        // \"uName\":\"sam\",\"uFullName\":\"Sam Slow\",\"uRole\":\"rur\",\"uAvatar\":\"\"}}"
        var cargo = jsonUser.cargo;
        // hang on to the whole user object
        req.session[Constants.THE_USER] = cargo;
        console.log("CC "+JSON.stringify(cargo));
        var email = cargo.uEmail;
        var roles = cargo.uRole;
        var id = cargo.uName;
        req.session[Constants.USER_EMAIL] = email;
        req.session[Constants.USER_ID] = id;
        var where = roles.indexOf(Constants.ADMIN_CREDENTIALS);
        if (where > -1) {
            environment.setIsAdmin(true);
            req.session[Constants.USER_IS_ADMIN] = true;
        } else {
            environment.setIsAdmin(false);
            req.session[Constants.USER_IS_ADMIN] = false;
        }
        environment.setIsAuthenticated(true);
        environment.setUserEmail(email);
    };

    function finishLogout(req) {
        req.session[Constants.SESSION_TOKEN] = null;
        req.session[Constants.USER_IS_ADMIN] = "F";
        req.session[Constants.USER_EMAIL] = null;
        req.session[Constants.THE_USER] = null;
        environment.setIsAuthenticated(false);
        environment.setIsAdmin(false);
        environment.setUserEmail("");
    };
    /////////////
    // Routes
    /////////////

    app.get("/profile/:ID", function (req, res) {
        var email = req.session[Constants.USER_EMAIL],
            data = environment.getCoreUIData(req);
        AdminModel.getUser(email, function ap(err, result) {
            var cargo = result.cargo;
            console.log("Admin.profile "+JSON.stringify(cargo));
            ////////////////////////
            // A crash fetching profile on SystemUser
            // HOW DID THAT HAPPEN?
            //Admin.profile undefined
            // /home/jackpark/TQPortalKS/routes/admin.js:101
            // cannot read cargo.uHomepage
            // A CASE can be made for if (cargo) above
             /////////////////////////
            //Admin.profile {"uGeoloc":"|","uEmail":"jackpark@gmail.com","uHomepage":"","uName
            //":"jackpark","uFullName":"Jack Park","uRole":"rur, rar","uAvatar":""}
            if (cargo) {
                data.homepage = cargo.uHomepage;
                var lat = "",
                    lng = "";
                var gl = cargo.uGeoloc.trim();
                var len = gl.length;
                if (len > 10) {
                    var where = gl.indexOf("|");
                    lat = gl.slice(0, where);
                    lng = gl.slice((where + 1), (len - 1));
                }
                data.latitude = lat;
                data.longitude = lng;
            }
            res.render("profile", data);
        });

    });

    /**
     * ??
     */
    app.get("/admin,setview/:id", function(req,res) {
        var q = req.params.id;
        console.log("Admin.setView "+q);
        req.session.viewtype = q;
        return res.redirect("/");
    });

    ///////////////////////////////
    // Account functions
    ///////////////////////////////

    /**
     * GET LogOut
     */
    app.get("/logout", function(req, res) {
        req.session.clipboard = "";
        AdminModel.logout(req.session[Constants.SESSION_TOKEN], function adminLogout(err, rslt) {
            finishLogout(req);
            return res.redirect("/");
        });
    });

    /**
     * GET LogIn
     */
    app.get("/login", function(req, res) {
        res.render("login", environment.getCoreUIData(req));
    });

    /**
     * POST LogIn
     */
    app.post("/login", function(req, res, next) {
        console.log("Login: "+req.body.email);
        AdminModel.login(req, function adminLogin(err, rslt) {
            console.log("LOGIN+ "+err+" "+JSON.stringify(rslt));
///////////////////////////////
//LOGIN+ undefined "{\"rMsg\":\"ok\",\"rToken\":\"f4d3f872-0cae-444c-badf-632de6c5a118\",
// \"cargo\":{\"uGeoloc\":\"|\",\"uEmail\":\"sam@slow.com\",\"uHomepage\":\"\",
// \"uName\":\"sam\",\"uFullName\":\"Sam Slow\",\"uRole\":\"rur\",\"uAvatar\":\"\"}}"
///////////////////////////////
// LOGIN+ undefined "{\"rMsg\":\"\",\"rToken\":\"\"}"
///////////////////////////////

            if (rslt.rToken === "") {
                //not successful
                console.log("Bad Login");
                req.flash("error", "Email or Password not recognized");
                return res.redirect("/login");
            } else {
                finishAuthenticate(req, rslt);
                //console.log("SESS "+req.session[Constants.USER_EMAIL]);
            }
            var msg = environment.getCoreUIData(req);
            //TODO title could be a configuration setting
            msg.title = "TopicQuests Foundation's Prototype Collaboration Portal";
            return res.render("index", msg);
        });
     });

    /**
     * GET SignUp
     */
    app.get("/signup", function(req, res){
        var data = environment.getCoreUIData(req);
        data.invitationOnly = environment.getIsInvitationOnly();
        return res.render("signup", data);
    });

    /**
     * POST Validate
     */
    app.post("/validate", function(req, res) {
        var handle = req.body.vhandle;
        console.log("Validating "+handle);
        AdminModel.handleUnique(handle, function(err,truth) {
            console.log("Validating-1 "+err+" "+JSON.stringify(truth));
            var data = environment.getCoreUIData(req);
            data.invitationOnly = isInvitationOnly;
            if (truth) {
                data.hndl = handle;
            } else {
                req.flash("error", "Handle not available");
            }
            return res.render("signup", data);
        });
    });

    /**
     * The new account workhorse
     * @param req
     * @param res
     */
    function doPostSignup(req, res) {
        var email = req.body.email;
        AdminModel.createAccount(req, function adminCreate(err, rslt) {
            console.log("Admin.signup-2 ");
            if (!err) {
                AdminModel.removeInvitation(email, function adminRemove(err, truth) {
                    console.log("Admin.signup-4 ");
                    req.flash("error", "Signup successful. Ready to Sign in.");
                    return res.redirect("/");
                });
            } else {
                //TODO deal with error
                req.flash("error", "Signup error 1 : "+err);
                return res.redirect("/"); // for now
            }
        });
    };
    /**
     * POST SignUp
     */
    app.post("/signup", function(req, res) {
        var isInvitationOnly = environment.getIsInvitationOnly(),
            email = req.body.email;
        console.log("Admin.signup "+isInvitationOnly+" "+email);
        if (isInvitationOnly) {
            AdminModel.hasInvitation(email, function adminHasInvite(err, truth) {
                console.log("Admin.signup-1 "+JSON.stringify(truth));
                // bad:  {"rMsg":"not found","rToken":""}
                // good: {"rMsg":"ok","rToken":""}
                var msg = truth.rMsg;
                if (msg === "ok") {
                    return doPostSignup(req, res);
                 } else {
                    console.log("Admin.signup-3 ");
                    req.flash("error", "Signup error 2: Invitation Required");
                    return res.redirect("/");
                }
            });
        } else {
            console.log("Admin.signup-5 ");
            return doPostSignup(req, res);
        }
    });

    app.get("/inviteuser", helpers.isAdmin, function(req, res) {
        return res.render("inviteuser",environment.getCoreUIData(req));
    });

    app.post("/inviteuser", helpers.isAdmin, function(req,res) {
        var email = req.body.email;
        console.log("ABC " + JSON.stringify(req.body));
        console.log("DEF " + JSON.stringify(req.query));
        AdminModel.addInvitation(email, function (err, data) {
            console.log("Admin.inviteUser " + email + " " + err + " " + data);
            return res.redirect("/admin");
        });
    });

    app.get("/listusers", helpers.isAdmin, function(req, res) {
        //TODO this needs to do paging
        AdminModel.fillUserDatatable(0, 50, function adminListUsers(err, json) {
            console.log("AdminModel.listUsers "+json);
            var data = environment.getCoreUIData(req);
            data.usrtable = json.cargo;
            res.render("listusers",data);
        });
    });

    app.get("/listinvites", helpers.isAdmin, function(req, res) {
        AdminModel.fillInviteTable(0, 50, function adminListUsers(err, json) {
            console.log("AdminModel.listInvites "+json);
            var data = environment.getCoreUIData(req);
            data.usrtable = json;
            res.render("listinvites",data);
        });

    });

    app.get("/selectuser", helpers.isAdmin, function(req, res) {
        var email = req.query.email;
        console.log("Admin.selectuser "+email);
        AdminModel.getUser(email, function(err, data) {
            console.log("Admin.selectuser-1 "+err+" "+JSON.stringify(data));
            //TODO watch for null
            var d = environment.getCoreUIData(req)
            d.name = data.cargo.uName;
            d.credentials = data.cargo.uRole;
            res.render("editcredentials",d);
        });

    });

    app.get("/removeuser", helpers.isAdmin, function(req,res) {
        var userId = req.query.handle;
        console.log("Admin.selectuser "+userId);
        AdminModel.removeUser(userId, function(err,data) {
            res.redirect("/admin");
        });

    });

    app.post("/editcredentials", helpers.isAdmin, function(req,res) {
        var userId = req.body.name;
        var creds = req.body.credentials;
        var ic = creds.split(",");
        var nc = [];
        for (var i=0;i<ic.length;i++) {
            nc.push(ic[i].trim());
        }

        console.log("Admin,editcredentials "+userId+" "+nc);
        AdminModel.updateUserRole(userId, creds, function aUur(err, data) {
            console.log("Admin,editcredentials-1 "+err);
            return res.redirect("/admin");
        });
    });
    ///////////////////////////////
    // Profile functions
    ///////////////////////////////

    app.post("/changeEmail", helpers.isLoggedIn, function(req, res) {
        var userId = req.session[Constants.USER_ID],
            newEmail = email;
        AdminModel.updateUserEmail(userId, newEmail, function aUe(err, rslt) {
            return res.redirect("/");
        });
    });

    app.post("/changeHomepage", helpers.isLoggedIn, function(req, res) {
        console.log("CHANGE HOMEPAGE");
        return res.redirect("/");
    });

    app.post("/changeGeoLoc", helpers.isLoggedIn, function(req, res) {
        console.log("CHANGE GEOLOC");
        return res.redirect("/");
    });

    app.post("/changePwd", helpers.isLoggedIn, function(req, res) {
        console.log("CHANGE PASSWORD");
        return res.redirect("/");
    });

    ///////////////////////////////
    // Admin functions
    ///////////////////////////////
    app.get("/admin", helpers.isAdmin, function(req, res) {
        console.log("FIRING ADMIN");
        res.render("admin",environment.getCoreUIData(req));
    });
    app.get("/admin/setmessage", helpers.isAdmin, function(req,res) {
        var msg = req.query.message;
        environment.setMessage(msg);
        res.redirect("/admin");
    });
    app.get("/clearmessage", helpers.isAdmin, function(req,res) {
        environment.clearMessage();
        res.redirect("/admin");
    });
};
