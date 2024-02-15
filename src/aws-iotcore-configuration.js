var awsIotCoreConfiguration = {
    endpoint: 'https://iot.eu-west-2.amazonaws.com',
    region: 'eu-west-2',
    apiVersion: '2015-05-28',
    policy: '{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": [ "iot:Subscribe" ], "Resource": ["arn:aws:iot:eu-west-2:316711705658:topicfilter/*"]},{"Effect": "Allow","Action": [ "iot:Connect" ],"Resource": ["arn:aws:iot:eu-west-2:316711705658:client/*"] },{"Effect": "Allow","Action": [ "iot:Publish","iot:Receive" ],"Resource": ["arn:aws:iot:eu-west-2:316711705658:topic/*"]}]}'
  };

 export default awsIotCoreConfiguration;