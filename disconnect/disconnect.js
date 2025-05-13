const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("DISCONNECT EVENT:", JSON.stringify(event));

  const connectionId = event.requestContext.connectionId;

  const params = {
    TableName: 'WebSocketConnections',
    Key: { connectionId }
  };

  try {
    await ddb.delete(params).promise();
    console.log(`Deleted connection ID: ${connectionId}`);
  } catch (err) {
    console.error("DynamoDB Error:", err);
    return {
      statusCode: 500,
      body: 'Failed to disconnect: ' + JSON.stringify(err)
    };
  }

  return {
    statusCode: 200,
    body: 'Disconnected.'
  };
};
