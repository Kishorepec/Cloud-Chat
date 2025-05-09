// connect.js
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  
  try {
    await ddb.put({
      TableName: 'Connections',
      Item: { connectionId }
    }).promise();

    return { statusCode: 200, body: 'Connected.' };
  } catch (error) {
    console.error("Error storing connection:", error);
    return { statusCode: 500, body: 'Failed to connect.' };
  }
};
