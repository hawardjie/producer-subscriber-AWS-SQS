const AWS = require('aws-sdk');

const sqs = new AWS.SQS({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
});

const QUEUE_NAME = 'test-queue';

async function createQueue() {
  const params = {
    QueueName: QUEUE_NAME,
  };

  try {
    const data = await sqs.createQueue(params).promise();
    console.log(data);
    return data.QueueUrl;
  } catch (e) {
    console.error('Error creating queue: ', e);
  }
}

async function sendMessage(queueUrl, message) {
  // const params = {
  //   MessageBody: 'Hello from SQS!',
  //   QueueUrl: `http://localhost:4566/000000000000/${QUEUE_NAME}`,
  // };
  const params = {
    MessageBody: message,
    QueueUrl: queueUrl,
  };

  try {
    const data = await sqs.sendMessage(params).promise();
    console.log(data);
  } catch (e) {
    console.error('Error sending message: ', e);
  }
}

// Main function
(async () => {
  const queueUrl = await createQueue();
  console.log('Queue URL: ', queueUrl);
  if (queueUrl) {
    await sendMessage(queueUrl, 'Hello from SQS!');
  }
})();
