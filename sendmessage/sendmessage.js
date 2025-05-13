const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("SEND MESSAGE EVENT:", JSON.stringify(event));

  const body = JSON.parse(event.body);
  const message = body.message;
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const endpoint = `https://${domain}/${stage}`;

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: endpoint,
  });

  let connectionData;
  try {
    connectionData = await ddb.scan({ TableName: 'WebSocketConnections' }).promise();
  } catch (err) {
    console.error("DynamoDB Scan Error:", err);
    return { statusCode: 500, body: 'Failed to scan connections: ' + JSON.stringify(err) };
  }

  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: message
      }).promise();
    } catch (err) {
      console.error(`Failed to send to ${connectionId}:`, err);
    }
  });

  await Promise.all(postCalls);

  return { statusCode: 200, body: 'Message sent.' };
};
