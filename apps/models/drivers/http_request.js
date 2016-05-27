/**
 * Created by park on 11/16/2015.
 * @see https://nodejs.org/api/http.html#http_http_request_options_callback
 * @see https://www.npmjs.com/package/http-post
 */
var http = require('http'),
    post = require('http-post');

var HttpClient = function() {
    var self = this,
        _host,
        _port,
        _baseURL;

    /**
     * REQUIRED -- set in environment.js
     * @param host
     * @param port
     */
    self.init = function(host, port) {
        _host = host;
        _port = port;
        _baseURL = "http://"+host;
        if (port !== 80) {
            _baseURL += ":"+port;
        }
        console.log('HttpClient '+host+" "+port);
    };

    /**
     *
     * @param path e.g. /tm/
     * @param queryJSON
     * @param callback
     */
    self.post = function(path, queryJSON, callback) {
        var content = encodeURIComponent(JSON.stringify(queryJSON));
        console.log("POST "+content);
        var urx = _baseURL+path+content;
        var err,
            body='',
            result;
        var request = post(urx,{}, function hra(response) {
            console.log('STATUS: ' + response.statusCode);
            response.setEncoding('utf8');
            response.on('data', function(chunk){
                body += chunk;
            });

            response.on('end', function(){
                console.log("HTTP-POST "+body);
                result = JSON.parse(body);
                return callback(err, result);
            });

         }).on('error', function(e) {
            console.log('problem with request: ' + e.message);
            return callback(err, result);
        });
    };

    /**
     *
     * @param path e.g. /tm/
     * @param queryJSON
     * @param callback signature (err, rslt)
     */
    self.get = function(path, queryJSON, callback) {
        var content = encodeURIComponent(JSON.stringify(queryJSON));
        var urx = _baseURL+path+content;
        var err,
            body='',
            result;
        var request = http.get(urx, function hra(response) {
            console.log('STATUS: ' + response.statusCode);
            response.setEncoding('utf8');
            response.on('data', function(chunk){
                body += chunk;
            });

            response.on('end', function(){
                console.log("HTTPGET "+body);
                result = JSON.parse(body);
                return callback(err, result);
            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
            return callback(e, result);
        });
    };
    /////////////////////////////////////
    // Structure of authentication
    //{
    //  "host": "localhost",
    //  "port": "8080",
    //  "path": "/auth/{\"verb\":\"Auth\",\"uIP\":\"\",\"uName\":\"SystemUser\",\"sToken\":\"\"}",
    //  "headers": {
    //    "Authorization": "Basic YnJ5YW5Aam9lLm9yZzpicnlhbg=="
    //  }
    //}
    /////////////////////////////////////
    /**
     * @see http://stackoverflow.com/questions/3905126/how-to-use-http-client-in-node-js-if-there-is-basic-authorization
     * @param query
     * @param email
     * @param password
     * @param callback
     */
    self.authenticate = function(query, email, password, callback) {
        var auth = email+':'+password,
            options = {};
        var headers = {};
        headers.Authorization = 'Basic ' + new Buffer(auth).toString('base64')
        options.host = _host;
        options.port = _port;
        options.path = '/auth/'+JSON.stringify(query);
        options.headers = headers;
        console.log("AUTH- "+JSON.stringify(options));
        var err,
            result;
        var request = http.get(options, function hra(response) {
            console.log('STATUS: ' + response.statusCode);
            console.log('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                result = JSON.parse(chunk);
                console.log("CARGO "+result.cargo);
                console.log('BODY: ' + JSON.stringify(result));
///////////////////////////////////
//BODY: "{\"rMsg\":\"ok\",\"rToken\":\"8623f637-4275-46de-b8bb-c35127797e60\",\"cargo\":
// {\"uGeoloc\":\"|\",\"uEmail\":\"sam@slow.com\",\"uHomepage\":\"\",\"uName\
// ":\"sam\",\"uFullName\":\"Sam Slow\",\"uRole\":\"rur\",\"uAvatar\":\"\"}}"
///////////////////////////////////

                request.end();
                console.log("HttpRequestAuth "+result);
                return callback(err, result);

            });

        });
    };
};

module.exports = HttpClient;