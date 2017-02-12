
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
const body = {
  "region": ""
};

event = {
  "path": "/cloudtrail",
  "httpMethod": "POST",
  "headers": {
    "Credentials": new Buffer(JSON.stringify(Credentials)).toString('base64')
  },
  "body": JSON.stringify(body),
  "resType": "json"
}

var i = require('../src/index.js');
var context = {succeed: res => console.log(res)};
i.handler(event, context, function(err, data) {
  if (err)  console.log("failed : " + err);
  else console.log("completed: " + JSON.stringify(data));
});
