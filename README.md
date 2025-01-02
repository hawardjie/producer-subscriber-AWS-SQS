# Goal: To simulate producer and consumer messages from AWS SQS

## Prerequisites:

Install AWS SDK

```
$ npm install aws-sdk
```

Install localstack

```
$ docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
```

## Run the simulation

Run the producer from a terminal

```
$ node producer.js
```

Run the consumer from another terminal

```
$ node consumer.js
```
