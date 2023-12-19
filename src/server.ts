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

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
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
    return "Connect to kafka and Message send!";
  } catch (error) {
    return Promise.reject(error);
  }
};

const getMessageFromKafka = async () => {
  try {
    const consumer = kafka.consumer({ groupId: "test-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }: any) => {
        console.log(chalk.greenBright(message.value));
      },
    });
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
