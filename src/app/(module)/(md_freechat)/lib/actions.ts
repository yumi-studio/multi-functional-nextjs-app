"use server";

import { randomInt } from "@/app/lib/utils";
import { LoremIpsum } from "lorem-ipsum";
import { Message } from "./types";

const lorem = new LoremIpsum();
let counter = 0;

export const getMessages = async (): Promise<Message[]> => {
  return [];
}
