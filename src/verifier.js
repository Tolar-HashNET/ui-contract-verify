//import 'solc';

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

// export function verify(contract_code) {
//     console.log('iznutra!!');
//     console.log(contract_code);
// }

export function verify(codestring) {
    // Build the post string from an object
    var post_data = querystring.stringify({
        'contract_code' : codestring
    });
  
    // An object of options to indicate where to post to
    var post_options = {
        host: '127.0.0.1',
        port: '3003',
        path: '/verify',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
  
    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });
  
    // post the data
    post_req.write(post_data);
    post_req.end();
}