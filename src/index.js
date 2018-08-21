
var baseHandler = require('aws-services-lib/lambda/base_handler.js')

exports.handler = (event, context) => {
  baseHandler.handler(event, context);
}

baseHandler.get = function(params, callback) {

  var AWS = require('aws-sdk');
  var aws_trail = new (require('aws-services-lib/aws/cloudtrail.js'))();

  var trailName = process.env.TRAIL_NAME;

  var input = {
    trailName: trailName
  };
  
  if (params.region) input['region'] = params.region;
  if (params.credentials) {
    input['creds'] = new AWS.Credentials({
      accessKeyId: params.credentials.AccessKeyId,
      secretAccessKey: params.credentials.SecretAccessKey,
      sessionToken: params.credentials.SessionToken
    });
  }

  function succeeded(input) { callback(null, {result: true}); }
  function failed(input) { callback(null, {result: false}); }
  function errored(err) { callback(err, null); }

  var flows = [
    {func:aws_trail.findTrails, success:aws_trail.isLogging, failure:failed, error:errored},
    {func:aws_trail.isLogging, success:succeeded, failure:failed, error:errored},
  ];
  aws_trail.flows = flows;

  flows[0].func(input);
}

baseHandler.post = function(params, callback) {

  var AWS = require('aws-sdk');
  var aws_bucket = new (require('aws-services-lib/aws/s3bucket.js'))();
  var aws_trail = new (require('aws-services-lib/aws/cloudtrail.js'))();
  var aws_iam = new (require('aws-services-lib/aws/role.js'))();

  var input = {};
  if (params.multiRegion)  input.multiRegion = params.multiRegion;
  if (params.region) input['region'] = params.region;
  if (params.credentials) input['creds'] = new AWS.Credentials({
    accessKeyId: params.credentials.AccessKeyId,
    secretAccessKey: params.credentials.SecretAccessKey,
    sessionToken: params.credentials.SessionToken
  });

  // find the target account id
  aws_iam.findAccountId(input, function(err, data) {
    if(err) {
      console.log('failed to find target account id');
      callback({error: 'failed to find target account id'}, null);
    }
    else {
      console.log('target account id : ' + data);
      if (data == null) {
        console.log('failed to find target account id');
        callback({error: 'failed to find target account id'}, null);
        return;
      }
      input.accountId = data;

      var trailName = process.env.TRAIL_NAME;
      var bucketNamePostfix = process.env.BUCKET_NAME_POSTFIX;
      var bucketPolicyName = process.env.BUCKET_POLICY_NAME;

      var bucketName = input.accountId + bucketNamePostfix + "-" + params.region;
      var resources = [
        'arn:aws:s3:::' + bucketName,
        'arn:aws:s3:::' + bucketName + '/AWSLogs/' + input.accountId + '/*'];

      var fs = require("fs");
      data = fs.readFileSync(__dirname + '/json/' + bucketPolicyName + '.json', {encoding:'utf8'});
      var policyDoc = JSON.parse(data);
      for(var i = 0; i < resources.length; i++) {
        policyDoc.Statement[i].Resource = resources[i];
      }
      policyDoc = JSON.stringify(policyDoc);

      input.trailName = trailName;
      input.bucketName = bucketName;
      input.policyDocument = policyDoc;

      function succeeded(input) { callback(null, {result: true}); }
      function failed(input) { callback(null, {result: false}); }
      function errored(err) { callback(err, null); }

      var flows = [
        {func:aws_bucket.findBucket, success:aws_bucket.getPolicy, failure:aws_bucket.createBucket, error:errored},
        {func:aws_bucket.getPolicy, success:aws_trail.findTrails, failure:aws_bucket.addPolicy, error:errored},
        {func:aws_bucket.createBucket, success:aws_bucket.addPolicy, failure:failed, error:errored},
        {func:aws_bucket.addPolicy, success:aws_trail.findTrails, failure:failed, error:errored},
        {func:aws_trail.findTrails, success:aws_trail.isLogging, failure:aws_trail.createTrail, error:errored},
        {func:aws_trail.createTrail, success:aws_trail.startLogging, failure:failed, error:errored},
        {func:aws_trail.isLogging, success:succeeded, failure:aws_trail.startLogging, error:errored},
        {func:aws_trail.startLogging, success:succeeded, failure:failed, error:errored},
      ];
      aws_bucket.flows = flows;
      aws_trail.flows = flows;

      flows[0].func(input);
    }
  });
}

baseHandler.delete = function(params, callback) {

  var AWS = require('aws-sdk');
  var aws_trail = new (require('aws-services-lib/aws/cloudtrail.js'))();

  var trailName = process.env.TRAIL_NAME;

  var input = {
    trailName: trailName
  };
  if (params.region) input['region'] = params.region;
  if (params.credentials) input['creds'] = new AWS.Credentials({
    accessKeyId: params.credentials.AccessKeyId,
    secretAccessKey: params.credentials.SecretAccessKey,
    sessionToken: params.credentials.SessionToken
  });

  function succeeded(input) { callback(null, {result: true}); }
  function failed(input) { callback(null, {result: false}); }
  function errored(err) { callback(err, null); }

  var flows = [
    {func:aws_trail.findTrails, success:aws_trail.isLogging, failure:succeeded, error:errored},
    {func:aws_trail.isLogging, success:aws_trail.stopLogging, failure:aws_trail.deleteTrail, error:errored},
    {func:aws_trail.stopLogging, success:aws_trail.deleteTrail, failure:failed, error:errored},
    {func:aws_trail.deleteTrail, success:succeeded, failure:failed, error:errored},
  ];
  aws_trail.flows = flows;

  flows[0].func(input);
}
