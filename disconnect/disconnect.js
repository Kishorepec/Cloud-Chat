// disconnect.js
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  
  try {
    await ddb.delete({
      TableName: 'Connections',
      Key: { connectionId }
    }).promise();

    return { statusCode: 200, body: 'Disconnected.' };
  } catch (error) {
    console.error("Error removing connection:", error);
    return { statusCode: 500, body: 'Failed to disconnect.' };
  }
};
