import { main } from "./service";

export async function handler(event): Promise<string> {
  return main(event);
}
