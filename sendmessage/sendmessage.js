// sendmessage.js
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const message = body.message;
  const connectionId = event.requestContext.connectionId;

  try {
    // 1) Fetch all active connections (to broadcast)
    const connections = await ddb.scan({ TableName: 'Connections' }).promise();

    // 2) Prepare API Gateway Management client
    const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
    const apigw = new AWS.ApiGatewayManagementApi({ endpoint });

    // 3) Post the message to every connection
    const postCalls = connections.Items.map(async ({ connectionId: cid }) => {
      try {
        await apigw.postToConnection({
          ConnectionId: cid,
          Data: JSON.stringify({ message, from: connectionId })
        }).promise();
      } catch (e) {
        if (e.statusCode === 410) {
          // stale connection, delete it
          await ddb.delete({ TableName: 'Connections', Key: { connectionId: cid } }).promise();
        }
      }
    });

    await Promise.all(postCalls);
    return { statusCode: 200, body: 'Message sent.' };
  } catch (error) {
    console.error("Error sending message:", error);
    return { statusCode: 500, body: 'Failed to send message.' };
  }
};
