
/*
export TRAIL_NAME=Default
*/

const Credentials = {
  "AccessKeyId": "",
  "SecretAccessKey": "",
  "SessionToken": ""
};
const querystr = {
  "region": ""
};

event = {
  "path": "/cloudtrail",
  "httpMethod": "GET",
  "headers": {
    "Credentials": new Buffer(JSON.stringify(Credentials)).toString('base64')
  },
  "queryStringParameters": querystr,
  "resType": "json"
}

var i = require('../src/index.js');
var context = {succeed: res => console.log(res)};
i.handler(event, context, function(err, data) {
  if (err)  console.log("failed : " + err);
  else console.log("completed: " + JSON.stringify(data));
});
