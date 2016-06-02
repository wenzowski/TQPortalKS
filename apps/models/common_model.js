/**
 * Created by park on 11/16/2015.
 */
var Constants = require('../constants'),
    Mc = require('../widgets/millercolumn'),
    CommonModel;

CommonModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        MillerColumn = new Mc(environment),
        undefined; // leave empty

    /**
     * Create a new Topic node shell
     * @param locator can be <code>null</code> or ""
     * @param userId  required
     * @param label can be <code>null</code>
     * @param details can be <code>null</code>
     * @param language can be <code>null</code>
     * @param largeImagePath should not be, but can be <code>null</code>
     * @param smallImagePath should not be, but can be <code>null</code>
     * @param isPrivate one of <code>true</code> or <code>false</code>
     * @return
     */
    function newNode(locator, userId, label, details, language,
                     largeImagePath, smallImagePath, isPrivate) {
        var result = {};
        if (null !== locator && '' !== locator) {
            result.lox = locator;
        }
        result.uName = userId;
        if (null !== language) {
            result.Lang = language;
        } else {
            result.Lang = 'en'; // default
        }
        //TODO MUST deal with language codes other than english
        // this means cloning the language2label system
        if (null !== label) {
            result.label = label;
        }
        //TODO same issue with language
        if (null !== details) {
            result.details = details;
        }
        if (null !== largeImagePath) {
            result.lIco = largeImagePath;
        }
        if (null !== smallImagePath) {
            result.sIco = smallImagePath;
        }
        var p = "F";
        if (isPrivate) {
            p = "T";
        }
        result.isPrv = p;
        console.log("NEWNODE "+JSON.stringify(result));
        return result;
    };

    /**
     *
     * @param locator can be <code>null</code>
     * @param typeLocator
     * @param userId
     * @param label
     * @param details
     * @param language
     * @param largeImagePath
     * @param smallImagePath
     * @param isPrivate
     * @returns {*}
     */
    function createNewInstanceTopic(locator, typeLocator, userId, label,
                                     details, language, largeImagePath, smallImagePath,
                                     isPrivate) {
        var result =  newNode(locator, userId, label, details, language,
            largeImagePath, smallImagePath, isPrivate);
        result.inOf = typeLocator;
        console.log("CREATENEWINST "+JSON.stringify(result));
        return result;
    };
    //NEWNODE {"crtr":"jackpark","Lang":"en","details":"Yup!","lIco":"/images/publication.png",
    // "sIco":"/images/publication_sm.png","isPrv":"F"}
    //CREATENEWINST {"crtr":"jackpark","Lang":"en","details":"Yup!","lIco":"/images/publication.png",
    // "sIco":"/images/publication_sm.png","isPrv":"F","inOf":"BlogNodeType"}

    /**
     *
     * @param typeLocator
     * @param parentLocator can be <code>null</code>
     * @param userId
     * @param label
     * @param details
     * @param language
     * @param largeImagePath
     * @param smallImagePath
     * @param isPrivate
     * @return
     */
    function createNewConversationNode(typeLocator, parentLocator, userId, label,
          details, language, largeImagePath, smallImagePath,isPrivate) {
       //TODO
    };
    /**
     * If <code>jsonPivots</code> contains any tags, process them
     * @param topicLocator
     * @param jsonPivots
     * @param language
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback signature (err, rslt)
     */
    function processTagPivots(topicLocator, jsonPivots, language, userId,
          userIP, sToken, callback) {
        console.log('ProcessTagPivots- '+JSON.stringify(jsonPivots));
        var tags = [],
            tg,
            bf = false;
        tg = jsonPivots.tag1;
        if (tg && tg !== '') {
            tags.push(tg);
            bf = true;
        }
        tg = jsonPivots.tag2;
        if (tg && tg !== '') {
            tags.push(tg);
            bf = true;
        }
        tg = jsonPivots.tag3;
        if (tg && tg !== '') {
            tags.push(tg);
            bf = true;
        }
        tg = jsonPivots.tag4;
        if (tg && tg !== '') {
            tags.push(tg);
            bf = true;
        }
        console.log('ProcessTagPivots+ '+JSON.stringify(tags));
        if (bf) {
            topicDriver.findOrProcessTags(topicLocator, tags, language, userId,
                  userIP, sToken, function cmPT(err, rslt) {
                return callback(err, rslt);
            });
        } else {
            var err,
                rslt;
            return callback(err, rslt);
        }
    };

    function renderPivot(piv) {
        var shell = {};
        shell.lox = piv.documentLocator;
        shell.sIco = piv.documentSmallIcon;
        shell.label = piv.documentLabel;
        return shell;
    };

    function extractTagPivots(pivots) {
        console.log("ExtractTagPivots "+JSON.stringify(pivots));
        //documentType === TagNodeType
        var x,
            i,
            shell,
            piv,
            boox = false,
            list = [],
            len = pivots.length,
            result = undefined;

        for (i =0; i<len; i++) {
            piv = pivots[i];
            console.log("PIV "+piv.relationType+" "+JSON.stringify(piv));
            if (piv.documentType === Constants.TAG_TYPE) {
                boox = true;
                shell = renderPivot(piv);
                list.push(shell);
            }
        }
        console.log("FOOTAG "+JSON.stringify(list));
        if (boox) {
            result = list;
        }

        return result;
    };

    function extractUserPivots(pivots) {
        var x,
            i,
            shell,
            piv,
            boox = false,
            list = [],
            len = pivots.length,
            result = undefined;

        for (i =0; i<len; i++) {
            piv = pivots[i];
            console.log("PIV "+piv.relationType+" "+JSON.stringify(piv));
            if (piv.documentType === Constants.USER_TYPE) {
                boox = true;
                shell = renderPivot(piv);
                list.push(shell);
            }
        }
        console.log("FOOUSER "+JSON.stringify(list));
        if (boox) {
            result = list;
        }
        return result;
    };

    function extractDocumentPivots(pivots) {
        var x,
            i,
            shell,
            piv,
            boox = false,
            list = [],
            len = pivots.length,
            result = undefined;

        for (i =0; i<len; i++) {
            piv = pivots[i];
            console.log("PIV "+piv.relationType+" "+JSON.stringify(piv));
            if (piv.documentType !== Constants.USER_TYPE &&
                piv.documentType !== Constants.TAG_TYPE) {
                boox = true;
                shell = renderPivot(piv);
                shell.doctype = piv.documentType;
                ////////////////////////////
                // hand-tuned typing
                // TODO this must be modified for additional node types
                // TODO let each app install its own in a map???
                ////////////////////////////
                if (piv.documentType === Constants.BLOG_TYPE) {
                    shell.isBlogType = true;
                } else if (piv.documentType === Constants.WIKI_TYPE) {
                    shell.isWikiType = true;
                } else if (piv.documentType === Constants.BOOKMARK_NODE_TYPE) {
                    shell.isBookmark = true;
                } //TODO conversation types?

                list.push(shell);
            }
        }
        console.log("FOODOC "+JSON.stringify(list));
        if (boox) {
            result = list;
        }
        return result;
    };

    function extractTranscludePivots(pivots) {
        var result = undefined;
        //TODO
        return result;
    };

    /////////////////////////////
    // API
    /////////////////////////////

    /**
     * Fetch a specific topic identified by <code>locator</code>
     * @param locator
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.fetchTopic = function(locator, userId, userIP, sToken, callback) {
        topicDriver.grabTopic(locator, userId, userIP, sToken, function cmFT(err, rslt) {
            console.log("CommonModel.fetchTopic "+err+" | "+JSON.stringify(rslt));
            return callback(err, rslt);
        });
        //CommonModel.fetchTopic undefined | {"rMsg":"ok","rToken":"","cargo":{"crDt":"2015-12-27T15:38:19-08:00",
        // "trCl":["TypeType","ClassType","NodeType","BlogNodeType","BlogNodeType"],
        // "lox":"14eb93df-c694-4e89-bf05-cd7b34f9798f","sIco":"/images/publication_sm.png","isPrv":false,
        // "_ver":"1451259499973","lEdDt":"2015-12-27T15:38:19-08:00",
        // "details":["Yup. This is going to be fun!"],"label":["Another Blog Post"],
        // "lIco":"/images/publication.png","inOf":"BlogNodeType"}}
    };

    /**
     * Pluck tags out of a JSON ball:
     * {"locator":"","title":"My First Official Blog Post","body":" Yup","tag1":"","tag2":"","tag3":"","tag4":""}
     * @param jsonBall
     * @returns {{}}
     */
    self.jsonBallToPivots = function(jsonBall) {
        var result = {};
        result.tag1 = jsonBall.tag1;
        result.tag2 = jsonBall.tag2;
        result.tag3 = jsonBall.tag3;
        result.tag4 = jsonBall.tag4;
        return result;
    };

    ////////////////////////////////////////////
    // TODO
    // CANEDIT?
    // for that to work, we need the whole user to extract
    // credentials
    ////////////////////////////////////////////

    /**
     * Return <code>true</code> if <code>node</code> can be edited by
     * holder of <code>credentials</code>
     * @param node  a JSON node -- interested in who created it
     * @param credentials a list of user's permissions
     * @return
     */
    self.canEdit = function(node, credentials) {
        console.log("CommonModel.canEdit " + JSON.stringify(credentials));
        var result = false;
        if (credentials) {
            // node is deemed editable if the user created the node
            // or if user is an admin
            var cid = node.crtr,
                where = credentials.indexOf(cid);
            if (where < 0) {
                var where2 = credentials.indexOf(Constants.ADMIN_CREDENTIALS);
                if (where2 > -1) {result = true;}
            } else {
                result = true;
            }
        }
        topicMapEnvironment.logDebug("CommonModel.canEdit "+JSON.stringify(credentials)+" | "+node.getCreatorId()+" | "+result);
        return result;
    };
    /**
     * This creates a new topic with or without pivots
     * @param locator can be <code>null</code> or ""
     * @param typeLocator
     * @param userId
     * @param label
     * @param details
     * @param language
     * @param largeImagePath
     * @param smallImagePath
     * @param isPrivate
     * @param url   can be <code>null</code>
     * @param jsonPivots can be <code>null</code>
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.createTopicInstance = function(locator, typeLocator, userId, label,
                                        details, language, largeImagePath, smallImagePath,
                                        isPrivate, url, jsonPivots, userIP, sToken, callback) {
        var jsonT = createNewInstanceTopic(null, typeLocator, userId, label, details, language,
                            largeImagePath, smallImagePath, isPrivate);
        if (url !== null) {
            ////////////////
            // Here, we are using the "extras" JSONObject to add additional key/value pairs
            ////////////////
            var extras = {};
            extras.url = url;
            jsonT.extras = extras;
        }

        console.log("here "+JSON.stringify(jsonPivots));
        //here {"tag1":"First Tag","tag2":"","tag3":"","tag4":""}
        topicDriver.submitNewInstanceTopic(jsonT, userId, userIP, sToken, function cmCT(err, rslt) {
            var x = rslt.cargo;
            var lox = x.lox;
            //deal with pivots
            console.log("CommonModel.createTopicInstance "+lox+" | "+JSON.stringify(jsonPivots));

                processTagPivots(lox, jsonPivots, language, userId, userIP,
                      sToken, function cmCTP(erx, rslx) {
                    return callback(err + erx, x);
                });

        });
    };

    /////////////////////////////////////////////////
    // PARENT_CHILD NODE STRUCTURES
    //   Use IChhildStruct for parent and child entries
    //   		CONTEXT_LOCATOR	= "contextLocator",
    //          LOCATOR			= "locator",
    //          ICON			= "smallImagePath",
    //          SUBJECT			= "subject",
    //          TRANSCLUDER_ID	= "transcluder"; // used when we transclude an existing node
    //  WE would have to fetch the parent node in order to fill in all the details
    //      So, we have the option of grabbing the details here when we choose a node
    //      to add a child to,
    //      or, wc can leave that to BacksideServletKS
    //  WE choose to leave the fetchimng to BacksideServletKS
    //
    //  TO ADD A CHILD, the key is this:
    //      ADD_CHILD_NODE			= "AddChildNode"
    /////////////////////////////////////////////////

    function childStruct(contextLocator, locator) {
        var result = {};
        result.contextLocator = contextLocator;
        result.locator = locator;
        return result;
    };

    /**
     * Create a conversation node of type specified by <code>typeLocator</code> which can be a child node
     * of a node identified by <code>parentLocator</code>
     * @param typeLocator
     * @param parentLocator can be <code>null</code> or <code>""</code>
     * @param contextLocator  follows parentLocator
     * @param userId
     * @param label
     * @param details
     * @param language
     * @param url  for reference nodes
     * @param largeImagePath
     * @param smallImagePath
     * @param isPrivate
     * @param jsonPivots
     * @param userIP
     * @param sToken
     * @param callback signature (err, rslt)
     */
    self.createConversationNode = function(typeLocator, parentLocator, contextLocator,
          userId, label, details, language, url, largeImagePath, smallImagePath,
          isPrivate, jsonPivots, userIP, sToken, callback) {
        console.log("C_MCreateConNode "+typeLocator+" | "+largeImagePath+" | "+smallImagePath);
        var jsonT = createNewInstanceTopic(null, typeLocator, userId, label, details, language,
            largeImagePath, smallImagePath, isPrivate);
        if (url !== null && url !== "") {
          jsonT.url = url;
        }
        if (parentLocator !== null && parentLocator !== "") {
          jsonT.ContextLocator = contextLocator;
          jsonT.ConParentLocator = parentLocator;
        }
        topicDriver.submitNewConversationNode(jsonT, userId, userIP, sToken, function cmCT(err, rslt) {
            var x = rslt.cargo;
            var lox = x.lox;
            //deal with pivots
            console.log("CommonModel.createConversationNode "+lox+" | "+JSON.stringify(jsonPivots));

            processTagPivots(lox, jsonPivots, language, userId, userIP, sToken, function cmCTP(erx, rslx) {
                return callback(err + erx, x);
            });

        });
    };
    
    /**
     * Populate UI data for the topic.hbs template
     * @param jsonTopic
     * @param user the full user account object
     * @param result  jsonCoreUI data
     * @return
     */
    self.populateTopic = function(jsonTopic, user, result ) {
        result.lIco = jsonTopic.lIco;
        result.label = jsonTopic.label;
        result.details = jsonTopic.details;
        result.source = JSON.stringify(jsonTopic);
        //metadata: user/date/url
        result.url = "";
        if (jsonTopic.url) {
            result.url = jsonTopic.url;
        }
        //DO NOT PAINT SYSTEM USER
        if (jsonTopic.crtr !== 'SystemUser') {
            result.userid = jsonTopic.crtr;
            result.username = jsonTopic.crtr;
            result.date = jsonTopic.lEdDt;
        }
        var pivots = jsonTopic.pvL;
        if (pivots) {
            var piv = extractTagPivots(pivots);
            if (piv) {
                result.showTags = true;
                result.tags = piv;
            }
            piv = extractUserPivots(pivots);
            if (piv) {
                result.showUsers = true;
                result.users = piv;
            }
            piv = extractDocumentPivots(pivots);
            if (piv) {
                result.showDocs = true;
                result.documents = piv;
            }
            piv = extractTranscludePivots(pivots);
            if (piv) {
                result.showTranscludes = true;
                result.transcludes = piv;
            }
        }
        //TODO lots more
        // e.g. conversation trees and relations
        return result;
    };

    /**
     * Populate UI data for the ctopic.hbs template
     * @param jsonTopic
     * @param user\
     * @param app e.g. 'blog'
     * @param data core UI data
     * @callback signature (err, rslt)
     */
    self.populateConversationTopic = function(jsonTopic, user, app, userIP,
          sToken, data, callback) {
      console.log("POPCONTOPIC- "+JSON.stringify(jsonTopic));
        var myResult = self.populateTopic(jsonTopic, user, data);
        console.log('POPCONTOPIC '+JSON.stringify(myResult));
        var contextLocator = jsonTopic.lox;//TODO
        var language = "en", //TODO
            aux = "";
        ////////////////////////////
        //POPULATE the MillerColumn
        //TODO this requires a javascript way to paint the widgets
        ///////////////////////////
        var js = "javascript:fetchFromTree";
        //TODO lots more
        MillerColumn.makeColNav(contextLocator, jsonTopic, contextLocator,
              language, js, app, aux, user.uName, userIP, sToken , function cmMC(err, rslt) {
            console.log('MILLERCOLUMN '+JSON.stringify(rslt));
            console.log("BOO "+myResult);
            //TODO put rslt into result
            return callback(undefined, myResult);
        });
    };
};
