

# Interfaces to Manage Cloudtrail

API Gateway and Lambda Function to Manage the Cloudtrail Services

![aws-services][aws-services-image]

## How to Send Requests

The 'Credentials' header doesn't need to be set if the target account is same with the account where this Lambda Function is deployed.

### To check the current status of the services
```
const Credentials = {
  "AccessKeyId": "",
  "SecretAccessKey": "",
  "SessionToken": ""
}
path: /cloudtrail?region=<<region>>
method : GET
headers: {
  "Credentials": JSON.stringify(Credentials),
}
```
### To enable the services
```
Credentials = {
  "AccessKeyId": "",
  "SecretAccessKey": "",
  "SessionToken": ""
}
path: /cloudtrail
method : POST
headers: {
  "Credentials": JSON.stringify(Credentials),
}
data:
{
  "region": "<<region>>"
}
```
### To disable the services
```
Credentials = {
  "AccessKeyId": "",
  "SecretAccessKey": "",
  "SessionToken": ""
}
path: /cloudtrail
method : DELETE
headers: {
  "Credentials": JSON.stringify(Credentials),
}
data:
{
  "region": "<<region>>"
}
```

## How To Setup a CodePipeline

Please see here, https://github.com/SungardAS/aws-services-federation#how-to-setup-a-codepipeline, and add below environment variables in CodeBuild

  > AWS_AUTHORIZER_LAMBDA_ARN : ARN of Custom Authorizer Lambda Function

  > AWS_AUTHORIZER_IAM_ROLE_ARN : ARN of IAM Role that enables Custom Authorizer to be invoked

## How To Test Lambda Functions

- $ cd tests
- Export necessary environment variables and fill the necessary input values
- $ node test_xxx.js

## [![Sungard Availability Services | Labs][labs-logo]][labs-github-url]

This project is maintained by the Labs group at [Sungard Availability
Services](http://sungardas.com)

GitHub: [https://sungardas.github.io](https://sungardas.github.io)

Blog:
[http://blog.sungardas.com/CTOLabs/](http://blog.sungardas.com/CTOLabs/)

[labs-github-url]: https://sungardas.github.io
[labs-logo]: https://raw.githubusercontent.com/SungardAS/repo-assets/master/images/logos/sungardas-labs-logo-small.png
[aws-services-image]: ./docs/images/logo.png?raw=true
