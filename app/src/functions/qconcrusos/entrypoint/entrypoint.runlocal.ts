import { EntryPointService } from "./service/entrypoint.service";
import dotenv from "dotenv";
import { EntryPointInput } from "../types/entrypoint.input";

dotenv.config({
  path: "../../.env"
});

async function entrypointRunLocal() {
  const input: EntryPointInput = {
    url: "https://www.qconcursos.com/questoes-de-concursos/questoes?institute_ids%5B%5D=20&knowledge_area_ids%5B%5D=10&page=38",
    mails: ["mateus.malaquias1@gmail.com"]
  };
  const service = new EntryPointService();
  await service.saveEntryPointSate(
    input,
    "9439989f-7543-11e6-8dda-150c09a55dc2"
  );
}

entrypointRunLocal();
