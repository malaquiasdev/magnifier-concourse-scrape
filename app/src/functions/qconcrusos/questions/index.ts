import { main } from "./service";

export async function handler(event): Promise<any> {
  return main(event);
}
