import { Partitioners } from "kafkajs";
import kafka from "./kafkaInstance";

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

export default producer;
