import { main } from "./export.handler";
import dotenv from "dotenv";

dotenv.config({
  path: "../../.env"
});

const event = {
  tableName: process.env.TABLE_NAME,
  questionFilter: "institute_ids%5B%5D=20&knowledge_area_ids%5B%5D=10"
};

main(event);
