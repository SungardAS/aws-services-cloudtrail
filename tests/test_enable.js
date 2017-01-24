
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
    "Credentials": JSON.stringify(Credentials),
  },
  "requestContext": {
    "authorizer": {
      "refresh_token": "1234",
      "principalId": "abcd"
    }
  },
  "body": JSON.stringify(body)
}

var i = require('../src/index.js');
var context = {succeed: res => console.log(res)};
i.handler(event, context, function(err, data) {
  if (err)  console.log("failed : " + err);
  else console.log("completed: " + JSON.stringify(data));
});
