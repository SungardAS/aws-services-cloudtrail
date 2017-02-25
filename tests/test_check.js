
/*
export TRAIL_NAME=Default
export BUCKET_NAME_POSTFIX=.cloudtrail
export BUCKET_POLICY_NAME=bucket_cloudtrail_policy
*/

const Credentials = {
  "AccessKeyId": "",
  "SecretAccessKey": "",
  "SessionToken": ""
};
const querystr = {
  "region": ""
};

var event = {
  "path": "/cloudtrail",
  "httpMethod": "GET",
  "headers": {
    "credentials": new Buffer(JSON.stringify(Credentials)).toString('base64')
  },
  "queryStringParameters": querystr,
  "body": {
  }
}

var i = require('../src/index.js');
var context = {succeed: res => console.log(res)};
i.handler(event, context, function(err, data) {
  if (err)  console.log("failed : " + err);
  else console.log("completed: " + JSON.stringify(data));
});
