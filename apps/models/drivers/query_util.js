/**
 * Created by park on 11/16/2015.
 */

var QueryUtil = module.exports = function() {
    var self = this;

    //////////////////////////
    //API
    //////////////////////////
    /**
     * Create a full query where <code>cargo</code> is involved, by adding
     * a <em>cargo</em> section to <code>coreQuery</code>
     * @param coreQuery
     * @param cargo
     * @returns {*}
     */
    self.buildQuery= function(coreQuery, cargo) {
        var result = coreQuery;
        result.cargo = cargo;
        return result;
    };

    /**
     * Create a cire query object
     * @param verb
     * @param userId
     * @param userIP
     * @param sToken
     * @return {*}
     */
   self.getCoreQuery= function(verb, userId, userIP, sToken) {
        console.log("COREQUERY "+sToken);
        var query = {};
        query.verb = verb;
        query.uIP = userIP;
        query.uName = userId;
        var xtk = sToken;
       if (xtk === null) {
           xtk = '';
       }
        query.sToken = xtk;
        return query;
    };
};