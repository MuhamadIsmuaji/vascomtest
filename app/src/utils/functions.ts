import * as crypto from "crypto";

// eslint-disable-next-line import/prefer-default-export
export function makeHash(length: number) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function hashValue(value: number | string): string {
  return crypto.createHash("shake256", { outputLength: 8 }).update(value.toString()).digest("hex");
}

