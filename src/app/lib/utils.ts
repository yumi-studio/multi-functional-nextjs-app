import { clsx, type ClassValue } from "clsx";
import { Bounce, toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

/**
 * 1: 24-12-2026 13:30
 */
type DateTimeFormatVariant = 1 | 2;
export const formatDateTime = (datetime: Date | string, variant: DateTimeFormatVariant = 1) => {
  let targetDateTime: Date;
  if (typeof datetime === "string") {
    targetDateTime = new Date(datetime);
  } else if (datetime instanceof Date) {
    targetDateTime = datetime;
  } else {
    return "###";
  }

  if (variant === 1) {
    const d = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(targetDateTime);

    const get = (type: string) => d.find(p => p.type === type)?.value;

    return `${get('day')}-${get('month')}-${get('year')} ${get('hour')}:${get('minute')}`;
  } else {
    return datetime.toLocaleString();
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Split class list into string and merge again with media query prefix
 * 
 * Ex: "w-full h-full" + lg => "lg:w-full lg:h-full"
 */
export function cnMedia(input: ClassValue, mediaQuery: string) {
  return input?.toString().split(" ").map(cl => `${mediaQuery}:${cl}`).join(" ");
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
