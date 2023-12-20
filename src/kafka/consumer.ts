import chalk from "chalk";
import { Kafka } from "kafkajs";

export const getMessageFromKafka = async (
  kafkaInstance: Kafka,
  groupId: string,
  topic: string
) => {
  try {
    const consumer = kafkaInstance.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }) =>
        console.log(chalk.blueBright(message.value)),
    });
  } catch (error) {
    if (error instanceof Error) return Promise.reject(error);
  }
};
