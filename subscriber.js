const AWS = require('aws-sdk');

const sqs = new AWS.SQS({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
});

const QUEUE_NAME = 'test-queue';

async function getQueueUrl() {
  const params = {
    QueueName: QUEUE_NAME,
  };

  try {
    const data = await sqs.getQueueUrl(params).promise();
    console.log(data);
    return data.QueueUrl;
  } catch (e) {
    console.error('Error getting queue URL: ', e);
  }
}

async function receiveMessage(queueUrl) {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 10,
  };

  try {
    const data = await sqs.receiveMessage(params).promise();
    console.log(data);
    return data.Messages || [];
  } catch (e) {
    console.error('Error receiving message: ', e);
  }
}

async function setVisibilityTimeout(queueUrl, receiptHandle, timeout) {
  const params = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
    VisibilityTimeout: timeout,
  };

  try {
    const data = await sqs.changeMessageVisibility(params).promise();
    console.log(data);
  } catch (e) {
    console.error('Error changing visibility timeout: ', e);
  }
}

async function deleteMessage(queueUrl, receiptHandle) {
  const params = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  };

  try {
    const data = await sqs.deleteMessage(params).promise();
    console.log(data);
  } catch (e) {
    console.error('Error deleting message: ', e);
  }
}

(async () => {
  const queueUrl = await getQueueUrl();
  console.log('Queue URL: ', queueUrl);
  if (queueUrl) {
    setInterval(async () => {
      const messages = await receiveMessage(queueUrl);
      for (const message of messages) {
        console.log('Message received: ', message);

        // Set visibility timeout to 30 seconds
        await setVisibilityTimeout(queueUrl, message.ReceiptHandle, 30);

        setTimeout(async () => {
          console.log('Processing message: ', message);
          // Simulate message processing
          await deleteMessage(queueUrl, message.ReceiptHandle);
        }, 5000); // Simulate 5 secs of processing time
      }
    }, 1000); // Poll every second
  }
})();
