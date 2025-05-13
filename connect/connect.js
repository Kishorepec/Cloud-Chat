// Load the AWS SDK
const AWS = require('aws-sdk');

// Create DynamoDB DocumentClient
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("CONNECT EVENT:", JSON.stringify(event));

  const connectionId = event.requestContext.connectionId;

  const params = {
    TableName: 'WebSocketConnections', // Make sure this table exists
    Item: { connectionId }
  };

  try {
    await ddb.put(params).promise();
    console.log(`Stored connection ID: ${connectionId}`);
  } catch (err) {
    console.error("DynamoDB Error:", err);
    return {
      statusCode: 500,
      body: 'Failed to connect: ' + JSON.stringify(err)
    };
  }

  return {
    statusCode: 200,
    body: 'Connected.'
  };
};

