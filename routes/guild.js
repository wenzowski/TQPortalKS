/**
 * Created by park on 5/28/2016.
 * Guilds are not conversation nodes
 * Guilds are indexed in rpg.hbs by way of aquests.js
 * View booleans:
 *   canJoin
 *     If <code>true</code>, user clicks a button to join
 *     Will default <code>true</code> unless:
 *      Guild is private -- invite only
 *      Not authenticated OR isMember
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var CommonModel = environment.getCommonModel(),
        helpers = new Help(environment),
        GuildModel = environment.getGuildModel(),
        AdminModel = environment.getAdminModel();

    console.log("Guild "+GuildModel);

    /**
     * Return <code>true</code> if <code>user</code>
     * is a member of a guild identified by <code>guildId</code>
     * @param guildId
     * @param user
     * @return
     */
    function userIsMember(guildId, user) {
      var credentials = user.uRole,
          where = credentials.indexOf(guildId);
      console.log("MEMBER? "+guildId+" "+credentials);
      return (where > -1);
    };

    function addMemberToGuild(guildId, user, callback) {
      console.log("ADDMEMBER "+guildId+" "+JSON.stringify(user));
      var credentials = user.uRole;
      if (Array.isArray(credentials)) {
        credentials.push(guildId);
      } else {
        var c = [];
        c.push(credentials);
        c.push(guildId);
        credentials = c;
      }
      user.uRole = credentials; //TODO set back in session?
      AdminModel.addUserRole(user.uName, guildId, function gA(err, rslt) {
        console.log("ADDEDMEMBER "+err);
        return callback(err);
      });
    };

    function removeMemberFromGuild(guildId, user, callback) {
      console.log("REMOVEMEMBER "+guildId+" "+JSON.stringify(user));
      var credentials = user.uRole;
      if (Array.isArray(credentials)) {
        credentials.push(guildId);
      } else {
        var c = [];
        c.push(credentials);
        c.push(guildId);
        credentials = c;
      }
      user.uRole = credentials; //TODO set back in session?
      AdminModel.removeUserRole(user.uName, guildId, function gA(err, rslt) {
        console.log("REMOVEDMEMBER "+err);
        return callback(err);
      });
    };
    // a Guild does not show on the Menu
    /////////////
    // Routes
    /////////////

    app.get("/guild/:id", helpers.isPrivate, function(req, res) {
      var q = req.params.id;
      if (q) {
          var userId = req.session[Constants.USER_ID],
              userIP = "",
              theUser = helpers.getUser(req),
              sToken = req.session[Constants.SESSION_TOKEN],
              canJoin = true;
          CommonModel.fetchTopic(q, userId, userIP, sToken, function uFT(err, rslt) {
              var data =  environment.getCoreUIData(req);
              if (rslt.cargo) {
                  data = CommonModel.populateTopic(rslt.cargo, theUser, data);
                  if (environment.getIsAuthenticated()) {
                    if (userIsMember(q, theUser)) {
                      canJoin = false;
                      data.isGuildMember = true;

                    }
                  } else {
                    //not authenticated
                    canJoin = false;
                  }
                  data.canJoin = canJoin;
                  if (canJoin) {
                    data.guildId = q;
                  }
              }
              console.log("CANJOIN "+q+" "+canJoin);
              return res.render("guild", data);
          });
      } else {
          //That's not good!
          //TODO  alert stuff
          console.log("DANG "+q);
          req.flash("error", "Cannot get "+q);
          res.redirect("/");
      }
    });

    app.get("/joinguild/:id", helpers.isPrivate, function(req, res) {
      var q = req.params.id,
          user = helpers.getUser(req),
          credentials = user.uRole;
      if (q) {
        addMemberToGuild(q, user, function gAM(err) {
          if (err) {
            req.flash("error", "Join error: "+err);
          }
          res.redirect("/guild/"+q);
        });

      } else {
        req.flash("error", "Cannot join "+q);
        res.redirect("/");
      }
    });
    app.get("/leaveguild/:id", helpers.isPrivate, function(req, res) {

    });
    app.get("/guildnew", helpers.isLoggedIn, function (req, res) {
        var data = environment.getCoreUIData(req);
        data.formtitle = "New Guild";
        data.isNotEdit = true;
        data.action = "/guild/new";
        return res.render("blogwikiform", data);
    });

    var _guildsupport = function (body, user, userIP, sToken, callback) {
        if (body.locator === "") {
            GuildModel.create(body, user.uName, userIP, sToken, function (err, result) {
              //creator of a guild is a member
              console.log("GCCC "+JSON.stringify(result));
              var gld = result;
              addMemberToGuild(gld.lox, user, function gnu(err) {
                return callback(err);
              });
            });
        } else {
            GuildModel.update(body, user.uName, userIP, sToken, function (err, result) {
                return callback(err, result);
            });
        }
    };

    app.post("/guild/new", helpers.isLoggedIn, function (req, res) {
      var body = req.body,
          user = helpers.getUser(req);//req.session[Constants.USER_ID],
          userIP = "",
          sToken = req.session[Constants.SESSION_TOKEN];
      console.log("GUILD_NEW_POST " + JSON.stringify(user));
      _guildsupport(body, user, userIP, sToken, function (err) {
          console.log("GUILD_NEW_POST-1 " + err);
          //technically, this should return to "/" since Lucene is not ready to display
          // the new post; you have to refresh the page in any case
          return res.redirect("/rpg");
      });
   });
};
