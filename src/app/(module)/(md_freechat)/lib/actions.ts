"use server";

import { randomInt } from "@/app/lib/utils";
import { LoremIpsum } from "lorem-ipsum";
import { Message } from "./types";

const lorem = new LoremIpsum();
let counter = 0;

export const getMessages = async (): Promise<Message[]> => {
  if (counter >= 100) {
    counter = 0;
    return [];
  }
  const items = Array.from<Message>({ length: 20 }).map((v, k) => {
    counter++;
    return {
      id: counter,
      content: lorem.generateSentences(randomInt(1, 10)),
      isOwner: !!randomInt(0, 1),
    };
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  return items;
}
