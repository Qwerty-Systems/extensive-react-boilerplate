"use client";

import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import Cookies from "js-cookie";
import {
  Language,
  StoreLanguageActionsContext,
  StoreLanguageContext,
} from "./store-language-context";
import { cookieName, fallbackLanguage } from "./config";

function StoreLanguageProvider(props: PropsWithChildren<{}>) {
  const [language, setLanguageRaw] = useState<Language>(
    () => Cookies.get(cookieName) ?? fallbackLanguage
  );

  const setLanguage = useCallback((language: Language) => {
    Cookies.set(cookieName, language ?? fallbackLanguage);
    setLanguageRaw(language ?? fallbackLanguage);
  }, []);

  const contextValue = useMemo(() => ({ language }), [language]);

  const contextActionsValue = useMemo(
    () => ({
      setLanguage,
    }),
    [setLanguage]
  );

  return (
    <StoreLanguageContext.Provider value={contextValue}>
      <StoreLanguageActionsContext.Provider value={contextActionsValue}>
        {props.children}
      </StoreLanguageActionsContext.Provider>
    </StoreLanguageContext.Provider>
  );
}

export default StoreLanguageProvider;
// "use client";

// import {
//   PropsWithChildren,
//   useCallback,
//   useMemo,
//   useState,
//   useEffect,
// } from "react";
// import Cookies from "js-cookie";
// import {
//   StoreLanguageActionsContext,
//   StoreLanguageContext,
// } from "./store-language-context";
// import { cookieName, fallbackLanguage, languages } from "./config";

// export default function StoreLanguageProvider({ children }: PropsWithChildren) {
//   const [language, setLanguageRaw] = useState<string>(() => {
//     if (typeof window === "undefined") return fallbackLanguage;
//     const cookieValue = Cookies.get(cookieName);
//     return cookieValue && languages.includes(cookieValue as any)
//       ? cookieValue
//       : fallbackLanguage;
//   });

//   const setLanguage = useCallback((newLanguage: string) => {
//     const validLanguage = languages.includes(newLanguage as any)
//       ? newLanguage
//       : fallbackLanguage;

//     Cookies.set(cookieName, validLanguage, {
//       expires: 7,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     setLanguageRaw(validLanguage);
//   }, []);

//   // Memory cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (typeof window !== "undefined") {
//         window.__i18n_initialized = false;
//       }
//     };
//   }, []);

//   const contextValue = useMemo(() => ({ language }), [language]);
//   const contextActionsValue = useMemo(() => ({ setLanguage }), [setLanguage]);

//   return (
//     <StoreLanguageContext.Provider value={contextValue}>
//       <StoreLanguageActionsContext.Provider value={contextActionsValue}>
//         {children}
//       </StoreLanguageActionsContext.Provider>
//     </StoreLanguageContext.Provider>
//   );
// }
