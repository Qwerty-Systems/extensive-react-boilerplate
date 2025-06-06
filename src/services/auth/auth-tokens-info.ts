// import { TokensInfo } from "./auth-context";
// import { AUTH_TOKEN_KEY } from "./config";

// // export function getTokensInfo() {
// //   return JSON.parse(Cookies.get(AUTH_TOKEN_KEY) ?? "null") as TokensInfo;
// // }

// // export function setTokensInfo(tokens: TokensInfo) {
// //   if (tokens) {
// //     Cookies.set(AUTH_TOKEN_KEY, JSON.stringify(tokens));
// //   } else {
// //     Cookies.remove(AUTH_TOKEN_KEY);
// //   }
// // }

// export function getTokensInfo(): TokensInfo | null {
//   const tokens = localStorage.getItem(AUTH_TOKEN_KEY);
//   return tokens ? JSON.parse(tokens) : null;
// }

// export function setTokensInfo(tokens: TokensInfo | null): void {
//   if (tokens) {
//     localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokens));
//   } else {
//     localStorage.removeItem(AUTH_TOKEN_KEY);
//   }
// }

import { TokensInfo } from "./auth-context";
import Cookies from "js-cookie";
import { AUTH_TOKEN_KEY } from "./config";

// Set to 7 days expiration
const TOKEN_EXPIRATION_DAYS = 7;

export function getTokensInfo() {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  return token ? (JSON.parse(token) as TokensInfo) : null;
}
export function setTokensInfo(tokens: TokensInfo) {
  if (tokens) {
    Cookies.set(AUTH_TOKEN_KEY, JSON.stringify(tokens), {
      expires: TOKEN_EXPIRATION_DAYS,
      path: "/",
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    Cookies.remove(AUTH_TOKEN_KEY);
  }
}
// const secureStorage = {
//   set: (key: string, value: string) => {
//     if (typeof window !== "undefined") {
//       const encrypted = encrypt(value); // Implement encryption
//       localStorage.setItem(key, encrypted);
//     }
//   },
//   get: (key: string) => {
//     if (typeof window !== "undefined") {
//       const value = localStorage.getItem(key);
//       return value ? decrypt(value) : null;
//     }
//     return null;
//   },
// };
