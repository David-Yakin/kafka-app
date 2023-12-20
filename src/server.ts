import express from "express";
import chalk from "chalk";
const app = express();
import { getMessageFromKafka } from "./kafka/consumer";
import { sendKafkaMessage } from "./kafka/kafkaUtils";
import kafka from "./kafka/kafkaInstance";
import producer from "./kafka/kafkaProducer";

const PORT = 5000;
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
