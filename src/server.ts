import express from "express";
import chalk from "chalk";
const app = express();
import { config } from "dotenv";
config();
import router from "./router/router";
import morgan from "./logger/morgan";
import cors from "./cors/cors";
import { handleServerError } from "./utils/handleErrors";
const { EXPRESS_BASE_URL, EXPRESS_PORT } = process.env;
import { Partitioners, Kafka } from "kafkajs";

app.use(morgan);
app.use(cors);
app.use(express.json());
app.use(express.text());
app.use(router);
app.use(handleServerError);

// const kafka = new Kafka({
//   clientId: "my-app",
//   brokers: ["kafka1:9092", "kafka2:9092"],
// });

const kafka = new Kafka({
  clientId: "my-app",
  brokers: async () => {
    // Example getting brokers from Confluent REST Proxy
    const clusterResponse = await fetch("https://kafka-rest:8082/v3/clusters", {
      //@ts-ignore
      headers: "application/vnd.api+json",
    }).then((response) => response.json());

    const clusterUrl = clusterResponse.data[0].links.self;
    console.log(clusterUrl);

    const brokersResponse = await fetch(`${clusterUrl}/brokers`, {
      //@ts-ignore
      headers: "application/vnd.api+json",
    }).then((response) => response.json());

    //@ts-ignore
    const brokers = brokersResponse.data.map((broker) => {
      const { host, port } = broker.attributes;
      return `${host}:${port}`;
    });
    return brokers;
  },
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const sendKafkaMessage = async (topic: string, message: string) => {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    await producer.disconnect();
  } catch (error) {
    return Promise.reject(error);
  }
};

const connectToKafka = async () => {
  try {
    await sendKafkaMessage("test-topic", "Hello KafkaJS user!");
    return "Message send to kafka!";
  } catch (error) {
    return Promise.reject(error);
  }
};

const getMessageFromKafka = async () => {
  try {
    const consumer = kafka.consumer({ groupId: "test-group" });
    console.log(1);

    await consumer.connect();

    console.log(2);
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
    console.log(3);
    await consumer.run({
      eachMessage: async ({ message }: any) => {
        console.log(chalk.greenBright(message.value));
      },
    });
    console.log(4);
  } catch (error) {
    if (error instanceof Error) return Promise.reject(error);
  }
};

app.listen(EXPRESS_PORT, () => {
  console.log(
    chalk.yellowBright(`listening on: ${EXPRESS_BASE_URL}${EXPRESS_PORT}`)
  );

  connectToKafka()
    .then((message) => {
      console.log(chalk.greenBright(`ConnectToKafka message: ${message}`));
      getMessageFromKafka()
        .then((message) =>
          console.log(
            chalk.greenBright(`GetMessageFromKafka message: ${message}`)
          )
        )
        .catch((err) =>
          console.log(
            chalk.redBright(`GetMessageFromKafka Error: ${err.message}`)
          )
        );
    })
    .catch((error) =>
      console.log(chalk.redBright(`ConnectToKafka Error: ${error}`))
    );
});
