import { bidiCharacters } from "./bidiCharacters";

export function isRtl(char: string): boolean {
  for (const [key, ranges] of Object.entries(bidiCharacters)) {
    for (const range of ranges) {
      const [start, end] = range.split("-").map((c) => c.charCodeAt(0));
      if (char.charCodeAt(0) >= start && char.charCodeAt(0) <= (end || start)) {
        return key === "R" || key === "AL";
      }
    }
  }
  return false;
}

export function dominantStrongDirection(s: string): "rtl" | "ltr" {
  let rtlCount = 0;
  let ltrCount = 0;
  for (const char of s) {
    if (isRtl(char)) {
      rtlCount++;
    } else {
      ltrCount++;
    }
  }
  return rtlCount > ltrCount ? "rtl" : "ltr";
}
