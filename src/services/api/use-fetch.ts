"use client";

import { useCallback } from "react";
import { FetchInputType, FetchInitType } from "./types/fetch-params";
import useLanguage from "../i18n/use-language";
// import { useKeycloak } from "@react-keycloak/web";
import { AUTH_REFRESH_URL } from "./config";
import { getTokensInfo, setTokensInfo } from "../auth/auth-tokens-info";

// function useFetch() {
//   const language = useLanguage();
//   const { keycloak } = useKeycloak();

//   return useCallback(
//     async (input: FetchInputType, init?: FetchInitType) => {
//       // Ensure token is fresh before making requests
//       if (keycloak.authenticated) {
//         try {
//           await keycloak.updateToken(60); // Refresh token if it expires within 60 seconds
//         } catch (error) {
//           console.error("Failed to refresh token:", error);
//           keycloak.logout();
//           throw error;
//         }
//       }

//       let headers: HeadersInit = {
//         "x-custom-lang": language,
//       };

//       if (!(init?.body instanceof FormData)) {
//         headers = {
//           ...headers,
//           "Content-Type": "application/json",
//         };
//       }

//       if (keycloak.token) {
//         headers = {
//           ...headers,
//           Authorization: `Bearer ${keycloak.token}`,
//         };
//       }

//       return fetch(input, {
//         ...init,
//         headers: {
//           ...headers,
//           ...init?.headers,
//         },
//       });
//     },
//     [language, keycloak]
//   );
// }

function useFetch() {
  const language = useLanguage();

  return useCallback(
    async (input: FetchInputType, init?: FetchInitType) => {
      const tokens = getTokensInfo();

      let headers: HeadersInit = {
        "x-custom-lang": language,
      };

      if (!(init?.body instanceof FormData)) {
        headers = {
          ...headers,
          "Content-Type": "application/json",
        };
      }

      if (tokens?.token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${tokens.token}`,
        };
      }

      if (tokens?.tokenExpires && tokens.tokenExpires - 60000 <= Date.now()) {
        const newTokens = await fetch(AUTH_REFRESH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.refreshToken}`,
          },
        }).then((res) => res.json());

        if (newTokens.token) {
          setTokensInfo({
            token: newTokens.token,
            refreshToken: newTokens.refreshToken,
            tokenExpires: newTokens.tokenExpires,
          });

          headers = {
            ...headers,
            Authorization: `Bearer ${newTokens.token}`,
          };
        }
      }

      return fetch(input, {
        ...init,
        headers: {
          ...headers,
          ...init?.headers,
        },
      });
    },
    [language]
  );
}

export default useFetch;
