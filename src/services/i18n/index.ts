import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getOptions } from "./config";

const initI18next = async (language: string, namespace: string) => {
  // On server side we create a new instance for each render, because during
  // compilation everything seems to be executed in parallel
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(language, namespace));

  return i18nInstance;
};

export async function getServerTranslation(
  language: string,
  namespace: string | string[],
  options: { keyPrefix?: string } = {}
) {
  const i18nextInstance = await initI18next(
    language,
    Array.isArray(namespace) ? namespace[0] : namespace
  );

  return {
    t: i18nextInstance.getFixedT(
      language,
      Array.isArray(namespace) ? namespace[0] : namespace,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}

// // Server-side instance cache with WeakRef
// const instanceCache = new Map<
//   string,
//   WeakRef<ReturnType<typeof createInstance>>
// >();
// const cleanup = new FinalizationRegistry((key: string) => {
//   instanceCache.delete(key);
// });

// export const initI18next = async (language: string, namespace: string) => {
//   const cacheKey = `${language}:${namespace}`;
//   const cached = instanceCache.get(cacheKey)?.deref();

//   if (cached) return cached;

//   const i18nInstance = createInstance();
//   await i18nInstance
//     .use(initReactI18next)
//     .use(
//       resourcesToBackend(async (lang: string, ns: string) => {
//         try {
//           return await import(`./locales/${lang}/${ns}.json`);
//         } catch {
//           return await import(`./locales/${fallbackLanguage}/${ns}.json`);
//         }
//       })
//     )
//     .init({
//       ...getOptions(language, namespace),
//       partialBundledLanguages: true,
//       serializeConfig: false,
//     });

//   instanceCache.set(cacheKey, new WeakRef(i18nInstance));
//   cleanup.register(i18nInstance, cacheKey);

//   return i18nInstance;
// };

// export async function getServerTranslation(
//   language: string,
//   namespace: string | string[],
//   options: { keyPrefix?: string } = {}
// ) {
//   const effectiveNamespace = Array.isArray(namespace)
//     ? namespace[0]
//     : namespace;
//   const validatedLang = languages.includes(language as any)
//     ? language
//     : fallbackLanguage;

//   const i18nextInstance = await initI18next(validatedLang, effectiveNamespace);

//   return {
//     t: i18nextInstance.getFixedT(
//       validatedLang,
//       effectiveNamespace,
//       options.keyPrefix
//     ),
//     i18n: i18nextInstance,
//   };
// }

// // Client-side initialization singleton
// if (typeof window !== "undefined" && !(window as any).__i18n_initialized) {
//   import("i18next-browser-languagedetector").then(
//     ({ default: LanguageDetector }) => {
//       createInstance()
//         .use(initReactI18next)
//         .use(LanguageDetector)
//         .use(
//           resourcesToBackend(
//             (language: string, namespace: string) =>
//               import(`./locales/${language}/${namespace}.json`)
//           )
//         )
//         .init({
//           ...getOptions(),
//           detection: {
//             order: ["path", "htmlTag", "cookie", "navigator"],
//             caches: ["cookie"],
//             cookieOptions: {
//               sameSite: "strict",
//               secure: process.env.NODE_ENV === "production",
//             },
//           },
//           react: {
//             useSuspense: false,
//           },
//         });
//       (window as any).__i18n_initialized = true;
//     }
//   );
// }
