import express from "express";
import chalk from "chalk";
const app = express();
import { config } from "dotenv";
config();
import router from "./router/router";
import morgan from "./logger/morgan";
import cors from "./cors/cors";
import { handleServerError } from "./utils/handleErrors";
const { EXPRESS_PORT } = process.env;
import { Partitioners, Kafka, Producer } from "kafkajs";
import { getMessageFromKafka } from "./kafka/consumer";
import { sendKafkaMessage } from "./kafka/producers";

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

const PORT = EXPRESS_PORT || 5000;
app.listen(PORT, () => {
  console.log(chalk.yellowBright(`listening on: "http://localhost: ${PORT}}`));

  sendKafkaMessage(producer, "test-topic", "Hello KafkaJS user!")
    .then(() => {
      console.log(chalk.magentaBright(`Connected Successful To Kafka`));
      getMessageFromKafka(kafka, "test-group").catch((err) =>
        console.log(
          chalk.redBright(`GetMessageFromKafka Error: ${err.message}`)
        )
      );
    })
    .catch((error) =>
      console.log(chalk.redBright(`ConnectToKafka Error: ${error}`))
    );
});
