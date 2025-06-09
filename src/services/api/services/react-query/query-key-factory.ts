// import { QueryKey } from "@tanstack/react-query";

// type QueryKeyFactory<T extends string> = Record<
//   T,
//   (...args: any[]) => QueryKey
// >;

// export function createQueryKeys<T extends string>(
//   baseKey: string,
//   keys: Record<T, (...args: any[]) => any>
// ): QueryKeyFactory<T> {
//   return Object.entries(keys).reduce((acc, [key, value]) => {
//     return {
//       ...acc,
//       [key]: (...args: any[]) => {
//         const result = value(...args);
//         return Array.isArray(result)
//           ? [baseKey, key, ...result]
//           : [baseKey, key, result];
//       },
//     };
//   }, {} as QueryKeyFactory<T>);
// }
